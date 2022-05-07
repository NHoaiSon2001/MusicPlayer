import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackContext from "../utils/context/TrackContext";
import TrackPlayer, { State, useProgress, usePlaybackState } from "react-native-track-player";

function MusicControll() {
    const [playPauseIcon, setPlayPauseIcon] = useState(playbackState === State.Playing ? "pause-sharp" : "play-sharp");
    const progress = useProgress();
    const playbackState = usePlaybackState();

    return (
        <TrackContext.Consumer>
            {(trackContext) => {
                return (
                    <View style = {styles.musicControllContainer}>
                        <View style = {styles.progressBarContainer}>
                            <Slider
                                style={styles.progressBar}
                                value={progress.position}
                                thumbTintColor={'#626262'}
                                maximumValue={progress.duration}
                                maximumTrackTintColor={"#d6d6d6"}
                                minimumTrackTintColor={'#626262'}
                                onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
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
                                onPress={() => {}}
                                style = {[styles.controllButton, {marginRight: 20,}]}
                            >
                                <MaterialCommunityIcons name="shuffle-disabled" size={30} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => TrackPlayer.skipToPrevious()}
                                style = {[styles.controllButton, {marginRight: 20,}]}
                            >
                                <Ionicons name="play-skip-back-sharp" size={30} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setPlayPauseIcon(playbackState === State.Playing ? "play-sharp" : "pause-sharp");
                                    trackContext.togglePlayback();
                                }}
                                style = {styles.playPauseTouchble}
                            >
                                <Ionicons
                                    name={playbackState === State.Playing ? "pause-sharp" : "play-sharp"}
                                    size={35}
                                    color={'#626262'}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => trackContext.skipToNext()}
                                style = {[styles.controllButton, {marginLeft: 20,}]}
                            >
                                <Ionicons name="play-skip-forward" size={30} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {}}
                                style = {[styles.controllButton, {marginLeft: 20,}]}
                            >
                                <MaterialCommunityIcons name="repeat-once" size={30} color={'#626262'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }}
        </TrackContext.Consumer>
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
