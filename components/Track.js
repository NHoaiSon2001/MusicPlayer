import React, { useContext } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TrackPlayer from "react-native-track-player";
import TrackContext from "../utils/context/TrackContext";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ITEM_HEIGHT = 65;

const Track = React.memo((props) => {
    const trackContext = useContext(TrackContext);

    return (
        <View style = {[styles.container]}>
            <View style = {styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style = {styles.coverImage}
                />
            </View>

            <View style = {styles.musicInfo}>
                <Text numberOfLines={2} style = {styles.titleText}>{props.track.title}</Text>
                    <View style = {{flexDirection: 'row'}}>
                        <Text>{props.track.artist} • </Text>
                        <Text>
                            {new Date(props.track.duration * 1000).toLocaleTimeString().substring(3)}
                        </Text>
                    </View>
            </View>

        </View>
    )
})

export default Track;

const styles = StyleSheet.create({
    container: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
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
})