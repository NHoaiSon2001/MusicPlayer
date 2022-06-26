import { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import i18n from '../utils/i18n';
import AppContext from '../utils/context/AppContext';

const ITEM_HEIGHT = 65;

const Artist = ({ artist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style={[styles.itemContainer]}>
            <View style={styles.coverWrapper}>
                <Image
                    source={artist.cover === undefined
                        ? require('../assets/defaults/cover_default.jpg')
                        : {uri: artist.cover}
                    }
                    style={styles.coverImage}
                />
            </View>

            <View style={styles.artistInfo}>
                <Text numberOfLines={2} style={styles.nameText}>{artist.name}</Text>
                <Text style = {styles.totalSongText}>{artist.list.length} {i18n.t((artist.list.length < 2) ? "Song" : "Songs")}</Text>
            </View>
        </View>
    )
}

export default Artist;

const getStyles = (darkMode) => StyleSheet.create({
    itemContainer: {
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
    artistInfo: {
        flexGrow: 1,
        flexShrink: 1,
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
    },
    totalSongText: {
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
})