import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

import { setBussinessName, setImageUri } from '../../store/actions/userActions';


export default BussinessSettings = () => {
    const {userName, darkTheme, color, bussinessName, imageUri } = useSelector(state => state.userData);
    const [newName, setNewName] = useState(bussinessName)
    const dispatch = useDispatch();
    
    const handleBN = () => {
        dispatch(setBussinessName(newName));
    };

    const handleImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            dispatch(setImageUri(result.assets[0].uri));
        }
    };

    const handleLoadImage = () => {
        // Aquí cargarías la imagen y actualizarías la ruta en el estado
        const uri = 'ruta_de_la_imagen.jpg';
        setImageUri(uri);
    };

    return (
        <View style={[styles.container, {backgroundColor:darkTheme ? 'black': 'white'}]}>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? '#333': '#9999'}]}>
                <Text style={[styles.header, {color:darkTheme ? 'white': 'black'}]}>Hello, {userName}</Text>
                {imageUri && <Image source={{ uri: imageUri }} style={{ width: 150, height: 150 }} />}
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleImage()}><Text style={[styles.headerText, {color: 'white'}]}>Change Logo</Text></TouchableOpacity>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? '#333': '#9999'}]}>
                <Text style={[styles.header, {color:darkTheme ? 'white': 'black'}]}>Change Bussiness Name</Text>
                <TextInput autoFocus={false} onChangeText={setNewName} value={newName} style={[styles.textInput, {color:darkTheme ? 'white': 'black'}]}/>
                <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => handleBN()}><Text style={[styles.headerText, {color: 'white'}]}>Save</Text></TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create ({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 15,
        width: '90%',
        alignItems: 'center'
    },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 25
    },
    textInput: {
        height: 40,
        width: '80%',
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        padding: 10,
        borderRadius: 16,
        margin: 5,
        width: 100,
        alignItems: 'center',
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
});