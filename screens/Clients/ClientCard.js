import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Linking, Image, ActivityIndicator, Modal, Alert } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

import { baseImageURL } from "../../settings";
import axiosInstance from "../../axios";
import { getClients, changeLoading } from '../../store/actions/clientsActions.js';
import { darkMainColor, darkSecondColor, darkTtextColor, lightMainColor, lightSecondColor, lightTextColor } from '../../settings';


export default function ClientCard({image, id, name, address, phone, email, navigation, inDetail}) {
  const [modalVisible, setModalVisible] = useState(false);
  const {color, darkTheme} = useSelector(state => state.userData);
  const loading = useSelector(state => state.clients.loading);
  const [imageError, setImageError] = useState(false);
  const imageObj = {'uri': baseImageURL + image};
  const dispatch = useDispatch();

  const deleteClient = async () => {
    dispatch(changeLoading(true));
    await axiosInstance
    .post(`jobs/client/delete/${id}/`, { action: 'delete'},
    { headers: {
      'content-Type': 'multipart/form-data',
    }})
    .then(function(response) {
      console.log(response.data);
      if (response.data.OK) {
        dispatch(getClients());
        navigation.navigate('Clients');
        dispatch(changeLoading(false));
        Alert.alert("Client deleted");
      }
    })
    .catch(function(error) {
        console.error('Error deleting a client:', error);
    });
  };

  const handleDelete = () => {
    setModalVisible(true)
  };

  return (
    <View style={[styles.card, {borderColor: color, backgroundColor:darkTheme ? darkSecondColor: lightSecondColor}]}>
      <View style={[styles.nameContainer, {borderBottomColor:darkTheme ? darkTtextColor: lightTextColor}]}>
          <Text style={[styles.name, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{name}</Text>
          { inDetail ?
          <Pressable onPress={() => navigation.navigate('Edit Client', {id: id, defaultname: name, defaultaddress: address, defaultphone: phone, defaultemail: email, defaultimage: imageObj})}><MaterialCommunityIcons name="account-edit-outline" color={darkTheme ? darkTtextColor: lightTextColor} size={30} /></Pressable>
          :
          <Image 
          style={{width: 30, height: 30, borderRadius: 75}} 
          source={{ uri: imageObj.uri }}
          onError={() => setImageError(true)}
          />
          }
      </View>
      <View style={styles.dataContainer}>
          <Text style={[styles.LabelText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>Address: </Text>
          <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps?q=${address}`)}><Text style={[styles.dataText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{address}</Text></Pressable>
      </View>
      <View style={styles.dataContainer}>
          <Text style={[styles.LabelText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>Phone: </Text>
          <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}><Text style={[styles.dataText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{phone}</Text></Pressable>
      </View>
      <View style={styles.dataContainer}>
          <Text style={[styles.LabelText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>Email: </Text>
          <Pressable onPress={() => Linking.openURL(`mailto:${email}`)}><Text style={[styles.dataText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{email}</Text></Pressable>
      </View>
      {inDetail ?
      <View style={styles.dataContainer}>
        <View style={{width:30}}></View>
        {imageError ?
        <Text style={[styles.LabelText, { alignSelf: 'center'}]}>image not found </Text>
        :
        <Image 
        style={styles.image} 
        source={{ uri: imageObj.uri }}
        onError={() => setImageError(true)}
        />
        }
        <Pressable style={{alignSelf: 'flex-end', width:30}} onPress={() => handleDelete()}><MaterialCommunityIcons name="delete-outline" color='red' size={30} /></Pressable>
      </View>
      : null}
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
            <Text style={[styles.name, {padding: 10}]}>Do you want to delete {name}?</Text>
            <View style={[styles.dataContainer, {padding: 10, justifyContent: 'space-evenly'}]}>
              <Pressable
                style={[styles.button, {marginHorizontal: 5, flex: 1, backgroundColor: color}]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{color:'white', textAlign: 'center'}}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[[styles.button, {backgroundColor: 'red', marginHorizontal: 5, flex: 1}]]}
                onPress={() => deleteClient()}>
                <Text style={{color:'white', textAlign: 'center'}}>DELETE</Text>
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
      fontSize: 14,
  },
  image: {
    width: 100, 
    height: 100,
    alignSelf: 'center',
    borderRadius: 75,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },    
  button: {
    backgroundColor: '#694fad',
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