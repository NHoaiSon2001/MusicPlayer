import { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextTicker from "react-native-text-ticker";
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";
import ICONS from "../assets/ICONS";
import TrackFavourite from './TrackFavorite';
import i18n from "../utils/i18n";
import AppContext from '../utils/context/AppContext';

const TextLoop = (props) => {
    return (
        <TextTicker
            style={props.style}
            duration={15000}
            marqueeDelay={1000}
            animationType={'auto'}
            loop={true}
            bounce={false}
            scroll={false}
        >
            {props.content}
        </TextTicker>
    )
}

function FloatingControll() {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [track, setTrack] = useState({
		title: i18n.t("Title"),
		artist: i18n.t("Artist")
	});
    const [playPauseIcon, setPlayPauseIcon] = useState(ICONS.REFRESH);
    const [canNext, setCanNext] = useState(false);

    useEffect(async () => {
		const queue = JSON.parse(await AsyncStorage.getItem("Queue"));
		const index = JSON.parse(await AsyncStorage.getItem("Index"));
		if(queue != null && index != null && index < queue.length) {
			setTrack(queue[index]);
		}
        checkCanNext();
    }, [])

    useEffect(() => {
        if(playbackState === State.Playing && playPauseIcon != ICONS.PAUSE) {
            setPlayPauseIcon(ICONS.PAUSE);
        } else if(playbackState === State.Paused && playPauseIcon != ICONS.PLAY) {
            setPlayPauseIcon(ICONS.PLAY);
        }
	}, [playbackState])

    const togglePlayback = () => {
        if (playPauseIcon != ICONS.REFRESH) {
			if (playbackState === State.Playing) {
				TrackPlayer.pause();
                setPlayPauseIcon(ICONS.PLAY);
			} else {
				TrackPlayer.play();
                setPlayPauseIcon(ICONS.PAUSE);
			}
		} else {
            TrackPlayer.skip(0);
        }
	}

    const skipToNext = async () => {
        if(await TrackPlayer.getCurrentTrack() == (await TrackPlayer.getQueue()).length - 1 && await TrackPlayer.getRepeatMode() != RepeatMode.Queue) return;
        await TrackPlayer.skipToNext();
    }

    const checkCanNext = async () => {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        const repeatMode = await TrackPlayer.getRepeatMode();
        if (trackIndex == (await TrackPlayer.getQueue()).length - 1 && repeatMode != RepeatMode.Queue) {
            setCanNext(false);
        } else {
            setCanNext(true);
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			setTrack(await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()));
            checkCanNext();
		}
        if (event.type === Event.PlaybackQueueEnded) {
            setPlayPauseIcon(ICONS.REFRESH);
        }
	});

    return (
        <View style = {styles.container}>
            <Slider
                style={styles.progressBar}
                value={progress.position}
                thumbImage={require('../assets/defaults/thumb.png')}
                maximumValue={progress.duration}
                maximumTrackTintColor={darkMode ? '#666666' : '#b0b0b0'}
                minimumTrackTintColor={darkMode ? '#dedede' : '#626262'}
            />
            <View style = {styles.controllContainer}>
                <View style = {styles.coverWrapper}>
                    <Image
                        source={track.cover === undefined
                            ? require('../assets/defaults/cover_default.jpg')
                            : {uri: track.cover}
                        }
                        style = {styles.coverImage}
                    />
                </View>

                <View style = {styles.musicInfo}>
                    <TextLoop style = {styles.titleText} content = {track.title}/>

                    <TextLoop style = {styles.artistText} content = {track.artist}/>
                </View>

                <View style = {styles.buttonContainer}>
                <TrackFavourite
					track={track}
					size={25}
				/>

                    <TouchableOpacity
                    onPress={()=> togglePlayback()}
                    style = {styles.playPauseTouchble}
                >
                    <Ionicons
                        name={playPauseIcon}
                        size={25}
                        color={darkMode ? '#dedede' : '#626262'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => skipToNext()}
                    style = {styles.controllButton}
                    disabled={!canNext}
                >
                    <Ionicons
                        name={ICONS.SKIP_NEXT}
                        size={20}
                        color={!canNext
                            ? (darkMode ? '#666666' : '#b0b0b0')
                            : (darkMode ? '#dedede' : '#626262')
                        }
                    />
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default FloatingControll;

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        backgroundColor: darkMode ? '#585858' :'#dcdcdc',
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    progressBar: {
        position: 'absolute',
        height: 0,
        width: "100%",
        marginTop: 1,
    },
    controllContainer: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    coverWrapper: {
        height: 50,
        width: 50,
        marginHorizontal: 10,
    },
    coverImage: {
		height: '100%',
		width: '100%',
        borderRadius: 5,
	},
    musicInfo: {
        flexGrow: 1,
        flexShrink: 1,
    },
    titleText: {
		fontSize: 15,
		fontWeight:'bold',
        color: darkMode ? '#ffffff' : '#151515',
	},
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    artistText: {
		fontSize: 15,
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
	},
    playPauseTouchble: {
        borderRadius: 20,
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controllButton: {
        height: 35,
        width: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})