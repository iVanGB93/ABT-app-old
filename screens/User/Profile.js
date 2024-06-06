import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform, SafeAreaView, Image, Switch, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';

import { changeLoading } from '../../store/actions/jobsActions';
import { changeStyle } from '../../store/actions/authActions';
import { darkMainColor, darkSecondColor, darkTtextColor, lightMainColor, lightSecondColor, lightTextColor } from '../../settings';


export default Profile = ({navigation}) => {
    const {userName, color, darkTheme, textColor, bussinessName, imageUri } = useSelector(state => state.userData)
    const [colorPicker, setColorPricker] = useState(color);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const dispatch = useDispatch()
    const openPicker = () => {
        setPickerVisible(true);
    };

    const getTextColor = (color) => {
        let rgb;
        rgb = [
            parseInt(color.slice(1, 3), 16),
            parseInt(color.slice(3, 5), 16),
            parseInt(color.slice(5, 7), 16)
        ];
        const [r, g, b] = rgb.map(value => {
            value = value / 255;
            return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    };

    const closePicker = () => {
        setPickerVisible(false);
        let newTextColor = getTextColor(colorPicker);
        dispatch(changeStyle(colorPicker, darkTheme, newTextColor));
    };

    const onSelectColor = ({ hex }) => {
        setColorPricker(hex);
    };
    
    const toggleSwitch = () => {
        dispatch(changeStyle(color, !darkTheme ? true : false, textColor));
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor:darkTheme ? darkMainColor: lightMainColor}]}>
            <View style={styles.rowContainerLast}>
                {imageUri && <Image source={{ uri: imageUri }} style={[styles.image, { borderColor: color }]} />}
                <Pressable style={styles.info} onPress={() => navigation.navigate('Bussiness Settings')}>
                    <Text style={[styles.infoText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>Hello, {userName}</Text>
                    <Text style={[styles.infoText, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{bussinessName}</Text>
                </Pressable>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? darkSecondColor: lightSecondColor}]}>
                <View style={styles.rowContainer}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="person-circle-outline"/> Username</Text>
                    <Text style={[styles.optionTextRight, {color:darkTheme ? darkTtextColor: lightTextColor}]}>{userName}</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="mail-outline"/> Email</Text>
                    <Text style={[styles.optionTextRight, {color:darkTheme ? darkTtextColor: lightTextColor}]}>ivanguachbeltran@gmail.com</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="call-outline"/> Phone</Text>
                    <Text style={[styles.optionTextRight, {color:darkTheme ? darkTtextColor: lightTextColor}]}>+7866129974</Text>
                </View>
                <View style={styles.rowContainerLast}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="location-outline"/> Address</Text>
                    <Text style={[styles.optionTextRight, {color:darkTheme ? darkTtextColor: lightTextColor}]}>896 SW 144th Ave</Text>
                </View>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? darkSecondColor: lightSecondColor}]}>
                <View style={styles.rowContainer}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="color-palette-outline"/> Color</Text>
                    <Pressable style={[styles.color, {backgroundColor: color}]} onPress={openPicker}></Pressable>
                </View>
                <View style={styles.rowContainerLast}>
                    <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="contrast-outline"/> Dark Style</Text>
                    <Switch
                        trackColor={{false: color, true: color}}
                        thumbColor={darkTheme ? '#ffffff' : '#3e3e3e'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={darkTheme}
                    />
                </View>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? darkSecondColor: lightSecondColor}]}>
                <Text style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]}><Ionicons style={[styles.optionText, {color:darkTheme ? darkTtextColor: lightTextColor}]} name="alert-outline"/> Temporary</Text>
                <Pressable style={[styles.button, {backgroundColor: color}]} onPress={() => dispatch(changeLoading(false))}><Text style={{margin: 10, textAlign: 'center', color: textColor}}>Stop loading</Text></Pressable>
            </View>
            <Modal transparent={true} visible={isPickerVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modal, { backgroundColor:darkTheme ? '#333': '#9999' }]}>
                        <ColorPicker style={styles.picker} value={color} onComplete={onSelectColor}>
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                        <Swatches />
                        </ColorPicker>
                        <TouchableOpacity style={[styles.modalButton, {alignSelf: 'center',backgroundColor:darkTheme ? darkSecondColor: lightSecondColor, width: 150, margin: 5, borderWidth: 2, borderColor:darkTheme ? darkSecondColor: lightSecondColor}]} onPress={() => closePicker()}><Text style={{color:darkTheme ? darkTtextColor: lightTextColor, textAlign: 'center'}}>OK</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        /* justifyContent: 'center',
        alignItems: 'center', */
    },
    image: {
        width: 100, 
        height: 100, 
        borderWidth: 2,
        margin: 2,
        borderRadius: 15,
    },
    sectionContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 15,
    },  
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 5,
        borderBottomWidth: 1,
    },
    rowContainerLast: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10,
    },
    infoText: {
        fontSize: 25,
    },
    optionText: {
        fontSize: 22,
    },
    optionTextRight: {
        fontSize: 18,
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
    color: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
    modalContainer: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        padding: 10,
        borderRadius: 15,
        transparent: 0
    },
    modalButton: {
        borderRadius: 25,
        marginHorizontal: 15,
        padding: 10,
        width: 100,
    },
});