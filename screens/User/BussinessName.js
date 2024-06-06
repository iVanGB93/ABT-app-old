import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { setBussinessName } from '../../store/actions/userActions';


export default function BussinessName () {
    const {userName, darkTheme, color, bussinessName } = useSelector(state => state.userData);
    const [newName, setNewName] = useState(bussinessName)
    const dispatch = useDispatch();

    return (
        <View style={[styles.container, {backgroundColor:darkTheme ? 'black': 'white'}]}>
            <Text style={[styles.header, {color:darkTheme ? 'white': 'black'}]}>Name of your bussiness</Text>
            <TextInput autoFocus={false} onChangeText={setNewName} value={newName} style={styles.textInput}/>
            <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={() => setBussinessName(newName)}><Text style={[styles.headerText, {color: 'white'}]}>Save</Text></TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create ({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 25
    },
    colorsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    color: {
        width: 50,
        height: 50,
        marginHorizontal: 15,
        borderRadius: 25,
    },
    dark: {
        borderRadius: 25,
        marginHorizontal: 15,
        padding: 10
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