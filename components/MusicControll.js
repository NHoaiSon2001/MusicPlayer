import { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackContext from "../utils/context/TrackContext";
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";

const ICONS = {
    PLAY: "play",
    PAUSE: "pause",
    SKIP_PREV: "play-skip-back",
    SKIP_NEXT: "play-skip-forward",
    REPEAT_TRACK: "repeat-once",
    REPEAT_QUEUE: "repeat",
    SHUFFLE: "shuffle",
}

const MusicControll = () => {
    const trackContext = useContext(TrackContext);
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [playPauseIcon, setPlayPauseIcon] = useState("");
    const [repeatIcon, setRepeatIcon] = useState("");
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [canControl, setCanControl] = useState(false);

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
        checkCanPrevNext();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if(playbackState === State.Playing && playPauseIcon != ICONS.PAUSE) {
                setPlayPauseIcon(ICONS.PAUSE);
            } else if(playbackState === State.Paused && playPauseIcon != ICONS.PLAY) {
                setPlayPauseIcon(ICONS.PLAY);
            }
        }, 1);
	}, [playbackState])

    useEffect(() => {
        if(!canControl) {
            setTimeout(() => {
                setCanControl(true);
            }, 500);
        }
    }, [canControl])

    useEffect(async () => {
        if(await TrackPlayer.getCurrentTrack() == 0 && progress.position >= 5) {
            setCanPrev(true);
        }
    }, [progress.position])

    const setRepeatMode = async () => {
        setCanControl(false);
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
        setCanControl(false);
        console.log("prev");
        if(progress.position >= 5) {
            await TrackPlayer.seekTo(0);
            await checkCanPrevNext();
        } else {
            await TrackPlayer.skipToPrevious();
        }
    }

    const skipToNext = async () => {
        setCanNext(false);
        setCanControl(false);
        console.log("next");
        await TrackPlayer.skipToNext();
    }

    const toggleShuffle = async () => {
        await trackContext.toggleShuffle();
        setCanControl(false);
        await checkCanPrevNext();
    }

    const checkCanPrevNext = async (value) => {
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

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			checkCanPrevNext();
		}
	});

    return (
        <View style = {styles.musicControllContainer}>
            <View style = {styles.progressBarContainer}>
                <Slider
                    style={styles.progressBar}
                    value={progress.position}
                    thumbTintColor={'#626262'}
                    maximumValue={progress.duration}
                    maximumTrackTintColor={'#cacaca'}
                    minimumTrackTintColor={'#626262'}
                    onSlidingComplete={async (value) => {
                        setCanControl(false);
                        await TrackPlayer.seekTo(value);
                        await checkCanPrevNext();
                    }}
                />
                <View style = {styles.progressTitleContainer}>
                    <Text style = {{fontSize: 13}}>
                        {new Date(progress.position * 1000).toLocaleTimeString().substring(3)}
                    </Text>
                    <Text style = {{fontSize: 13}}>
                        {new Date(progress.duration * 1000).toLocaleTimeString().substring(3)}
                    </Text>
                </View>
            </View>

            <View style = {styles.controllContainer}>
                <TouchableOpacity
                    onPress={() => toggleShuffle()}
                    style = {[styles.controllButton, {marginRight: 20,}]}
                    disabled={!canControl}
                >
                    <Ionicons name={ICONS.SHUFFLE} size={35} color={trackContext.shuffle ? '#626262' : '#cacaca'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => skipToPrevious()}
                    style = {[styles.controllButton, {marginRight: 20}]}
                    disabled={!canPrev || !canControl || trackContext.shuffling}
                >
                    <Ionicons name={ICONS.SKIP_PREV} size={30} color={canPrev ? '#626262' : '#cacaca'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setCanControl(false);
                        trackContext.togglePlayback();
                    }}
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
                    onPress={() => skipToNext()}
                    style = {[styles.controllButton, {marginLeft: 20}]}
                    disabled={!canNext || !canControl || trackContext.shuffling}
                >
                    <Ionicons name={ICONS.SKIP_NEXT} size={30} color={canNext ? '#626262' : '#cacaca'}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setRepeatMode()}
                    style = {[styles.controllButton, {marginLeft: 20,}]}
                    disabled={!canControl}
                >
                    <MaterialCommunityIcons name={repeatIcon} size={30} color={repeat ? '#626262' : '#cacaca'}/>
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
