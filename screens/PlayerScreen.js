import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import QueueScreen from './QueueScreen';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import i18n from '../utils/i18n';
import MusicControll from '../components/MusicControll';
import MusicInfo from '../components/MusicInfo';
import TrackContext from '../utils/context/TrackContext';
import ICONS from '../assets/ICONS';
import TextTicker from "react-native-text-ticker";
import TrackPlayer from "react-native-track-player";
import AddToPlaylistModal from '../components/AddToPlaylistModal';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const PLAYER_SCREEN_HEIGHT = SCREEN_HEIGHT / 1.1;

const Screen = () => {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    return (
        <View style = {styles.container}>
            <View style = {styles.header}>
                <TouchableOpacity
                    onPress={() => appContext.playerScreenRef.current?.close('alwaysOpen')}
                    style = {styles.headerButton}
                >
                    <Feather
                        name={ICONS.PLAYER_SCREEN_CLOSE}
                        size={35}
                        color={darkMode ? '#e8e8e8' : '#626262'}
                    />
                </TouchableOpacity>

                <View style = {styles.queueInfo}>
                    <View style = {{alignItems: 'center'}}>
                        <TextTicker
                            style={{color: darkMode ? '#e6e6e6' : '#151515'}}
                            duration={15000}
                            marqueeDelay={500}
                            animationType={'auto'}
                            loop={true}
                            bounce={false}
                            scroll={false}
                        >
                            {i18n.t('PLAYING FROM')} {i18n.t(trackContext.queueInfo.type).toUpperCase()}
                        </TextTicker>
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
                    onPress={async () => {
                        const track = await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack());
                        appContext.openMenuModal(<AddToPlaylistModal tracks={[track]}/>);
                    }}
                    style = {styles.headerButton}
                >
                    <Entypo
                        name={ICONS.ADD_SONGS}
                        size={25}
                        color={darkMode ? '#e5e5e5' : '#626262'}
                    />
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
    const trackContext = useContext(TrackContext);
    const [check, setCheck] = useState(0);

    return (
        <Modalize
            ref={appContext.playerScreenRef}
            modalHeight={PLAYER_SCREEN_HEIGHT}
            threshold={PLAYER_SCREEN_HEIGHT/4}
            onBackButtonPress={() => appContext.playerBack()}
            withHandle={false}
            alwaysOpen={-200}
            velocity={100}
            onPositionChange={(position) => {
                if(position = 'initial' && check != trackContext.shuffle && !appContext.firstRender) {
                    setCheck(trackContext.shuffle);
                    trackContext.updateQueue();
                }
            }}
        >
            <Screen/>
        </Modalize>
    )
}

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: darkMode ? '#7b7b7b' : '#f0f0f0',
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
        color: darkMode ? '#eaeaea' : '#151515',
    },
});
