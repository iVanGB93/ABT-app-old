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
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axios.js';
import { getJobs } from '../../store/actions/jobsActions';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { setJob } from '../../store/actions/jobsActions';
import { baseImageURL } from "../../settings.js";


export default function JobUpdate({navigation}) {
    const route = useRoute();
    const jobs = useSelector(state => state.jobs.jobs);
    const job = useSelector(state => state.jobs.job);
    const [description, setDescription] = useState(job.description);
    const [address, setAddress] = useState(job.address);
    const [price, setPrice] = useState(job.price);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const {color, userName} = useSelector(state => state.userData);
    const dispatch = useDispatch();

    useEffect(() => {        
        let job = jobs.find(job => job.id === route.params.id)
        dispatch(setJob(job));
        const imageObj = {'uri': baseImageURL + job.image};
        setImage(imageObj)
    }, []);

    const validateForm = () => {
        let errors = {};
        if (!description) errors.description = "Description is required";
        if (!address) errors.address = "Address is required";
        if (!price) errors.price = "Price is required";
        setErrors(errors);
        console.log("ERROS", errors)
        return Object.keys(errors).length === 0;
    };

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

    const submitForm = async (description, price, address) => {
        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('id', job.id);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('address', address);
        if (image !== null) {
            const uriParts = image.uri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const fileName = `${job.client}JobPicture.${fileType}`;
            formData.append('image', {
                uri: image.uri,
                name: fileName,
                type: `image/${fileType}`,
            })
        };
        await axiosInstance
        .post(`jobs/update/${userName}/`, formData,
        { headers: {
            'content-Type': 'multipart/form-data',
        }})
        .then(function(response) {
            data = response.data;
            if (data.OK) {
                dispatch(getJobs());
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
            submitForm(description, price, address);
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
                <Text style={[styles.label, {marginBottom: 5}]}>Job for {job.client}</Text>

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
                <TextInput
                    style={styles.input}
                    placeholder="Enter job's address"
                    value={address}
                    onChangeText={setAddress}
                />
                {errors.address ? (
                    <Text style={styles.errorText}>{errors.address}</Text>
                ) : null}
                
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder={price ? price.toString() : "Enter job's price"}
                    value={price ? price.toString() : "0"}
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