import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { useRoute } from '@react-navigation/native';
import axiosInstance from '../../axios.js';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../store/actions/itemActions.js";

import { baseImageURL } from "../../settings.js";


export default function ItemUpdate({navigation}) {
    const route = useRoute();
    const item = useSelector(state => state.items.item);
    const imageObj = {'uri': baseImageURL + item.image};
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [amount, setAmount] = useState(item.amount);
    const [price, setPrice] = useState(item.price);
    const [image, setImage] = useState(imageObj);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const color = useSelector(state => state.userData.color);
    const dispatch = useDispatch()

    const validateForm = () => {
        let errors = {};
        if (!name) errors.name = "Name is required";
        if (!price) errors.price = "Price is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
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

    const submitForm = async (name, description, amount, price) => {
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('name', name);
        formData.append('description', description);
        formData.append('amount', amount);
        formData.append('price', price);
        if (image !== null) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `${name}ItemPicture.${fileType}`;
            formData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            })
        };
        await axiosInstance
        .post(`jobs/items/update/${item.id}/`, formData,
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch(getItems());
                navigation.navigate('Items');
                setIsLoading(false);
            }
            setError(response.data.message);
            setIsLoading(false);
        })
        .catch(function(error) {
            console.error('Error creating an item:', error.message);
            setIsLoading(false);
            setError(error.message);
        });
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setIsLoading(true);
            submitForm(name, description, amount, price);
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
                <ScrollView>
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={name ? name : "Enter item's name"}
                        value={name}
                        onChangeText={setName}
                    />
                    {errors.name ? (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    ) : null}

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter item's description (optional)"
                        value={description}
                        onChangeText={setDescription}
                    />
                    {errors.description ? (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    ) : null}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter item's amount"
                        value={amount.toString()}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                    {errors.amount ? (
                        <Text style={styles.errorText}>{errors.amount}</Text>
                    ) : null}
                    
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter item's price"
                        value={price.toString()}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    {errors.price ? (
                        <Text style={styles.errorText}>{errors.price}</Text>
                    ) : null}
                    
                    {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleImage()}><Text style={[styles.headerText, {color: 'white'}]}>Add image</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => takePhoto()}><Text style={[styles.headerText, {color: 'white'}]}>Take Photo</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleSubmit()}><Text style={[styles.headerText, {color: 'white'}]}>Save</Text></TouchableOpacity>
                </ScrollView>
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
        width: 150,
        height: 150,
        borderRadius: 75,
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