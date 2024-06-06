import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar, Appearance } from 'react-native';

import ClientStack from './screens/Clients/ClientStack.js';
import JobStack from './screens/Jobs/JobStack.js';
import ItemStack from './screens/Items/ItemStack.js';
import UserStack from './screens/User/UserStack.js';
import { navigationRef } from './navigationRef.js';
import BussinessName from './screens/User/BussinessName.js';

const Tab = createMaterialBottomTabNavigator();

export default function Router({navigation}) {
    const { token, color, bussinessName, textColor } = useSelector(state => state.userData);

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar animated={true} backgroundColor={color} barStyle={textColor === '#ffffff' ? 'light-content' : 'dark-content'} />
            {token ?
            bussinessName ?
            <Tab.Navigator 
                initialRouteName="ClientStack"
                activeColor={textColor}
                inactiveColor={textColor}
                barStyle={{ backgroundColor: color,}}
                tabBarIcon={{color: textColor}}
                /* screenOptions={{
                    tabBarActiveTintColor: '#e91e63',
                    tabBarActiveBackgroundColor: textColor,
                    tabBarInactiveTintColor: textColor,
                }} */
            >
                <Tab.Screen  
                    name="ClientStack" 
                    component={ClientStack}
                    options={{
                        tabBarLabel: 'Clients',
                        tabBarIcon: ({ focused, color }) => (
                          <MaterialCommunityIcons name="account-tie" color={ color } size={focused ? 32 : 26}/>
                        ),
                    }}
                />
                <Tab.Screen 
                    name="JobStack" 
                    component={JobStack}
                    options={{
                        tabBarLabel: 'Jobs',
                        tabBarIcon: ({ focused, color }) => (
                          <MaterialCommunityIcons name="archive-cog" color={ color } size={focused ? 32 : 26} />
                        ),
                    }}
                />
                <Tab.Screen  
                    name="ItemStack" 
                    component={ItemStack}
                    options={{
                        tabBarLabel: 'Items',
                        tabBarIcon: ({ focused, color }) => (
                          <MaterialCommunityIcons name="tools" color={ color } size={focused ? 32 : 26} />
                        ),
                    }}
                />
                <Tab.Screen  
                    name="UserStack"
                    component={UserStack}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ focused, color }) => (
                          <MaterialCommunityIcons name="account-details" color={ color } size={focused ? 32 : 26} />
                        ),
                    }}
                />
            </Tab.Navigator>
            :
                <BussinessName />
            :
                <UserStack />
            }
        </NavigationContainer>
    )
}