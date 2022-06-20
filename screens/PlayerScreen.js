import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import QueueScreen from './QueueScreen';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import i18n from '../utils/i18n';
import MusicControll from '../components/MusicControll';
import MusicInfo from '../components/MusicInfo';
import TrackContext from '../utils/context/TrackContext';
import ICONS from '../assets/ICONS';
import TextTicker from "react-native-text-ticker";

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const PLAYER_SCREEN_HEIGHT = SCREEN_HEIGHT / 1.1;

const Screen = () => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    return (
        <View style = {styles.container}>
            <View style = {styles.header}>
                <TouchableOpacity
                    onPress={() => appContext.playerScreenRef.current?.close('alwaysOpen')}
                    style = {styles.headerButton}
                >
                    <Feather name={ICONS.PLAYER_SCREEN_CLOSE} size={35} color={'#676767'}/>
                </TouchableOpacity>

                <View style = {styles.queueInfo}>
                    <View>
                        <Text>{i18n.t('PLAYING FROM')} {i18n.t(trackContext.queueInfo.type).toUpperCase()}</Text>
                    </View>

                    {
                        trackContext.queueInfo.name.length != 0
                            ? <TextTicker
                                    style={styles.queueName}
                                    duration={15000}
                                    marqueeDelay={500}
                                    animationType={'auto'}
                                    loop={true}
                                    bounce={false}
                                    scroll={false}
                                >
                                    {trackContext.queueInfo.name}
                                </TextTicker>
                            : null
                    }
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
    const appContext = useContext(AppContext);

    return (
        <Modalize
            ref={appContext.playerScreenRef}
            modalHeight={PLAYER_SCREEN_HEIGHT}
            threshold={PLAYER_SCREEN_HEIGHT/4}
            onBackButtonPress={() => appContext.playerBack()}
            withHandle={false}
            alwaysOpen={-200}
            velocity={100}
        >
            <Screen/>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
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
        borderRadius: 30,
    },
    queueInfo: {
        alignItems: 'center',
        flexShrink: 1,
    },
    queueName: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});
