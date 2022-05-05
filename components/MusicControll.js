import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackContext from "../utils/context/TrackContext";

function MusicControll() {
    const [play, setPlay] = useState("pause-sharp");
    return (
        <View style = {styles.musicControllContainer}>
            <View style = {styles.progressBarContainer}>
                <Slider
                    style={styles.progressBar}
                    thumbTintColor={'#626262'}
                    maximumTrackTintColor={"#d6d6d6"}
                    minimumTrackTintColor={'#626262'}
                />
                <View style = {styles.progressTitleContainer}>
                    <Text style = {{fontSize: 13}}>0:00</Text>
                    <Text style = {{fontSize: 13}}>4:35</Text>
                </View>
            </View>
            <TrackContext.Consumer>
				{(trackContext) => {
					return (
                        <View style = {styles.controllContainer}>
                            <TouchableOpacity
                                onPress={() => {}}
                                style = {[styles.controllButton, {marginRight: 20,}]}
                            >
                                <MaterialCommunityIcons name="shuffle-disabled" size={30} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => trackContext.skipBack()}
                                style = {[styles.controllButton, {marginRight: 20,}]}
                            >
                                <Ionicons name="play-skip-back-sharp" size={30} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if(play == "pause-sharp") {
                                        setPlay("play-sharp")
                                    } else {
                                        setPlay("pause-sharp")
                                    }
                                }}
                                style = {styles.playPauseTouchble}
                            >
                                <Ionicons name={play} size={35} color={'#626262'}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => trackContext.skipForward()}
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
            		)
                }}
            </TrackContext.Consumer>
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
