import { View, Text, StyleSheet, Platform, Pressable, Image, ActivityIndicator, Modal, Alert } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { baseImageURL } from "../../settings";
import axiosInstance from "../../axios";
import { getItems, changeLoading } from '../../store/actions/itemActions.js';

export default function ItemCard({image, id, name, description, price, amount, navigation, date, inDetail}) {
  const [modalVisible, setModalVisible] = useState(false);
  const loading = useSelector(state => state.items.loading);
  const [imageError, setImageError] = useState(false);
  const imageObj = {'uri': baseImageURL + image};
  const [isBig, setIsBig] = useState(false);
  const color = useSelector(state => state.userData.color);

  const dispatch = useDispatch()

  const deleteItem = async () => {
    changeLoading(true);
    await axiosInstance
    .post(`jobs/items/delete/${id}/`, { action: 'delete'},
    { headers: {
      'content-Type': 'multipart/form-data',
    }})
    .then(function(response) {
      if (response.data.OK) {
        dispatch(getItems());
        navigation.navigate('Items');
        Alert.alert("Item deleted");
      }
    })
    .catch(function(error) {
        console.error('Error deleting a client:', error);
    });
  };

  const handleDelete = () => {
    setModalVisible(true)
  };

  const toggleImageSize = () => {
    setIsBig((prev) => !prev);
  };

  return (
    <View style={[styles.card, {borderColor: color}]}>
        <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.name}>Stock: {amount}</Text>
        </View>
        <View style={styles.dataContainer}>
            <View style={styles.dataContainer}>
                {imageError ?
                <Text style={[styles.LabelText, { alignSelf: 'center'}]}>image not found </Text>
                :
                <Pressable onPress={toggleImageSize}>
                  <Image 
                  style={[styles.image, {width: isBig ? 400: 120, height: isBig ? 400 : 80}]} 
                  source={{ uri: imageObj.uri }}
                  onError={() => setImageError(true)}
                  />
                </Pressable>
                }
            </View>
            <View style={{flex: 1, paddingLeft: 5}}>
                <Text style={[styles.name, {textAlign: 'left'}]}>{description}</Text>
                <Text style={styles.LabelText}>Price: ${price}</Text>
                { inDetail ?
                <View style={[styles.dataContainer, {justifyContent: 'space-evenly'}]}>
                  <Pressable onPress={() => navigation.navigate('Edit Item', {id: id})}><MaterialCommunityIcons name="clipboard-edit-outline" size={30} /></Pressable>
                  <Pressable onPress={() => handleDelete()}><MaterialCommunityIcons name="delete-outline" color='red' size={30} /></Pressable>
                </View>
                : null}
            </View>
        </View>
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
                style={[styles.button, {marginHorizontal: 5, flex: 1}]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{color:'white', textAlign: 'center'}}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[[styles.button, {backgroundColor: 'red', marginHorizontal: 5, flex: 1}]]}
                onPress={() => deleteItem()}>
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
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 10,
    padding: 5,
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
    width: 120, 
    height: 80,
    alignSelf: 'center',
    borderBottomLeftRadius: 15,
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