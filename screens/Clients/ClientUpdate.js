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
import { getClients } from '../../store/actions/clientsActions.js';


export default function ClientCreate({navigation}) {
    const route = useRoute();
    const [name, setName] = useState(route.params.defaultname);
    const [phone, setPhone] = useState(route.params.defaultphone);
    const [email, setEmail] = useState(route.params.defaultemail);
    const [address, setAddress] = useState(route.params.defaultaddress);
    const [image, setImage] = useState(route.params.defaultimage);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const {color, userName} = useSelector(state => state.userData);
    const dispatch = useDispatch()

    const validateForm = () => {
        let errors = {};
        if (!name) errors.name = "Name is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          alert('Permission to access camera is required!');
          return;
        };
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0]);
        };
    };

    const submitForm = async (name, phone, email, address) => {
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('id', route.params.id);
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);
        if (image !== null) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `${name}ProfilePicture.${fileType}`;
            formData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            })
        };
        await axiosInstance
        .post(`user/client/update/${userName}/`, formData,
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch(getClients(userName));
                navigation.navigate('Clients');
            }
            setError(response.data.message)
            setIsLoading(false);
        })
        .catch(function(error) {
            console.error('Error updating a client:', error.message);
            setIsLoading(false);
            setError(error.message);
        });
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setIsLoading(true);
            submitForm(name, phone, email, address);
        };
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
                        placeholder={name ? name : "Enter client's name"}
                        value={name}
                        onChangeText={setName}
                    />
                    {errors.name ? (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    ) : null}

                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter client's phone"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    {errors.phone ? (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    ) : null}

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter client's email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errors.email ? (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                    
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter client's address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    {errors.address ? (
                        <Text style={styles.errorText}>{errors.address}</Text>
                    ) : null}

                    {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleImage()}><Text style={[styles.headerText, {color: 'white'}]}>Add image</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => takePhoto()}><Text style={[styles.headerText, {color: 'white'}]}>Take Photo</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleSubmit()}><Text style={[styles.headerText, {color: 'white'}]}>Update</Text></TouchableOpacity>
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