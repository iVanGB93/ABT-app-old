import { Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Jobs from './Jobs.js';
import JobDetail from './JobDetails.js';
import JobCreate from './JobCreate.js';
import JobUpdate from './JobUpdate.js';
import SpentCreate from '../Spents/SpentCreate.js';
import SpentUpdate from '../Spents/SpenUpdate.js';
import Invoice from './Invoice.js';
import InvoiceCreate from './InvoiceCreate.js';
import InvoiceUpdate from './InvoiceUpdate.js';


const Stack = createNativeStackNavigator()

export default function JobStack({navigation}) {
    const {color, textColor} = useSelector(state => state.userData);
    return (
        <Stack.Navigator 
            initialRouteName='Jobs'
            screenOptions={{ 
                headerStyle: { backgroundColor: color },
                headerRight: () => (
                    <Pressable onPress={() => navigation.navigate('New Job')}>
                        <Text style={{ color: textColor, fontSize: 16 }}>Add new Job</Text>
                    </Pressable>
                ),
                headerTintColor: textColor,
        }}
        >
            <Stack.Screen name="Jobs" component={Jobs}/>
            <Stack.Screen name="Job Details" component={JobDetail}/>
            <Stack.Screen name="New Job" component={JobCreate}/>
            <Stack.Screen name="Invoice" component={Invoice}/>
            <Stack.Screen name="Create Invoice" component={InvoiceCreate}/>
            <Stack.Screen name="Update Invoice" component={InvoiceUpdate}/>
            <Stack.Screen
                name="Update Job" 
                component={JobUpdate}
                options={({ route }) => ({
                    id: route.params.id,
                    defaultname: route.params.defaultname, 
                    defaultaddress: route.params.defaultaddress, 
                    defaultphone: route.params.defaultphone, 
                    defaultemail: route.params.defaultemail, 
                    defaultimage: route.params.defaultimage, 
                })}
            />
            <Stack.Screen name="New Spent" component={SpentCreate}/>
            <Stack.Screen name="Edit Spent" component={SpentUpdate} options={({route}) => ({id:route.params.id})}/>
        </Stack.Navigator>
    )
}
