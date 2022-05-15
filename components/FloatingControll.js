import { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextTicker from "react-native-text-ticker";
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";
import ICONS from "../assets/ICONS";

const ACTION = {
    TOGGLE_PLAYBACK: 1,
    SKIP_NEXT: 3,
}

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
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const trackContext = useContext(TrackContext);
    const [playPauseIcon, setPlayPauseIcon] = useState("");
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
        setTimeout(async () => {
            if(await TrackPlayer.getState() === State.Paused) {
                setPlayPauseIcon(ICONS.PLAY);
            } else {
                setPlayPauseIcon(ICONS.PAUSE);
            }
        }, 300);
        checkCanPrevNext();
	}, [])

    const togglePlayback = async () => {
        await trackContext.togglePlayback();
        if(playbackState === State.Paused && playPauseIcon != ICONS.PAUSE) {
            setPlayPauseIcon(ICONS.PAUSE);
        } else if(playbackState === State.Playing && playPauseIcon != ICONS.PLAY) {
            setPlayPauseIcon(ICONS.PLAY);
        }
	}

    const skipToNext = async () => {
        await TrackPlayer.skipToNext();
    }

    const checkCanPrevNext = async () => {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        const repeatMode = await TrackPlayer.getRepeatMode();
        if (trackIndex == (await TrackPlayer.getQueue()).length - 1 && repeatMode != RepeatMode.Queue) {
            setCanNext(false);
        } else {
            setCanNext(true);
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			checkCanPrevNext();
		}
	});

    const controll = async (action) => {
        console.log(newPosition);
        setCanControl(false);
        setTimeout(async () => {
            if(!canControl) return;
            switch(action) {
                case ACTION.TOGGLE_PLAYBACK:
                    console.log("toggle playback");
                    await togglePlayback();
                    break;
                case ACTION.SKIP_NEXT:
                    console.log("next");
                    await skipToNext();
                    break;
            }
            setTimeout(() => {
                setCanControl(true);
            }, 100);
        }, 100);
    }

    return (
        <View style = {styles.container}>
            <Slider
                style={styles.progressBar}
                value={progress.position}
                thumbImage={require('../assets/defaults/thumb.png')}
                maximumValue={progress.duration}
                maximumTrackTintColor={'#dcdcdc'}
                minimumTrackTintColor={'#626262'}
            />
            <View style = {styles.controllContainer}>
                <View style = {styles.coverWrapper}>
                    <Image
                        source={require('../assets/defaults/cover_default.jpg')}
                        style = {styles.coverImage}
                    />
                </View>

                <View style = {styles.musicInfo}>
                    <TextLoop style = {styles.titleText} content = {trackContext.currentTrack.title}/>

                    <TextLoop content = {trackContext.currentTrack.artist}/>
                </View>

                <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => {}}
                        style = {styles.controllButton}
                    >
                        <Ionicons name="heart" size={25} color={'#626262'}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => controll(ACTION.TOGGLE_PLAYBACK)}
                        style = {styles.playPauseTouchble}
                    >
                        <Ionicons
                            name={playPauseIcon}
                            size={25}
                            color={'#626262'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => controll(ACTION.SKIP_NEXT)}
                        style = {styles.controllButton}
                        disabled={!canNext}
                    >
                        <Ionicons name={ICONS.SKIP_NEXT} size={20} color={canNext ? '#626262' : '#b0b0b0'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default FloatingControll;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#dcdcdc',
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
	},
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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