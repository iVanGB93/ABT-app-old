import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Platform,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axios.js';
import SelectDropdown from 'react-native-select-dropdown';
import { getJobs } from '../../store/actions/jobsActions';


export default function JobCreate({navigation}) {
    const clients = useSelector(state => state.clients.clients)
    const clientname = useSelector(state => state.clients.client);
    const [client, setClient] = useState("");
    const [description, setDescription] = useState("");
    const [clientsNames, setClientsNames] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const {color, userName} = useSelector(state => state.userData);
    const dispatch = useDispatch();

    useEffect(() => {
        const clientsNames = clients.map((item) => item.user);
        setClientsNames(clientsNames);
    }, []);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (!isEnabled) {
            setAddress(clientAddress())
        }
    };

    const validateForm = () => {
        let errors = {};

        if (!client) errors.client = "Client is required";
        if (!description) errors.description = "Description is required";
        if (!address) errors.address = "Address is required";
        if (!price) errors.price = "Price is required";

        setErrors(errors);
        console.log("ERROS", errors)

        return Object.keys(errors).length === 0;
    };

    const submitForm = async (client, description, price, address) => {
        await axiosInstance
        .post(`jobs/create/${userName}/`, {
            action: 'new',
            name: client,
            description: description,
            price: price,
            address: address,
        },
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch(getJobs(userName));
                navigation.navigate('Jobs');
            }
            setError(response.data.message)
            setIsLoading(false);
        })
        .catch(function(error) {
            console.error('Error creating a job:', error);
            setIsLoading(false);
            setError(error.message);
        });
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setIsLoading(true);
            submitForm(client, description, price, address);
        }
    };

    const clientAddress = () => {
        let clientA = clients.find((clientA) => clientA.user === client);
        if (clientA !== undefined) {
            if ( clientA.address === "") {
                return "no address saved"
            }
            return clientA.address
        } else {
            return "no address submitted"
        }
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={styles.container}
        >
            { isLoading ?
            <ActivityIndicator style={styles.loading} size="large" />
            :
            <View style={styles.form}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}
                <Text style={styles.label}>Client</Text>
                <SelectDropdown
                    data={clientsNames}
                    onSelect={(selectedItem, index) => {
                        setClient(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    /* defaultButtonText={clientname.user}
                    defaultValue={() => clients.filter((item) => item.user === 'Mayra')} */
                    search={true}
                    searchPlaceHolder={"Type to search"}
                    buttonStyle={[styles.input, {width:300, height: 45, backgroundColor: 'transparent'}]}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', verticalAlign: 'middle'}}>
                    <Text style={[styles.label, {verticalAlign: 'middle'}]}>is a new client?</Text>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => navigation.navigate('ClientStack', {screen: 'New Client'})}><Text style={{color: 'white'}}>Create client</Text></TouchableOpacity>
                </View>
                {errors.client ? (
                    <Text style={styles.errorText}>{errors.client}</Text>
                ) : null}

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder={description ? description : "Enter job's description"}
                    value={description}
                    onChangeText={setDescription}
                />
                {errors.description ? (
                    <Text style={styles.errorText}>{errors.description}</Text>
                ) : null}

                <Text style={styles.label}>Address</Text>
                {isEnabled ?
                <Text style={styles.label}>{clientAddress()}</Text>
                :
                <TextInput
                    style={styles.input}
                    placeholder="Enter job's address"
                    value={address}
                    onChangeText={setAddress}
                />
                }
                {errors.address ? (
                    <Text style={styles.errorText}>{errors.address}</Text>
                ) : null}

                <View style={[styles.label, {flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', verticalAlign: 'middle'}]}>
                    <Switch
                        trackColor={{false: '#767577', true: color}}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={[styles.label, {flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', verticalAlign: 'middle'}]}>use client's address</Text>
                </View>
                
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter job's price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                {errors.price ? (
                    <Text style={styles.errorText}>{errors.price}</Text>
                ) : null}
                
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleSubmit()}><Text style={[styles.headerText, {color: 'white'}]}>Save</Text></TouchableOpacity>
            </View>
            }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      backgroundColor: "#f5f5f5",
    },
    form: {
      backgroundColor: "#ffffff",
      padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
    },
    input: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      marginBottom: 5,
      padding: 10,
      borderRadius: 5,
    },
    errorText: {
      color: "red",
      marginBottom: 5,
    },
    loading: {
        flex: 1,
        marginTop: 20,
        verticalAlign: 'middle',
        alignSelf: 'center',
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
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: "center",
        marginTop: 5,
    },
});