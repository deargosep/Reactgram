import React from 'react'
import { View, Text } from 'react-native'

import FeedScreen from './FeedScreen'
import ProfileScreen from './ProfileScreen'
import UploadScreen from './UploadScreen'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator();

export default function TabsScreen(){
    return(
        <Tab.Navigator>
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Upload" component={UploadScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}