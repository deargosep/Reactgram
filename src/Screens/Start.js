import React from 'react'
import { View, Text, LogBox } from 'react-native'
import { TextInput, IconButton, ActivityIndicator } from 'react-native-paper'
import { auth, db } from '../firebase'
import Header from './Start/Header'

import { useForm, Controller } from "react-hook-form";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

LogBox.ignoreLogs(['Setting a timer for a long period', "Can't perform a React state update"])
export default function StartScreen({ navigation }) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = React.useState(false)
    React.useEffect(()=>
    auth.onAuthStateChanged((user)=>{
        if(user) navigation.replace('Tabs')
    }))
    const submit = data => {
        setLoading(true)
        db.collection('users').where('username', '==', data.username).get()
            .then((user) => {
                navigation.navigate('Auth', {
                    username: user.docs[0] ? user.docs[0].data().username : undefined,
                    inputUsername: data.username
                })
                setLoading(false)
            })
    }
    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            style={{
                flexDirection: 'column',
                display: 'flex',
            }}>
            <Header />
            <View style={{
                margin: 24,
            }}>
                <Controller
                    control={control}
                    rules={{
                        required: 'true'
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput onBlur={onBlur} label='Your username' mode={'outlined'} onChangeText={onChange} value={value} placeholder='Username' />
                    )}
                    name="username"
                    defaultValue=""
                />
                      {errors.username && <Text style={{color:'red'}}>This field is required.</Text>}
                {loading ?
                    <ActivityIndicator />
                    :
                    <IconButton style={{
                        alignSelf: 'center'
                    }} onPress={handleSubmit(submit)} icon="arrow-right" />
                }
            </View>
        </KeyboardAwareScrollView>
    )
}
