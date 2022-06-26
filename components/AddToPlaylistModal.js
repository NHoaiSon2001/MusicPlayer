import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';
import NewPlaylistButton from './NewPlaylistButton';

const ITEM_HEIGHT = 65;

const Playlist = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style={[styles.itemContainer]}>
            <View style={styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style={styles.coverImage}
                />
            </View>

            <View style={styles.playlistInfo}>
                <Text numberOfLines={2} style={styles.titleText}>{playlist.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style = {styles.totalSongText}>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>
        </View>
    )
}

const AddToPlaylistModal = ({ tracks }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    return (
        <View style = {styles.container}>
            <View style = {styles.headerContainer}>
                <Text style = {styles.headerText}>{i18n.t("Add to playlist")}</Text>
            </View>

            <NewPlaylistButton
                touchableStyle={styles.newPlaylistTouchable}
                tracks={tracks}
                navigateDetail={false}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{maxHeight: ITEM_HEIGHT * 5}}
            >
                {
                    trackContext.playlists.map((playlist, index) => (
                        <TouchableHighlight
                            onPress={() => {
                                appContext.menuModalRef.current?.close();
                                trackContext.addSongToPlaylist(playlist.createTime, tracks);
                            }}
                            underlayColor={darkMode ? '#828282' :'#d0d0d0'}
                            key={index.toString()}
                        >
                            <Playlist
                                playlist={playlist}
                                key={index.toString()}
                            />
                        </TouchableHighlight>
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default AddToPlaylistModal;

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        paddingRight: 10,
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
    playlistInfo: {
        flexGrow: 1,
        flexShrink: 1,
    },
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
    },
    totalSongText: {
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
    newPlaylistTouchable: {
        backgroundColor: '#cdeaff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
        height: 40,
        borderRadius: 30,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        height: 60,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: darkMode ? '#ffffff' : '#151515',
    },
})