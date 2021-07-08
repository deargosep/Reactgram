import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { Card, Paragraph, IconButton, Avatar, ActivityIndicator } from 'react-native-paper'
import { db, auth } from '../../firebase'

export default function FeedScreen({ navigation }) {
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        db.collection('posts').orderBy('datetime', 'desc').onSnapshot((docs) => {
            const posts = []
            docs.forEach((doc) => {
                posts.push({
                    id: doc.id,
                    ...doc.data(),
                    datetime: {
                        date: doc.data().datetime.toDate().toDateString(),
                        time: doc.data().datetime.toDate().toLocaleTimeString('it-IT')
                    }
                })
            })
            setPosts(posts);
            setLoading(false)
        })
    }, [])
    if (loading) return <ActivityIndicator />
    return (
        <List navigation={navigation} data={posts} />
    )
}

export function List({ data, navigation }) {
    return (
        <FlatList data={data} renderItem={({ item }) => (
            <Item item={item} navigation={navigation} />
        )} />
    )
}

export function Item({ item, navigation }) {
    const delButton = () => <IconButton disabled={item.userId != auth.currentUser.uid} icon="delete" onPress={() => del(item.id)} />
    const del = id => db.collection('posts').doc(id).delete();
    const [avatarUri, setAvatarUri] = React.useState(null)
    React.useEffect(() => {
        db.collection('users').doc(item.userId).get()
            .then((doc) => {
                let data = doc.data()
                console.log(data)
                if (data.photoURL) setAvatarUri(data?.photoURL)
            })
            .catch((e) => console.log(e))
    }, [])
    const avatar = props => avatarUri ? <Avatar.Image size={props.size} source={{ uri: avatarUri }} /> : <Avatar.Text size={props.size} label={item.user.substr(0, 1)} />
    return (
        <Card style={{
            margin: 24
        }} onPress={() => navigation.navigate('Post', { id: item.id })}>
            <Card.Title left={avatar} right={delButton} title={'@' + item.user} />
            <Card.Cover resizeMode='contain' source={{ uri: item.image }} />
            <Card.Title title={item.title} />
            <Card.Content>
                <Text style={{ fontSize: 12 }}>{item.datetime.date}</Text>
                <Text style={{ fontSize: 12 }}>{item.datetime.time}</Text>
                <Paragraph>
                    More..
                </Paragraph>
            </Card.Content>
        </Card>
    )
}
