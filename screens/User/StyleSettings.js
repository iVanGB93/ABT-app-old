import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';

import { changeStyle } from '../../store/actions/authActions';


export default StyleSettings = ({navigation}) => {
    const { darkTheme, color } = useSelector(state => state.userData);
    const [colorPicker, setColorPricker] = useState('#FFFFFF');
    const [isPickerVisible, setPickerVisible] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (newColor, newTheme) => {
        dispatch(changeStyle(newColor, newTheme));
        navigation.navigate('Profile');
    };

    const openPicker = () => {
        setPickerVisible(true);
    };
    
    const closePicker = () => {
        setPickerVisible(false);
        dispatch(changeStyle(colorPicker, darkTheme));
        navigation.navigate('Profile');
    };

    const onSelectColor = ({ hex }) => {
        setColorPricker(hex);
    };

    return (
        <View style={[styles.container, {backgroundColor:darkTheme ? 'black': 'white'}]}>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? '#333': '#9999'}]}>
                <Text style={[styles.header, {color:darkTheme ? 'white': 'black'}]}>Change Style</Text>
                <View style={styles.colorsContainer}>
                    <TouchableOpacity style={[styles.dark, {backgroundColor: 'black', borderWidth: 2, borderColor: 'white'}]} onPress={() => handleChange(color, true)}><Text style={{color: 'white', textAlign: 'center'}}>Dark</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.dark, {backgroundColor: 'white', borderWidth: 2, borderColor: 'black'}]} onPress={() => handleChange(color, false)}><Text style={{color: 'black', textAlign: 'center'}}>Light</Text></TouchableOpacity>
                </View>
            </View>
            <View style={[styles.sectionContainer, {backgroundColor:darkTheme ? '#333': '#9999'}]}>
                <Text style={[styles.header, {color:darkTheme ? 'white': 'black'}]}>Change color</Text>
                <View style={styles.colorsContainer}>
                    <TouchableOpacity style={[styles.color, {backgroundColor: '#009d93'}]} onPress={() => handleChange('#009d93', darkTheme)}></TouchableOpacity>
                    <TouchableOpacity style={[styles.color, {backgroundColor: '#694fad'}]} onPress={() => handleChange('#694fad', darkTheme)}></TouchableOpacity>
                    <TouchableOpacity style={[styles.color, {backgroundColor: '#09dd'}]} onPress={() => handleChange('#09dd', darkTheme)}></TouchableOpacity>
                    <TouchableOpacity style={[styles.color, {backgroundColor: '#d02860'}]} onPress={() => handleChange('#d02860', darkTheme)}></TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.dark, {backgroundColor:darkTheme ? 'black': 'white', width: 150, margin: 5, borderWidth: 2, borderColor:darkTheme ? 'white': 'black'}]} onPress={openPicker}><Text style={{color:darkTheme ? 'white': 'black', textAlign: 'center'}}>Pick your own</Text></TouchableOpacity>
            </View>
            <Modal transparent={true} visible={isPickerVisible} animationType="slide">
                <View style={styles.container}>
                    <View style={[styles.modal, { backgroundColor:darkTheme ? '#333': '#9999' }]}>
                        <ColorPicker style={styles.picker} value={color} onComplete={onSelectColor}>
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                        <Swatches />
                        </ColorPicker>
                        <TouchableOpacity style={[styles.dark, {alignSelf: 'center',backgroundColor:darkTheme ? 'black': 'white', width: 150, margin: 5, borderWidth: 2, borderColor:darkTheme ? 'white': 'black'}]} onPress={() => closePicker()}><Text style={{color:darkTheme ? 'white': 'black', textAlign: 'center'}}>OK</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        padding: 10,
        width: 100,
    },
    modal: {
        width: '80%',
        padding: 10,
        borderRadius: 15,
        transparent: 0
    },
});