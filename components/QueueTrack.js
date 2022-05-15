import { useContext } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import TrackPlayer from "react-native-track-player";
import TrackContext from "../utils/context/TrackContext";

function QueueTrack(props) {
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
                <Text style = {{fontSize: 10}}>{props.index + 1}</Text>
                <Text style = {styles.titleText}>{props.track.title}</Text>
                    <View style = {{flexDirection: 'row'}}>
                        <Text>{props.track.artist} • </Text>
                        <Text>
                            {new Date(props.track.duration * 1000).toLocaleTimeString().substring(3)}
                        </Text>
                    </View>
            </View>
        </View>
    )
}

export default QueueTrack;

const styles = StyleSheet.create({
    container: {
        //borderWidth: 1,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
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