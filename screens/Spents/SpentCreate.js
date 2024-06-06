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
  Image,
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { baseImageURL } from "../../settings";
import { createSpent } from "../../store/actions/spentActions.js";


export default function SpentCreate({navigation}) {
    const items = useSelector(state => state.items.items);
    const isLoading = useSelector(state => state.spents.loading);
    const error = useSelector(state => state.spents.error);
    const job = useSelector(state => state.jobs.job);
    const [item, setItem] = useState({});
    const [isEnabled, setIsEnabled] = useState(false);
    const [itemsName, setItemsName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const color = useSelector(state => state.userData.color);
    const dispatch = useDispatch();


    useEffect(() => {
        const itemsName = items.map((item) => item.name);
        setItemsName(itemsName);
    }, []);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (!isEnabled) {
            setDescription(item.name);
            setPrice(item.price);
        } else {
            setDescription("");
            setPrice("");
        }
    };

    const handleSelect = (name) => {
        const itemList= items.filter((item) => item.name === name);
        setItem(itemList[0]);
        setPrice(itemList[0].price);
        setDescription(itemList[0].name);
        setImage({'uri': baseImageURL + itemList[0].image});
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
        }
    
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!description) errors.description = "Description is required";
        if (!price) errors.price = "Price is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = (description, price) => {
        dispatch(createSpent(job.id, description, price, image, isEnabled));
        navigation.navigate('Job Details', {id: job.id});
    };

    const handleSubmit = () => {
        if (validateForm()) {
            submitForm(description, price);
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
                <Text style={[styles.label, { marginBottom: 10}]}>Job: { job.description }</Text>
                
                <View style={[styles.label, {flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', verticalAlign: 'middle'}]}>
                    <Switch
                        trackColor={{false: '#767577', true: color}}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={[styles.label, {flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', verticalAlign: 'middle'}]}>use an item</Text>
                </View>

                { isEnabled ?
                <>
                <Text style={styles.label}>Item:</Text>
                <SelectDropdown
                    data={itemsName}
                    onSelect={(selectedItem, index) => {
                        handleSelect(selectedItem);
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
                {errors.job ? (
                    <Text style={styles.errorText}>{errors.job}</Text>
                ) : null}</>
                : 
                <>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder={description ? description : "Enter job's description"}
                    value={description}
                    onChangeText={setDescription}
                />
                {errors.description ? (
                    <Text style={styles.errorText}>{errors.description}</Text>
                ) : null}</>
                }
                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder={price ? price.toString() : "Enter spent's amount"}
                    value={price ? price.toString() : null}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                {errors.price ? (
                    <Text style={styles.errorText}>{errors.price}</Text>
                ) : null}
                { image ? 
                <Image source={{ uri: image.uri }} style={styles.image} onError={() => setImage(null)} />
                :
                <Text style={[styles.LabelText, { alignSelf: 'center'}]}>image not found </Text>
                }
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