import { Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Clients from './Clients.js';
import ClientDetail from './ClientDetails.js';
import ClientCreate from './ClientCreate.js';
import ClientUpdate from './ClientUpdate.js';


const Stack = createNativeStackNavigator();

export default function ClientStack({navigation}) {
    const {color, textColor} = useSelector(state => state.userData);
    return (
        <Stack.Navigator
        initialRouteName='Clients'
        screenOptions={{ 
            headerStyle: { backgroundColor: color },
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate('New Client')}>
                    <Text style={{ color: textColor, fontSize: 16 }}>Add new Client</Text>
                </Pressable>
            ),
            headerTintColor: textColor,
        }}
        >
            <Stack.Screen 
                name="Clients"
                component={Clients}
            />
            <Stack.Screen
                name="Client Details" 
                component={ClientDetail}
            />
            <Stack.Screen
                name="New Client" 
                component={ClientCreate}
            />
            <Stack.Screen
                name="Edit Client" 
                component={ClientUpdate}
                options={({ route }) => ({
                    id: route.params.id,
                    defaultname: route.params.defaultname, 
                    defaultaddress: route.params.defaultaddress, 
                    defaultphone: route.params.defaultphone, 
                    defaultemail: route.params.defaultemail, 
                    defaultimage: route.params.defaultimage, 
                })}
            />
        </Stack.Navigator>
    )
};
