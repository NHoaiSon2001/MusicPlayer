import { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackContext from "../utils/context/TrackContext";
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";
import ICONS from "../assets/ICONS";

const ACTION = {
    TOGGLE_PLAYBACK: 1,
    SKIP_PREV: 2,
    SKIP_NEXT: 3,
    SET_REPEAT: 4,
    SHUFFLE: 5,
    SEEK_POSITION: 6,
}

const MusicControll = () => {
    const trackContext = useContext(TrackContext);
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [playPauseIcon, setPlayPauseIcon] = useState(ICONS.REFRESH);
    const [repeatIcon, setRepeatIcon] = useState("");
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [canControl, setCanControl] = useState(true);
    const [newPosition, setNewPosition] = useState(0);
    const [sliding, setSliding] = useState(false);

    useEffect(async () => {
        const repeatMode = await TrackPlayer.getRepeatMode();
        switch(repeatMode) {
            case RepeatMode.Off:
                setRepeatIcon(ICONS.REPEAT_QUEUE);
                setRepeat(false);
                break;
            case RepeatMode.Queue:
                setRepeatIcon(ICONS.REPEAT_QUEUE);
                setRepeat(true);
                break;
            case RepeatMode.Track:
                setRepeatIcon(ICONS.REPEAT_TRACK);
                setRepeat(true);
                break;
        }
        setTimeout(async () => {
            if(await TrackPlayer.getState() === State.Paused) {
                setPlayPauseIcon(ICONS.PLAY);
            } else {
                setPlayPauseIcon(ICONS.PAUSE);
            }
        }, 200);
        await checkCanPrevNext();
    }, []);

    useEffect(async () => {
        if(await TrackPlayer.getCurrentTrack() == 0 && progress.position >= 5) {
            setCanPrev(true);
        }
    }, [progress.position])

    const togglePlayback = async () => {
        await trackContext.togglePlayback();
        if(playbackState === State.Paused && playPauseIcon != ICONS.PAUSE) {
            setPlayPauseIcon(ICONS.PAUSE);
        } else if(playbackState === State.Playing && playPauseIcon != ICONS.PLAY) {
            setPlayPauseIcon(ICONS.PLAY);
        }
	}

    const setRepeatMode = async () => {
        switch(repeatIcon) {
            case ICONS.REPEAT_QUEUE:
                if (!repeat) {
                    setRepeat(true);
                    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
                } else {
                    setRepeatIcon(ICONS.REPEAT_TRACK);
                    await TrackPlayer.setRepeatMode(RepeatMode.Track);
                }
                break;
            case ICONS.REPEAT_TRACK:
                setRepeatIcon(ICONS.REPEAT_QUEUE);
                setRepeat(false);
                await TrackPlayer.setRepeatMode(RepeatMode.Off);
                break;
        }
        await checkCanPrevNext();
    }

    const skipToPrevious = async () => {
        setCanPrev(false);
        if(progress.position >= 5) {
            await TrackPlayer.seekTo(0);
            await checkCanPrevNext();
        } else {
            await TrackPlayer.skipToPrevious();
        }
    }

    const skipToNext = async () => {
        setCanNext(false);
        await TrackPlayer.skipToNext();
    }

    const toggleShuffle = async () => {
        await trackContext.toggleShuffle();
        await checkCanPrevNext();
    }

    const checkCanPrevNext = async () => {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        const repeatMode = await TrackPlayer.getRepeatMode();
        const position = await TrackPlayer.getPosition();
        if (trackIndex == (await TrackPlayer.getQueue()).length - 1 && repeatMode != RepeatMode.Queue) {
            setCanNext(false);
        } else {
            setCanNext(true);
        }
        if (trackIndex == 0 && repeatMode != RepeatMode.Queue && position < 5) {
            setCanPrev(false);
        } else {
            setCanPrev(true);
        }
    }

    const seekPosition = async (position) => {
            await TrackPlayer.seekTo(position);
            await checkCanPrevNext();
            setSliding(false);
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			checkCanPrevNext();
		}
	});

    const controll = async (action, position) => {
        setCanControl(false);
        setTimeout(async () => {
            if(!canControl) return;
            switch(action) {
                case ACTION.TOGGLE_PLAYBACK:
                    console.log("toggle playback");
                    await togglePlayback();
                    break;
                case ACTION.SKIP_PREV:
                    console.log("prev");
                    await skipToPrevious();
                    break;
                case ACTION.SKIP_NEXT:
                    console.log("next");
                    await skipToNext();
                    break;
                case ACTION.SET_REPEAT:
                    console.log("set repeat");
                    await setRepeatMode();
                    break;
                case ACTION.SHUFFLE:
                    console.log("shuffle");
                    await toggleShuffle();
                    break;
                case ACTION.SEEK_POSITION:
                    console.log("seek position");
                    await seekPosition(position);
                    break;
            }
            setTimeout(() => {
                setCanControl(true);
            }, 100);
        }, 100);
    }

    return (
        <View style = {styles.musicControllContainer}>
            <View style = {styles.progressBarContainer}>
                <Slider
                    style={styles.progressBar}
                    value={progress.position}
                    thumbTintColor={'#626262'}
                    maximumValue={progress.duration}
                    maximumTrackTintColor={'#b0b0b0'}
                    minimumTrackTintColor={'#626262'}
                    onSlidingStart={() => setSliding(true)}
                    onValueChange={(position) => setNewPosition(position)}
                    onSlidingComplete={(position) => controll(ACTION.SEEK_POSITION, position)}
                />
                <View style = {styles.progressTitleContainer}>
                    <Text style = {{fontSize: 13}}>
                        {new Date((sliding ? newPosition : progress.position) * 1000).toLocaleTimeString().substring(3)}
                    </Text>
                    <Text style = {{fontSize: 13}}>
                        {new Date(progress.duration * 1000).toLocaleTimeString().substring(3)}
                    </Text>
                </View>
            </View>

            <View style = {styles.controllContainer}>
                <TouchableOpacity
                    onPress={() => controll(ACTION.SHUFFLE)}
                    style = {[styles.controllButton, {marginRight: 20,}]}
                    disabled={!canControl}
                >
                    <Ionicons name={ICONS.SHUFFLE} size={35} color={trackContext.shuffle ? '#626262' : '#b0b0b0'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => controll(ACTION.SKIP_PREV)}
                    style = {[styles.controllButton, {marginRight: 20}]}
                    disabled={!canPrev || !canControl}
                >
                    <Ionicons name={ICONS.SKIP_PREV} size={30} color={canPrev ? '#626262' : '#b0b0b0'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=>controll(ACTION.TOGGLE_PLAYBACK)}
                    style = {styles.playPauseTouchble}
                    disabled={!canControl}
                >
                    <Ionicons
                        name={playPauseIcon}
                        size={35}
                        color={'#626262'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => controll(ACTION.SKIP_NEXT)}
                    style = {[styles.controllButton, {marginLeft: 20}]}
                    disabled={!canNext || !canControl}
                >
                    <Ionicons name={ICONS.SKIP_NEXT} size={30} color={canNext ? '#626262' : '#b0b0b0'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => controll(ACTION.SET_REPEAT)}
                    style = {[styles.controllButton, {marginLeft: 20,}]}
                    disabled={!canControl}
                >
                    <MaterialCommunityIcons name={repeatIcon} size={30} color={repeat ? '#626262' : '#b0b0b0'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MusicControll;

const styles = StyleSheet.create({
    musicControllContainer: {
        flex: 0.25,
        borderColor: "#ffffff",
    },
    progressBarContainer: {
        alignItems: 'center',
    },
    controllContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseTouchble: {
        backgroundColor: "#d6d6d6",
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 75,
        width: 75,
        elevation: 10
    },
    controllButton: {
        borderRadius: 20,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        height: 25,
        width: "90%",
    },
    progressTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
    }
});
