import { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackContext from "../utils/context/TrackContext";
import TrackPlayer, { State, useProgress, usePlaybackState, RepeatMode, Event, useTrackPlayerEvents } from "react-native-track-player";
import ICONS from "../assets/ICONS";
import AppContext from "../utils/context/AppContext";

const MusicControll = () => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [playPauseIcon, setPlayPauseIcon] = useState(ICONS.REFRESH);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [repeat, setRepeat] = useState(0);
    const [newPosition, setNewPosition] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [shuffle, setShuffle] = useState(false);

    useEffect(() => {
        checkCanPrevNext();
    }, [])

    useEffect(() => {
        if(playbackState === State.Playing && playPauseIcon != ICONS.PAUSE) {
            setPlayPauseIcon(ICONS.PAUSE);
        } else if(playbackState === State.Paused && playPauseIcon != ICONS.PLAY) {
            setPlayPauseIcon(ICONS.PLAY);
        }
	}, [playbackState])

    useEffect(async () => {
        if(appContext.firstRender) {
            const storage = await AsyncStorage.getItem("Repeat");
            if(storage != null) {
                switch(storage) {
                    case "0":
                        setRepeat(0);
                        TrackPlayer.setRepeatMode(RepeatMode.Off);
                        break;
                    case "1":
                        setRepeat(1);
                        TrackPlayer.setRepeatMode(RepeatMode.Queue);
                        break;
                    case "2":
                        setRepeat(2);
                        TrackPlayer.setRepeatMode(RepeatMode.Track);
                }
            }
        } else {
            AsyncStorage.setItem("Repeat", JSON.stringify(repeat));
        }
	}, [repeat])

    useEffect(async () => {
        if(appContext.firstRender) {
            const storage = await AsyncStorage.getItem("Shuffle");
            if(storage != null) setShuffle(JSON.parse(storage));
        } else {
            AsyncStorage.setItem("Shuffle", JSON.stringify(shuffle));
        }
	}, [shuffle])

    useEffect(() => {
        setShuffle(trackContext.shuffle > 0);
	}, [trackContext.shuffle])

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

    const skipToPrevious = async () => {
        if(progress.position > 5) {
            await TrackPlayer.seekTo(0);
            return;
        }
        if(await TrackPlayer.getCurrentTrack() == 0 && await TrackPlayer.getRepeatMode() != RepeatMode.Queue) return;
        TrackPlayer.skipToPrevious();
    }

    const skipToNext = async () => {
        if(await TrackPlayer.getCurrentTrack() == (await TrackPlayer.getQueue()).length - 1 && await TrackPlayer.getRepeatMode() != RepeatMode.Queue) return;
        TrackPlayer.skipToNext();
    }

    const toggleRepeatMode = () => {
        switch(repeat) {
            case 0:
                setRepeat(1);
                TrackPlayer.setRepeatMode(RepeatMode.Queue);
                break;
            case 1:
                setRepeat(2);
                TrackPlayer.setRepeatMode(RepeatMode.Track);
                break;
			case 2:
				setRepeat(0);
				TrackPlayer.setRepeatMode(RepeatMode.Off);
        }
        checkCanPrevNext();
    }

    const toggleShuffle = async () => {
        const queue = await TrackPlayer.getQueue();
        const index = await TrackPlayer.getCurrentTrack();
        const currentTrack = await TrackPlayer.getTrack(index);
		await TrackPlayer.remove(queue.map((track, index) => index));
		if (shuffle) {
            setShuffle(!shuffle);
			const newQueue = queue.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);
			const newTrackIndex = newQueue.findIndex(track => track.url == currentTrack.url);
			TrackPlayer.add(newQueue.filter((track, index) => index < newTrackIndex), 0);
			TrackPlayer.add(newQueue.filter((track, index) => index > newTrackIndex));
            checkCanPrevNext();
		} else {
            setShuffle(!shuffle);
			const newQueue = queue
				.filter(track => track.url != currentTrack.url)
				.sort(() => Math.random() - 0.5);
			TrackPlayer.add(newQueue);
            checkCanPrevNext();
		}
        AsyncStorage.setItem("Queue", JSON.stringify(await TrackPlayer.getQueue()));
        AsyncStorage.setItem("Index", JSON.stringify(await TrackPlayer.getCurrentTrack()));
	}

    const checkCanPrevNext = async () => {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        const repeatMode = await TrackPlayer.getRepeatMode();
        if (trackIndex == (await TrackPlayer.getQueue()).length - 1 && repeatMode != RepeatMode.Queue) {
            setCanNext(false);
        } else {
            setCanNext(true);
        }
        if (trackIndex == 0 && repeatMode != RepeatMode.Queue) {
            setCanPrev(false);
        } else {
            setCanPrev(true);
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			checkCanPrevNext();
		}
        if (event.type === Event.PlaybackQueueEnded) {
            setPlayPauseIcon(ICONS.REFRESH);
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
                    maximumTrackTintColor={'#b0b0b0'}
                    minimumTrackTintColor={'#626262'}
                    onSlidingStart={() => setSliding(true)}
                    onValueChange={(position) => setNewPosition(position)}
                    onSlidingComplete={(position) => {
                        setSliding(false);
                        TrackPlayer.seekTo(position);
                    }}
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
                    onPress={() => toggleShuffle()}
                    style = {[styles.controllButton, {marginRight: 20,}]}
                >
                    <Ionicons
                        name={ICONS.SHUFFLE}
                        size={35}
                        color={shuffle ? '#626262' : '#b0b0b0'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => skipToPrevious()}
                    style = {[styles.controllButton, {marginRight: 20}]}
                    disabled={!canPrev && progress.position <= 5}
                >
                    <Ionicons
                        name={ICONS.SKIP_PREV}
                        size={30}
                        color={(!canPrev && progress.position <= 5) ? '#b0b0b0' : '#626262'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> togglePlayback()}
                    style = {styles.playPauseTouchble}
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
                    disabled={!canNext}
                >
                    <Ionicons
                        name={ICONS.SKIP_NEXT}
                        size={30}
                        color={!canNext ? '#b0b0b0' : '#626262'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => toggleRepeatMode()}
                    style = {[styles.controllButton, {marginLeft: 20,}]}
                >
                    <MaterialCommunityIcons
                        name={repeat != 2 ? ICONS.REPEAT_QUEUE : ICONS.REPEAT_TRACK}
                        size={30}
                        color={repeat != 0 ? '#626262' : '#b0b0b0'}
                    />
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
