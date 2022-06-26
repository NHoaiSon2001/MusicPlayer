import { Text, Dimensions, StyleSheet, View, Image } from "react-native";
import i18n from "../utils/i18n";
import ListControllbutton from "./ListControllButton";
import AppContext from "../utils/context/AppContext";
import { useContext } from "react";

const ITEM_WIDTH = (Dimensions.get('screen').width - 20) / 2;

const Playlist = ({ playlist, searchValue }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style = {styles.container}>
            <View style={styles.coverWrapper}>
                <Image
                    source={playlist.coverBase64 === null
                        ? require('../assets/defaults/cover_default.jpg')
                        : {uri: playlist.coverBase64}
                    }
                    style={styles.coverImage}
                />
            </View>

            <View style = {styles.playlistInfoContainer}>
                <Text style = {styles.nameText} numberOfLines={2}>{playlist.name}</Text>
                <Text style = {styles.text}>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")}</Text>
            </View>

            <ListControllbutton
                data={playlist}
                searchValue={searchValue}
            />
        </View>
    )
}

export default Playlist;

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
        color: darkMode ? '#e1e1e1' : '#151515',
    },
    text: {
        color: darkMode ? '#c0c0c0' : '#151515',
    }
})