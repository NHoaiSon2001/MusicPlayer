import { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from "../assets/ICONS";
import TrackContext from "../utils/context/TrackContext";

const ListControllbutton = ({ data, searchValue }) => {
    const trackContext = useContext(TrackContext);

    return (
        <View style = {styles.container}>
            <TouchableOpacity
                onPress={() => {
                    if(searchValue != null && searchValue.length != 0) {
                        trackContext.saveHistory(searchValue);
                    }
                    trackContext.setupQueue(data, 0, false)
                }}
                activeOpacity={0.8}
                style = {styles.touchable}
            >
                <Ionicons name={ICONS.PLAY} size={30} color={'#626262'}/>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if(searchValue != null && searchValue.length != 0) {
                        trackContext.saveHistory(searchValue);
                    }
                    trackContext.setupQueue(data, 0, true)
                }}
                activeOpacity={0.8}
                style = {styles.touchable}
            >
                <Ionicons name={ICONS.SHUFFLE} size={30} color={'#626262'}/>
            </TouchableOpacity>
        </View>
    )
}

export default ListControllbutton;

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flexDirection: 'row',
        top: 125,
        right: 5,
    },
    touchable: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#d0d0d0',
        marginHorizontal: 5,
    },
})