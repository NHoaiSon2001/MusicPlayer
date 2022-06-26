// import { useContext } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
// import i18n from '../utils/i18n';
// import Feather from 'react-native-vector-icons/Feather';
// import ICONS from '../assets/ICONS';

// const ITEM_HEIGHT = 65;

// const Album = (props) => {
//     return (
//         <View style={[styles.itemContainer]}>
//             <View style={styles.coverWrapper}>
//                 <Image
//                     source={require('../assets/defaults/cover_default.jpg')}
//                     style={styles.coverImage}
//                 />
//             </View>

//             <View style={styles.albumInfo}>
//                 <Text numberOfLines={2} style={styles.titleText}>{props.album.name}</Text>
//                 <View style={{ flexDirection: 'row' }}>
//                     <Text style={{ flexShrink: 1 }} numberOfLines={1}>{props.album.artist}</Text>
//                     <Text> • {props.album.list.length} {i18n.t((props.album.list.length < 2) ? "Song" : "Songs")}</Text>
//                 </View>
//             </View>

//             <Feather name={ICONS.NEXT} size={25} style={{ marginHorizontal: 5 }} />
//         </View>
//     )
// }

// export default Album;

// const styles = StyleSheet.create({
//     itemContainer: {
//         height: ITEM_HEIGHT,
//         flexDirection: 'row',
//         alignItems: 'center',
//         flexGrow: 1,
//         flexShrink: 1,
//     },
//     coverWrapper: {
//         height: 50,
//         width: 50,
//         marginHorizontal: 10,
//     },
//     coverImage: {
//         height: '100%',
//         width: '100%',
//         borderRadius: 5,
//     },
//     albumInfo: {
//         flexGrow: 1,
//         flexShrink: 1,
//     },
//     titleText: {
//         fontSize: 15,
//         fontWeight: 'bold',
//     },
// });

import { Text, Dimensions, StyleSheet, View, Image } from "react-native";
import i18n from "../utils/i18n";
import ListControllbutton from "./ListControllButton";
import AppContext from "../utils/context/AppContext";
import { useContext } from "react";

const ITEM_WIDTH = (Dimensions.get('screen').width - 20) / 2;

const Album = ({ album, searchValue }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style = {styles.container}>
            <View style={styles.coverWrapper}>
                <Image
                    source={album.cover === undefined
                        ? require('../assets/defaults/cover_default.jpg')
                        : {uri: album.cover}
                    }
                    style={styles.coverImage}
                />
            </View>

            <View style = {styles.playlistInfoContainer}>
                <Text style = {styles.nameText} numberOfLines={2}>{album.name}</Text>
                {/* <Text style = {styles.totalSongText}>{album.list.length} {i18n.t((album.list.length < 2) ? "Song" : "Songs")}</Text> */}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.text, { flexShrink: 1 }]} numberOfLines={1}>{album.artist}</Text>
                    <Text style = {styles.text}> • {album.list.length} {i18n.t((album.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>

            <ListControllbutton
                data={album}
                searchValue={searchValue}
            />
        </View>
    )
}

export default Album;

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        alignItems: 'center',
        height: ITEM_WIDTH + 70,
        width: ITEM_WIDTH,
    },
    coverWrapper: {
        height: 175,
        width: 175,
        marginHorizontal: 10,
    },
    coverImage: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
    },
    playlistInfoContainer: {
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
    },
    text: {
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
})
