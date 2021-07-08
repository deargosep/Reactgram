import React from 'react'
import { Text, View, ScrollView, Image, StyleSheet } from 'react-native'
import { Button, Card, TextInput, ProgressBar, Snackbar } from 'react-native-paper'
import { db, auth, storage, Timestamp } from '../../firebase'
import { Controller, useForm, setValue } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker';
import { uploadAsFile } from '../../functions/uploadAsFile'
import { select } from 'async'


export default function CreatePost({ navigation }) {

    function LoadingProgress(props) {
        return <ProgressBar progress={props.loading.progress} />
    }

    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState({ is: false, progress: 0 })
    const [success, setSuccess] = React.useState(false)
    React.useEffect(() => setLoading(false), [])
    const onSubmit = (data) => {
        if (selectedImage) {
            let name = new Date().getTime() + "-media.jpg"
            // const uri = storage.ref('assets/').child(name).getDownloadURL()
            console.log(selectedImage.localUri)
            uploadAsFile(selectedImage.localUri, (progress) => setLoading({ is: true, progress: progress }), name).then((res) => {
                db.collection('posts').add({
                    title: data.title,
                    description: data.description,
                    image: res,
                    user: auth.currentUser.displayName ?? auth.currentUser.uid,
                    userId: auth.currentUser.uid,
                    datetime: Timestamp.fromDate(new Date())
                }).then(() => { setLoading({ is: false }); setSelectedImage(null); setSuccess(true); navigation.jumpTo('Feed'); }).catch((err) => { console.log(err); setLoading(false); navigation.jumpTo('Feed'); })
            }
            )
        }
    }
    function PostForm() {
        return (
            <Card>
                <Card.Title title='Meta' />
                <Card.Content>
                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode={'outlined'} label="Title" value={value} onBlur={onBlur} onChangeText={onChange} />
                            )}
                            name="title"
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode={'outlined'} label="Description" value={value} onBlur={onBlur} onChangeText={onChange} />
                            )}
                            name="description"
                        />
                    </View>
                </Card.Content>
            </Card>
        )
    }

    const [selectedImage, setSelectedImage] = React.useState(null)
    function PickImage() {
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

    return (
        <ScrollView style={{ flex: 1}}>
            <Card>
                <Card.Content>
                    <PostForm />
                    <PickImage />
                </Card.Content>
            </Card>
            <Button onPress={handleSubmit(onSubmit)}>Create</Button>
            <Snackbar  onDismiss={() => setSuccess(false)} visible={success} action={{
                label: 'OK', onPress: () => setSuccess(false)
            }}>Posted!</Snackbar>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 300,
        height: 250,
        resizeMode: "contain"
    }
});