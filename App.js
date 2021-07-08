import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font'
import { Text } from 'react-native';

import {auth} from './src/firebase.js'

import { setCustomText } from 'react-native-global-props';

import styles from './src/styles';
import Nav from './src/Nav'

export default function Wrap() {
  const customTextProps = { 
    style: { 
      fontFamily: 'Inter'
    }
  }
  const [ready, setReady] = React.useState(false);
  const [isUser, setUser] = React.useState(false);
  
  React.useEffect(()=>{
    Font.loadAsync({
      'Inter': require('./assets/fonts/Inter/Inter-Regular.ttf'),
      'Inter Light': require('./assets/fonts/Inter/Inter-Light.ttf'),
      'Inter Medium': require('./assets/fonts/Inter/Inter-Medium.ttf'),
      'Inter Bold': require('./assets/fonts/Inter/Inter-Bold.ttf'),
    }).then(()=>{
      setCustomText(customTextProps);
      auth.onAuthStateChanged((user)=>{
        if(user) {
          setUser(true)
          setReady(true)
        } else {
          setReady(true)
        }
      })
    })
  },[])

  if(!ready) {
    return <AppLoading />
  }

  return (
    <NavigationContainer>
      <Nav initialRouteName={isUser ? 'Tabs':'Start'}/>
    </NavigationContainer>
  )
}

