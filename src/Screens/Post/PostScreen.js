import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { View, Text, FlatList, LogBox, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native'
import { Card, Paragraph, Title, Headline, IconButton, Button, TextInput } from 'react-native-paper'
import { KeyboardAwareScrollView, KeyboardAware } from 'react-native-keyboard-aware-scroll-view'
import { auth, db, Timestamp } from '../../firebase'
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside'])
// import {  } from '../Tabs/FeedScreen'

export default function PostScreen({ navigation, route }) {
    const { id } = route.params
    const [item, setItem] = React.useState(null)

    const delButton = () => <IconButton disabled={item?.userId != auth.currentUser?.uid} icon="delete" onPress={() => del()} />
    const del = () => db.collection('posts').doc(id).delete().then(() => navigator.goBack())

    const getItem = () => {
        db.collection('posts').doc(id).get().then((doc) => {
            console.log(doc.data())
            setItem({
                ...doc.data(),
                id: doc.id,
                datetime: {
                    date: doc.data().datetime.toDate().toDateString(),
                    time: doc.data().datetime.toDate().toLocaleTimeString('it-IT')
                },
            })
        })
    }
    React.useEffect(() => {
        getItem()
    }, [])
    return (
        <ScrollView >
            <Card>
                <Card.Title right={delButton} title={'@' + item?.user} />
                <Card.Cover resizeMode='contain' source={{ uri: item?.image }} />
                <Card.Title title={item?.title} />
                <Card.Content>
                    <Paragraph>
                        {item?.description}
                    </Paragraph>
                    <Text style={{ fontSize: 12 }}>{item?.datetime.date}</Text>
                    <Text style={{ fontSize: 12 }}>{item?.datetime.time}</Text>
                    <NewComment id={id} />
                    <Comments id={id} />
                </Card.Content>
            </Card>
        </ScrollView>
        // <Item item={post} navigation={navigation} />
    )
}

function Comments({ id }) {
    const [comments, setComments] = React.useState(null)
    const getData = () => {
        db.collection('posts').doc(id).collection('comments').orderBy('datetime', 'desc').onSnapshot((docs) => {
            const comments = []
            docs.forEach((doc) => {
                comments.push({
                    ...doc.data(),
                    id: doc.id,
                    datetime: {
                        date: doc.data().datetime.toDate().toDateString(),
                        time: doc.data().datetime.toDate().toLocaleTimeString('it-IT')
                    }
                })
            })
            setComments(comments)
        })
    }

    React.useEffect(() => {
        getData();
    }, [])
    return (
        <FlatList style={{ borderTopWidth: 1 }} data={comments} renderItem={({ item }) => (
            <Card>
                <Card.Content>
                    <Text style={{ fontWeight: 'bold', fontFamily: 'Inter Medium' }}>@{item?.user}</Text>
                    <Paragraph>{item?.text}</Paragraph>
                    <Text style={{ fontSize: 12 }}>{item?.datetime.date}</Text>
                    <Text style={{ fontSize: 12 }}>{item?.datetime.time}</Text>
                </Card.Content>
            </Card>
        )} />
    )
}

function NewComment({ id }) {
    const { control, handleSubmit } = useForm();

    const onSubmit = data => {
        db.collection('posts').doc(id).collection('comments')
            .add({ text: data.newComment, userId: auth.currentUser.uid, user: auth.currentUser.displayName ?? auth.currentUser.uid, datetime: Timestamp.fromDate(new Date()) })
            .then(() => {
                console.log('sent')
            })
    }
    return (
        <View>
            <Controller
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        mode={'outlined'} label="Comment" value={value} onBlur={onBlur} onChangeText={onChange} />
                )}
                name="newComment"
            />
            <Button onPress={handleSubmit(onSubmit)}>Send</Button>
        </View>
    )
}