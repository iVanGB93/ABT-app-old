import { View, Text, StyleSheet, Platform, Pressable, Linking, Image, Modal, Alert, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";

import { baseImageURL } from "../../settings";
import { changeLoading, getJobs, getJob } from '../../store/actions/jobsActions';
import axiosInstance from "../../axios";
import { setClient } from "../../store/actions/clientsActions";


export default function JobCard({navigation, id, status, client, address, description, price, image, date, closed, inDetail, isList}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleFinish, setModalVisibleFinish] = useState(false);
  const {clients} = useSelector(state => state.clients);
  const loading = useSelector(state => state.jobs.loading);
  const [imageError, setImageError] = useState(false);
  const imageObj = {'uri': baseImageURL + image};
  const color = useSelector(state => state.userData.color);
  const dispatch = useDispatch();
  
  const statusIcon = (status) => {
    if (status === 'active') {
      return <MaterialCommunityIcons name="nut" color='orange' size={30} />
    } else if ( status === 'new') {
      return <MaterialCommunityIcons name="new-box" color='red' size={30} />
    } else {
      return <MaterialCommunityIcons name="notebook-check" color='green' size={30} />
    }
  };
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    /* second: '2-digit', */
  });

  const deleteJob = async () => {
    dispatch(changeLoading(true));
    await axiosInstance
    .post(`jobs/delete/${id}/`, { action: 'delete'},
    { headers: {
      'content-Type': 'multipart/form-data',
    }})
    .then(function(response) {
      if (response.data.OK) {
        dispatch(changeLoading(false));
        dispatch(getJobs());
        navigation.navigate('Jobs');
        Alert.alert(response.data.message);
      }
    })
    .catch(function(error) {
        dispatch(changeLoading(false));
        console.error('Error deleting a job:', error.message);
        Alert.alert(`Error deleting a job: ${error.message}`);
    });
  };

  const closeJob = async () => {
    dispatch(changeLoading(true));
    await axiosInstance
    .post(`jobs/update/${id}/`, { action: 'close'},
    { headers: {
      'content-Type': 'multipart/form-data',
    }})
    .then(function(response) {
      if (response.data.OK) {
        dispatch(changeLoading(false));
        /* dispatch(getJob(id)); */
        dispatch(getJobs());
        navigation.navigate('Jobs');
        Alert.alert(response.data.message);
      }
    })
    .catch(function(error) {
        dispatch(changeLoading(false));
        setModalVisible(false);
        console.error('Error closing a job:', error.message);
        Alert.alert(`Error closing a job: ${error.message}`);
    });
  };

  const handleDelete = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisibleFinish(true);
  };

  const handleInvoice = () => {
    let pickedClient = clients.find(pickedClient => pickedClient.user === client);
    dispatch(setClient(pickedClient));
    navigation.navigate('Invoice');
  };

  return (
    <View style={[styles.card, {borderColor: color}]}>
        <View style={styles.nameContainer}>
            <Text style={styles.name}>
            { inDetail ? 
            <Text>{statusIcon(status)} {client}</Text>
            : 
            description
            }
            </Text>
            <Pressable onPress={() => navigation.navigate('Update Job', {id: id})}><MaterialCommunityIcons name="note-edit-outline" color='black' size={30} /></Pressable>
        </View>
        { inDetail ?
        <View style={styles.dataContainer}>
            <Text style={styles.LabelText}>{description}</Text>
        </View>
        : null }
        <View style={styles.dataContainer}>
            <Text style={styles.LabelText}>Address: </Text>
            <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps?q=${address}`)}><Text style={styles.dataText}>{address}</Text></Pressable>
        </View>
        <View style={styles.dataContainer}>
            <Text style={styles.LabelText}>Price: </Text>
            <Text style={styles.dataText}>${price}</Text>
        </View>
        <View style={styles.dataContainer}>
            <Text style={styles.LabelText}>Date: </Text>
            <Text style={styles.dataText}>{formattedDate}</Text>
        </View>
        { isList ? null
        :
        ( inDetail ?
        (<View>
          <View style={{textAlign: 'center'}}>
            {imageError ?
            <Text style={[styles.LabelText, { alignSelf: 'center'}]}>image not found </Text>
            :
            <Image 
            style={styles.image} 
            source={{ uri: imageObj.uri }}
            onError={() => setImageError(true)}
            />
            }
          </View>
          <View style={[styles.dataContainer, { justifyContent: 'space-between'}]}>
            { (status === 'finished') ?
              (<Text style={{color: 'red'}}>Closed</Text>)
            :
              <Pressable style={{alignSelf: 'flex-start'}} onPress={() => handleClose()}><Text style={{flex: 1, verticalAlign: 'middle', alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'red'}}><MaterialCommunityIcons name="close" color='red' size={30} /></Text></Pressable>
            }
            <Pressable onPress={() => handleInvoice()}><Text style={styles.LabelText}>Invoice</Text></Pressable>
            <Pressable style={{alignSelf: 'flex-end'}} onPress={() => handleDelete()}><MaterialCommunityIcons name="delete-outline" color='red' size={30} /></Pressable>
          </View>
        </View>)
        : null)
        } 
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Action canceled.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          { loading ?
          <ActivityIndicator style={styles.loading} size="large" />
          :
          <View style={[styles.card, {padding: 10}]}>
            <Text style={[styles.name, {padding: 10}]}>Do you want to delete this job?</Text>
            <View style={[styles.dataContainer, {padding: 10, justifyContent: 'space-evenly'}]}>
              <Pressable
                style={[styles.button, {marginHorizontal: 5, flex: 1, backgroundColor: color}]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{color:'white', textAlign: 'center'}}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[[styles.button, {backgroundColor: 'red', marginHorizontal: 5, flex: 1}]]}
                onPress={() => deleteJob()}>
                <Text style={{color:'white', textAlign: 'center'}}>DELETE</Text>
              </Pressable>
            </View>
          </View>
          }
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFinish}
        onRequestClose={() => {
          Alert.alert('Action canceled.');
          setModalVisibleFinish(!modalVisibleFinish);
        }}>
        <View style={styles.centeredView}>
          { loading ?
          <ActivityIndicator style={styles.loading} size="large" />
          :
          <View style={[styles.card, {padding: 10}]}>
            <Text style={[styles.name, {padding: 10}]}>Did you finish this job?</Text>
            <View style={[styles.dataContainer, {padding: 10, justifyContent: 'space-evenly'}]}>
              <Pressable
                style={[styles.button, {marginHorizontal: 5, flex: 1, backgroundColor: color}]}
                onPress={() => setModalVisibleFinish(!modalVisibleFinish)}>
                <Text style={{color:'white', textAlign: 'center'}}>No</Text>
              </Pressable>
              <Pressable
                style={[[styles.button, {backgroundColor: 'red', marginHorizontal: 5, flex: 1}]]}
                onPress={() => closeJob()}>
                <Text style={{color:'white', textAlign: 'center'}}>Yes, close it</Text>
              </Pressable>
            </View>
          </View>
          }
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: "white",
      borderRadius: 16,
      borderWidth: 2,
      marginHorizontal: 10,
      padding: 10,
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
    nameContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      borderBottomWidth: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
    },
    dataContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },    
    LabelText: {
      fontSize: 16,
      fontWeight: "bold",
    },  
    dataText: {
        fontSize: 12,
        color: "darkblue"
    }, 
    image: {
      width: 150, 
      height: 100,
      alignSelf: 'center',
      borderRadius: 15,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },    
    button: {
      borderRadius: 16,
      padding: 10,
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
      verticalAlign: 'middle'
    },
});