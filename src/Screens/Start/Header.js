import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Paragraph, Title, Headline } from 'react-native-paper'
import Swiper from 'react-native-swiper'
import styles from '../../styles'

export default function Header() {
    return(
        <Swiper loop={false}>
            <View style={[
                style.carousel,
                styles.primary]}>
                <Headline style={{
                    color:'white'
                }}>Welcome, user!</Headline>
                <Paragraph style={{
                    color:'white'
                }}>This app is an analog of Instagram.</Paragraph>
            </View>
            <View style={[
                style.carousel,
                styles.accent
            ]}>
                <Title style={[style.carouselText]}>This app is an analog of Instagram.</Title>
            </View>
            <View style={[
                style.carousel,
                styles.darkPrimary
            ]}>
                <Title style={[style.carouselText]}>Swipe down and input your username.</Title>
            </View>
        </Swiper>
    )
}

const style= StyleSheet.create({
    carousel:{
        flexGrow:1,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    carouselText:{
        color:'white',
        width:'100%',
        textAlign:'center'
    }
})