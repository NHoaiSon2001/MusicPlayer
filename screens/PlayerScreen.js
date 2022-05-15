import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import QueueScreen from './QueueScreen';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import i18n from '../utils/i18n';
import MusicControll from '../components/MusicControll';
import MusicInfo from '../components/MusicInfo';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const PLAYER_SCREEN_HEIGHT = SCREEN_HEIGHT / 1.1;

const Screen = () => {
    const context = useContext(AppContext);

    return (
        <View style = {styles.container}>
            <View style = {styles.header}>
                <TouchableOpacity
                    onPress={() => context.playerScreenRef.current?.close()}
                    style = {styles.headerButton}
                >
                    <EvilIcons name='chevron-down' size={50} color={'#676767'}/>
                </TouchableOpacity>

                <View style = {{alignItems: 'center'}}>
                    <Text>{i18n.t('PLAYING FROM PLAYLIST')}</Text>
                    <Text style = {{fontWeight: 'bold'}}>Playlist Name</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {}}
                    style = {styles.headerButton}
                >
                    <Ionicons name='ellipsis-vertical-outline' size={25} color={'#676767'}/>
                </TouchableOpacity>
            </View>

            <MusicInfo/>

            <MusicControll/>

            <QueueScreen PLAYER_SCREEN_HEIGHT = {PLAYER_SCREEN_HEIGHT}/>
        </View>
    )
}

export default function PlayerScreen() {
    const context = useContext(AppContext);

    return (
        <Modalize
            ref={context.playerScreenRef}
            modalHeight={PLAYER_SCREEN_HEIGHT}
            threshold={PLAYER_SCREEN_HEIGHT/4}
            velocity={4000}
            snapPoint={60}
        >
            <Screen/>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dcdcdc',
        height: PLAYER_SCREEN_HEIGHT,
        width:"100%",
    },
    header: {
        flex: 0.07,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
});
