import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native'
import { Card, TextInput, Title, Headline, Button } from 'react-native-paper';
import { auth, db } from '../firebase';
import styles from '../styles';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function AuthScreen({ route, navigation }) {
    const { username, inputUsername } = route.params;
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    React.useEffect(() => {
        console.log(username)
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              });
            }
        })
    }, [])
    const register = data => {
        setLoading(true)
        auth.createUserWithEmailAndPassword(data.email, data.password)
            .catch((err) => setError(err))
            .then((user) => {
                user.user.updateProfile({
                    displayName: data.username
                });
                db.collection('users').doc(user.user.uid).set({
                    username: data.username,
                    uid: user.user.uid,
                    description: data.description
                })
                setLoading(false);
            })
    }
    const login = data => {
        setLoading(true)
        auth.signInWithEmailAndPassword(data.email, data.password)
        .catch((err)=>setError(err)).then((user)=>{
            db.collection('users').doc(user.user.uid).set({
                username: data.username,
                uid:user.user.uid,
            },{
                mergeFields:true
              })
        })
    }
    if (username) {
        return (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')} style={style.page} contentContainerStyle={
                    [styles.primary, styles.page]}>
                <View>
                    <Title style={{
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        Login now
                    </Title>
                </View>
                <View>
                    <Card>
                        <Card.Content>
                            <Controller
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode='outlined'
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        label='Username'
                                        disabled={true}
                                    />
                                )}
                                name="username"
                                defaultValue={inputUsername}
                            />
                            <Controller
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode={'outlined'}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        label='E-Mail'
                                        autoCapitalize={'none'}
                                    />
                                )}
                                name="email"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        mode={'outlined'}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        label='Password'
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                    />
                                )}
                                name="password"
                                defaultValue=""
                            />
                            <Button onPress={handleSubmit(login)} loading={loading} style={{ marginTop: 20 }} mode='contained'>Login</Button>
                        </Card.Content>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
        )
    }
    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={(Platform.OS === 'ios')} style={style.page} contentContainerStyle={
                [styles.primary, styles.page]}>
            <View>
                <Title style={{
                    color: 'white',
                    textAlign: 'center',
                }}>
                    Register a free account
                </Title>
            </View>
            <View>
                <Card>
                    <Card.Content>
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode='outlined'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label='Username'
                                />
                            )}
                            name="username"
                            defaultValue={inputUsername}
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode={'outlined'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label='E-Mail'
                                    autoCapitalize={'none'}
                                />
                            )}
                            name="email"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode={'outlined'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label='Password'
                                    secureTextEntry={true}
                                />
                            )}
                            name="password"
                            defaultValue=""
                        />
                        <Headline>Tell us about yourself!</Headline>
                        <Controller
                            control={control}
                            rules={{
                                required: false
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode={'outlined'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label='Description'
                                />
                            )}
                            name="description"
                            defaultValue=""
                        />
                        <Text style={{
                            color: 'red'
                        }}>{error}</Text>
                        <Button onPress={handleSubmit(register)} loading={loading} style={{ marginTop: 20 }} mode='contained'>Register</Button>
                    </Card.Content>
                </Card>
            </View>
        </KeyboardAwareScrollView>
    )
}

const style = StyleSheet.create({
    page: {
        flexGrow: 1,
        ...styles.primary
    }
})