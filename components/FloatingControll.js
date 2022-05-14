import { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from "@react-native-community/slider";
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextTicker from "react-native-text-ticker";
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";
import ICONS from "../assets/ICONS";

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
        checkCanPrevNext();
	}, [])

    useEffect(() => {
        setTimeout(() => {
            if(playbackState === State.Playing && playPauseIcon != ICONS.PAUSE) {
                setPlayPauseIcon(ICONS.PAUSE);
            } else if(playbackState === State.Paused && playPauseIcon != ICONS.PLAY) {
                setPlayPauseIcon(ICONS.PLAY);
            }
        }, 1);
	}, [playbackState])

    const skipToNext = async () => {
        setCanNext(false);
        console.log("next");
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

    return (
        <View style = {styles.container}>
            <Slider
                style={styles.progressBar}
                value={progress.position}
                thumbTintColor={'#dcdcdc'}
                thum
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

                    <TextLoop style = {{fontSize: 15}} content = {trackContext.currentTrack.artist}/>
                </View>

                <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => {}}
                        style = {styles.controllButton}
                    >
                        <Ionicons name="heart" size={25} color={'#626262'}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => trackContext.togglePlayback()}
                        style = {styles.playPauseTouchble}
                    >
                        <Ionicons
                            name={playPauseIcon}
                            size={25}
                            color={'#626262'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => skipToNext()}
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
        marginTop: 0,
        position: 'absolute',
        height: 0,
        width: "100%",
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