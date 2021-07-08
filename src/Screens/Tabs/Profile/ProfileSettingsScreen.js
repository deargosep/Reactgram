import React from 'react'
import { TextInput, Card, Title, Button } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native'
import { auth, db } from '../../../firebase';
export default function ProfileSettingsScreen({route, navigation}) {
    const { description } = route?.params;
    const { control, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        db.collection('users').doc(auth.currentUser.uid).set({
            description:data.description
        }).then(()=>navigation.goBack())

    }
    return (
        <View style={[styles.page, { justifyContent: 'flex-start', padding: 14 }]}>
            <Title>Update Profile</Title>
            <Card>
                <Card.Title title="Description" />
                <Card.Content>
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
                                label='Type your description'
                            />
                        )}
                        name="description"
                        defaultValue={description??''}
                    />
                    <Text style={{
                        color: 'red'
                    }}>{errors.description}</Text>
                </Card.Content>
            </Card>
            <Button onPress={handleSubmit(onSubmit)}>Save</Button>
        </View>
    )
}