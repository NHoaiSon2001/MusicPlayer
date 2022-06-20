import { Text, Dimensions, StyleSheet, View, Image } from "react-native";
import i18n from "../utils/i18n";
import ListControllbutton from "./ListControllButton";

const ITEM_WIDTH = (Dimensions.get('screen').width - 20) / 2;

const Playlist = ({ playlist, searchValue }) => {
    return (
        <View style = {styles.container}>
            <View style={styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style={styles.coverImage}
                    />
            </View>

            <View style = {styles.playlistInfoContainer}>
                <Text style = {styles.nameText} numberOfLines={2}>{playlist.name}</Text>
                <Text>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")}</Text>
            </View>

            <ListControllbutton
                data={playlist}
                searchValue={searchValue}
            />
        </View>
    )
}

export default Playlist;

const styles = StyleSheet.create({
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
    },
})