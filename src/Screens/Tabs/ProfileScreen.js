import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { Avatar, Card, Paragraph, IconButton, ActivityIndicator, Snackbar } from 'react-native-paper'
import { auth, db } from '../../firebase'
import { uploadAsFile } from '../../functions/uploadAsFile'

import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation, route }) {
    return (
        <View style={[styles.page, { justifyContent: 'flex-start', margin: 14 }]}>
            <UserCard navigation={navigation} route={route} />
            <LogOut navigation={navigation} />
        </View>
    )
}

function UserCard({ navigation, route }) {
    const [user, setUser] = React.useState({})
    async function userData() {
        const data = await db.collection('users').doc(auth.currentUser.uid).get()
        const obj = data.data()
        setUser(obj)
    }
    React.useEffect(() => {
        userData()
    }, [])


    const avatar = props => {
        const [loading, setLoading] = React.useState(false)
        const [selectedImage, setSelectedImage] = React.useState(null)
        let openImagePicker = async () => {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert('Permission to access camera roll is required!');
                // return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync();

            if (pickerResult.cancelled) {
                return;
            }

            console.log(pickerResult)

            setSelectedImage({ localUri: pickerResult.uri });
            uploadAsFile(pickerResult.uri, (progress) => console.log('progress' + progress), auth.currentUser.uid)
                .then((uri) => {
                    auth.currentUser.updateProfile({
                        photoURL: uri
                    })
                    db.collection('users').doc(auth.currentUser.uid).update({
                        photoURL: uri
                    })
                })
        };

        if (loading) return <ActivityIndicator />

        return (
            <TouchableWithoutFeedback onPress={() => openImagePicker()} >
                {auth.currentUser.photoURL ?
                    <Avatar.Image size={props.size} source={{ uri: auth.currentUser?.photoURL }} />
                    :
                    <Avatar.Text size={props.size} label={auth.currentUser?.displayName.substr(0, 1)} />
                }
            </TouchableWithoutFeedback>
        )
    }

    const edit = props =>
        <IconButton icon="border-color" size={props.size} onPress={() => navigation.navigate('Profile Settings', { description: user.description })} />
    return (
        <Card>
            <Card.Title title={'@' + auth.currentUser.displayName} right={edit} left={avatar} />
            <Card.Content>
                <Paragraph>
                    {user.description ?? 'Empty description.'}
                </Paragraph>
            </Card.Content>
        </Card>
    )
}

function LogOut({ navigation }) {
    const signOut = () => {
        auth.signOut().then(() => navigation.replace('Start'))
    }
    return (
        <IconButton onPress={() => signOut()} icon="logout" />
    )
}

function PickImage() {
    const [selectedImage, setSelectedImage] = React.useState(null)
    const changeAvatar = () => {
        uploadAsFile()
    }
    let openImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            // return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (pickerResult.cancelled) {
            return;
        }

        // const imageBase64 = ImageManipulator.manipulateAsync(pickerResult.uri, [], {base64: true})
        setSelectedImage({ localUri: pickerResult.uri });
    };

    if (loading.is) return <ProgressBar progress={loading.progress} />
    return (
        <Card>
            <Card.Title subtitle='Your image will be shown here' title='Image' />
            <Card.Content>
                {
                    selectedImage !== null ? <Image
                        source={{ uri: selectedImage?.localUri }}
                        style={styles.thumbnail}
                    /> : <Text>Choose photo.</Text>
                }
                <Button icon="image" onPress={openImagePicker}></Button>
                {/* <Button onPress={openCamera}>Or take a photo</Button> */}
            </Card.Content>
        </Card>
    )
}