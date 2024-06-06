import React, {useState, useEffect} from 'react';
import { View, Button, Text, StyleSheet, ScrollView, Modal, Pressable, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useSelector, useDispatch } from 'react-redux';

import { getCharges, getInvoice, setCharges, setInvoice } from '../../store/actions/jobsActions';
import { SENDGRID_API_KEY } from '@env';


export default function Invoice({navigation}) {
    const client = useSelector(state => state.clients.client);
    const {color, bussinessName, imageUri } = useSelector(state => state.userData);
    const [modalVisibleInvoice, setModalVisibleInvoice] = useState(false);
    const {job, invoice, error, loading, charges} = useSelector(state => state.jobs);
    const dispatch = useDispatch();
    

    useEffect(() => {
        dispatch(getInvoice(job.id));
        /* if (Object.keys(invoice).length !== 0 && invoice.job === job.id) {
            dispatch(getInvoice(job.id));
            dispatch(getCharges(invoice.id));
        } else {
            dispatch(setCharges([]));
            dispatch(setInvoice([]));
        } */
    }, []);

    const convertImageToBase64 = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        return `data:image/jpeg;base64,${base64}`;
    };

    const generateHTML  = (base64Image) => `
        <html>
            <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; }
                .invoice-title { font-size: 24px; font-weight: bold; }
                .invoice-number { font-size: 20px; font-weight: bold; }
                .details { margin-top: 20px; }
                .details p { margin: 5px 0; }
                .table { width: 100%; margin-top: 20px; border-collapse: collapse; }
                .table th, .table td { border: 1px solid #ddd; padding: 8px; }
                .table th { background-color: #f2f2f2; text-align: left; }
                .footer { margin-top: 20px; }
            </style>
            </head>
            <body>
            <div class="header">
                <img src=${base64Image} alt="logo-image" style="width: 100px;"/>
                <p class="invoice-title">${bussinessName}</p>
                <p class="invoice-number">Invoice #${invoice.number}</p>
                <p>${formatDate(new Date(invoice.date))}</p>
            </div>
            <div class="details">
                <p><strong>Bill to:</strong></p>
                <p>${client.user}</p>
                <p>${client.email}</p>
                <p>${client.phone}</p>
                <p>${client.address}</p>
            </div>
            <table class="table">
                <tr>
                <th>Description</th>
                <th>Amount</th>
                </tr>
                ${charges.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.amount}</td>
                </tr>
                `).join('')}
            </table>
            <div class="footer">
                <p><strong>Total:</strong> ${invoice.total}</p>
                <p><strong>PAID:</strong> ${invoice.paid}</p>
                <p><strong>Balance Due:</strong> ${invoice.due}</p>
            </div>
            </body>
        </html>
    `;

    const sendEmailWithAttachment = async () => {
        const apiKey = (SENDGRID_API_KEY);
        const htmlContent = generateHTML();
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const attachmentBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const emailData = {
          personalizations: [
            {
              to: [{ email: client.email }],
              subject: 'Invoice',
            },
          ],
          from: { email: 'admin@qbared.com' },
          content: [{ type: 'text/plain', value: "Hello, here is your invoice." }],
          attachments: [
            {
              content: attachmentBase64,
              filename: 'invoice.pdf',
              type: 'application/pdf',
              disposition: 'attachment',
            },
          ],
        };
      
        try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(emailData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al enviar email: ${errorData.errors[0].message}`);
            } else {
                alert("EMAIL ENVIADO");
            }
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            // Puedes manejar el error de manera apropiada aquí, como mostrar un mensaje al usuario o realizar otra acción.
        }
    };

    const createAndSendInvoice = async () => {
        try {
            const base64Image = await convertImageToBase64(imageUri);
            const htmlContent = generateHTML(base64Image);
            const { uri } = await Print.printToFileAsync({ html: htmlContent});
            if (uri) {
                const newFileUri = FileSystem.documentDirectory + `${bussinessName} Invoice ${invoice.number}.pdf`;
                console.log(newFileUri);
                await FileSystem.moveAsync({
                    from: uri,
                    to: newFileUri,
                });
                if (newFileUri) {
                    await Sharing.shareAsync(newFileUri);
                }
                // Delete the file after sharing
                // await FileSystem.deleteAsync(newFileUri);
            }
        } catch (error) {
            console.error('Error al generar o enviar el PDF:', error);
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        loading ?
        <ActivityIndicator style={styles.loading} size="large" />
        :
        Object.keys(invoice).length !== 0 ?
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.bussinessname}>{bussinessName}</Text>
                <Text style={styles.invoiceTitle}>Invoice #{invoice.number}</Text>
                <Text  style={styles.data}>{formatDate(new Date(invoice.date))}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.bold}>Bill to:</Text>
                <Text style={styles.data}>{client.user}</Text>
                <Text style={styles.data}>{client.email}</Text>
                <Text style={styles.data}>{client.phone}</Text>
                <Text style={styles.data}>{client.address}</Text>
            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Description</Text>
                <Text style={styles.tableHeader}>Amount</Text>
                </View>
                {charges.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                    <Text>{item.description}</Text>
                    <Text>{item.amount}</Text>
                </View>
                ))}
            </View>
            <View style={styles.footer}>
                <Text style={styles.data}>Total: ${invoice.total}</Text>
                <Text style={styles.data}>PAID: ${invoice.paid}</Text>
                <Text style={styles.data}>Balance Due: ${invoice.due}</Text>
            </View>
            {/* <Button title="Email Invoice" onPress={() => sendEmailWithAttachment()} /> */}
            <View style={styles.tableRow}>
                { invoice.closed ?
                <Button  title='Closed'/>
                :
                <TouchableOpacity style={[styles.button, {backgroundColor: color, width: 150, margin: 'auto'}]} onPress={() => navigation.navigate('Update Invoice')}><Text style={[styles.headerText, {color: 'white', textAlign: 'center'}]}>Change</Text></TouchableOpacity>
                }
                <TouchableOpacity style={[styles.button, {backgroundColor: color, width: 150, margin: 'auto'}]} onPress={() => createAndSendInvoice()}><Text style={[styles.headerText, {color: 'white', textAlign: 'center'}]}>Send Invoice</Text></TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleInvoice}
                onRequestClose={() => {
                Alert.alert('Action canceled.');
                setModalVisibleFinish(!modalVisibleInvoice);
                }}>
                <View style={styles.centeredView}>
                { loading ?
                <ActivityIndicator style={styles.loading} size="large" />
                :
                <View style={[styles.card, {padding: 10}]}>
                    <Text style={[styles.name, {padding: 10}]}>Do you want to create an invoice?</Text>
                    <View style={[styles.dataContainer, {padding: 10, justifyContent: 'space-evenly'}]}>
                    <Pressable
                        style={[styles.button, {marginHorizontal: 5, flex: 1, backgroundColor: color}]}
                        onPress={() => setModalVisibleInvoice(!modalVisibleInvoice)}>
                        <Text style={{color:'white', textAlign: 'center'}}>No</Text>
                    </Pressable>
                    <Pressable
                        style={[[styles.button, {backgroundColor: 'red', marginHorizontal: 5, flex: 1}]]}
                        onPress={() => generateInvoice()}>
                        <Text style={{color:'white', textAlign: 'center'}}>Yes</Text>
                    </Pressable>
                    </View>
                </View>
                }
                </View>
            </Modal>
        </ScrollView>
        :
        <View style={styles.container}>
            <Text style={[styles.invoiceTitle, {textAlign: 'center', margin: 'auto'}]}>{error}</Text> 
            <TouchableOpacity style={[styles.button, {backgroundColor: color, width: 150, margin: 'auto'}]} onPress={() => navigation.navigate('Create Invoice')}><Text style={[styles.headerText, {color: 'white', textAlign: 'center'}]}>Create</Text></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
      borderTopWidth: 1,
        borderTopColor: '#ddd', 
    },
    bussinessname: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    invoiceTitle: {
        textAlign:  'right',
        fontSize: 20,
      fontWeight: 'bold',
    },
    details: {
      marginVertical: 10,
    },
    bold: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    data: {
        fontSize: 15,
        textAlign: 'right',
    },  
    table: {
      width: '100%',
      marginTop: 20,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tableHeader: {
      fontWeight: 'bold',
    },
    footer: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#694fad',
        padding: 10,
        borderRadius: 16,
        margin: 5,
        ...Platform.select({
            ios: {
            shadowOffset: { width: 2, height: 2 },
            shadowColor: "#333",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            },
            android: {
            elevation: 5,
            },
        }),
    },
    loading: {
        flex: 1,
        marginTop: 20,
        verticalAlign: 'middle',
        alignSelf: 'center',
    },
});