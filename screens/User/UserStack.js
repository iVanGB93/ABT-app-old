import { StyleSheet, Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from "react-redux";

import { authLogout } from '../../store/actions/authActions';
import Profile from './Profile';
import BussinessSettings from './BussinessSettings';
import StyleSettings from './StyleSettings';
import Login from './Login';
import Register from './Register';


const Stack = createNativeStackNavigator();

export default function UserStack({navigation}) {
    const {color, token, darkTheme, textColor} = useSelector(state => state.userData);
    const dispatch = useDispatch()
    return (
        <Stack.Navigator
        initialRouteName={token ? 'Profile' : 'Login'}
        screenOptions={{ 
            headerStyle: { backgroundColor: color },
            headerRight: () => (
                <Pressable onPress={() => dispatch(authLogout())}>
                    <Text style={{ color: textColor, fontSize: 16 }}>LogOut</Text>
                </Pressable>
            ),
            headerTintColor: textColor,
        }}
        >
            <Stack.Screen 
                name="Profile"
                component={Profile}
            />
            <Stack.Screen
                name="Bussiness Settings" 
                component={BussinessSettings}
            />
            <Stack.Screen
                name="Style Settings" 
                component={StyleSettings}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
};
