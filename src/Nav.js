import React from 'react'

import StartScreen from './Screens/Start';
import AuthScreen from './Screens/Auth';
import TabsScreen from './Screens/Tabs/TabsScreen';
import PostScreen from './Screens/Post/PostScreen';
import ProfileSettingsScreen from './Screens/Tabs/Profile/ProfileSettingsScreen'

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Nav({initialRouteName}) {
    return (
      <Stack.Navigator headerMode={'float'} initialRouteName={initialRouteName}>
        {/* Check for  Firebase Auth (No, expo-app-loading will handle the loading.) */}
        {/* <Stack.Screen name="Loading" component={Loading} /> */}
        {/* Not logged in */}
        <Stack.Screen options={{headerShown:false}} name="Start" component={StartScreen} />
        {/* 
        Maybe some more screens of Auth  (Register, Forgot, Login)
        */}
        <Stack.Screen options={{headerShown:false}} name="Auth" component={AuthScreen} />
  
        {/* Most of the app */}
        <Stack.Screen name="Tabs" component={TabsScreen} />
        {/* Profile Tab */}
        <Stack.Screen name="Profile Settings" component={ProfileSettingsScreen} />
        {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
        {/* Post */}
        <Stack.Screen name="Post" component={PostScreen} />
        {/* Commented because i dont have those screens */}
      </Stack.Navigator>
    )
  }