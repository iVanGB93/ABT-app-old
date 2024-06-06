import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector, useDispatch } from 'react-redux';
import { authLogin, authLogout } from '../../store/actions/authActions';


export default function Login ({navigation}) {
    const { token, error, loading, color } = useSelector(state => state.userData);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (token != null) {
          navigation.navigate('ClientStack', {screen: 'Clients'})
        }
    });

    const validateForm = () => {
        let errors = {};
        if (!username) errors.username = "Username is required!";
        if (!password) errors.password = "Password is required!";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            dispatch(authLogin(username, password));
        }
    };

  return (
    loading ? 
    <View style={styles.containerActivity}>
      <ActivityIndicator size="large" color={color} />
    </View>
    :
    <View style={[styles.container, {backgroundColor: color}]}>
      <StatusBar backgroundColor={color} barStyle='light-content' />
        
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
        {error ? (
            <Text style={{color: 'white', textAlign: 'center', fontSize: 15, marginTop: 10}}>{error}</Text>
        ) : null}
      </View>     
      <View style={styles.footer}>        
        <Text style={styles.text_footer}>User</Text>
        <View style={styles.action}>
          <Ionicons name="person"/>
          <TextInput 
            onChangeText={setUsername}
            value={username}
            placeholder='type your username...' 
            style={styles.textInput} autoCapitalize='none'/>
          { username ?
          <Ionicons style={{color: {color}}} name="checkmark-circle-outline" />
          : null}
          
        </View>
        {errors.username ? (
                <Text style={{color: 'red'}}>{errors.username}</Text>
            ) : null}
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <Ionicons name="lock-closed"/>
          <TextInput 
            onChangeText={setPassword}
            value={password}
            placeholder='type your password...' 
            secureTextEntry={secureTextEntry ? true : false} 
            style={styles.textInput} autoCapitalize='none'
            />
          <TouchableOpacity onPress={() => setSecureTextEntry(secureTextEntry ? false : true)}>
            {secureTextEntry ? <Ionicons size={15} name="eye-off-outline"/> : <Ionicons size={15} name="eye-outline"/>}
          </TouchableOpacity>
        </View>
        {errors.password ? (
                <Text style={{color: 'red'}}>{errors.password}</Text>
            ) : null}
        <View style={styles.button}>
          <TouchableOpacity style={[styles.signIn, { backgroundColor: color}]} onPress={handleSubmit}>
            <Text style={styles.textSign}>Login</Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={[styles.signIn, { backgroundColor: color}]}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.textSign}>I'm new, create account!!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1, 
  },
  containerActivity: {
    flex: 1, 
    backgroundColor: '#0034',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
  }
})