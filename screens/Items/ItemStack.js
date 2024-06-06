import { StyleSheet, Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Items from './Items.js';
import ItemDetails from './ItemDetails.js';
import ItemCreate from './ItemCreate.js';
import ItemUpdate from './ItemUpdate.js';

const Stack = createNativeStackNavigator()


export default function ItemStack({navigation}) {
    const {color, textColor} = useSelector(state => state.userData);
    return (
        <Stack.Navigator 
        initialRouteName='Items'
        screenOptions={{ 
            headerStyle: { backgroundColor: color },
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate('New Item')}>
                    <Text style={{ color: textColor, fontSize: 16 }}>Add new Item</Text>
                </Pressable>
            ),
            headerTintColor: textColor,
        }}
        >
            <Stack.Screen name="Items" component={Items}/>
            <Stack.Screen name="Item Details" component={ItemDetails}/>
            <Stack.Screen name="New Item" component={ItemCreate}/>
            <Stack.Screen name="Edit Item" component={ItemUpdate} options={({route}) => ({id: route.params.id})}/>
        </Stack.Navigator>
    )
}
