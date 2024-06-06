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
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { baseImageURL } from "../../settings";
import { useRoute } from '@react-navigation/native';
import { setSpent, editSpent, getSpents } from "../../store/actions/spentActions.js";


export default function SpentUpdate({navigation}) {
    const route = useRoute();
    const spents = useSelector(state => state.spents.spents);
    const spent = useSelector(state => state.spents.spent);
    const isLoading = useSelector(state => state.spents.loading);
    const message = useSelector(state => state.spents.message);
    const error = useSelector(state => state.spents.error);
    const job = useSelector(state => state.jobs.job);
    const [description, setDescription] = useState(spent.description);
    const [price, setPrice] = useState(spent.amount);
    const [image, setImage] = useState(null);
    const color = useSelector(state => state.userData.color);
    const dispatch = useDispatch();


    useEffect(() => {
        const spent = spents.filter((item) => item.id === route.params.id)
        dispatch(setSpent(spent[0]));
        const imageObj = {'uri': baseImageURL + spent[0].image};
        setImage(imageObj)
    }, []);

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          alert('Permission to access camera is required!');
          return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = () => {
        dispatch(editSpent(spent.id, description, price, image));
        navigation.navigate('Job Details', {id: job.id});
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
                <Text style={[styles.label, {marginBottom: 5}]}>Spent of {job.description}</Text>

                
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder={description}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder={price ? price.toString() : null}
                    value={price ? price.toString() : null}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                
                {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleImage()}><Text style={[styles.headerText, {color: 'white'}]}>Add image</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => takePhoto()}><Text style={[styles.headerText, {color: 'white'}]}>Take Photo</Text></TouchableOpacity>
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
    image: {
        width: 200,
        height: 150,
        borderRadius: 15,
        alignSelf: 'center',
    },
    button: {
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