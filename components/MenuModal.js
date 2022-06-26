import { useContext } from 'react';
import { StyleSheet, Text, Image, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import ICONS from '../assets/ICONS';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../utils/i18n';
import TrackPlayer from 'react-native-track-player';
import Track from './Track';
import TrackIcon from './TrackIcon';
import AddToPlaylistModal from './AddToPlaylistModal';
import Artist from './Artist';
import EditPlaylistModal from './EditPlaylistModal';
import DeleteSuccessModal from './DeleteSuccessModal';

const BUTTON_HEIGHT = 50;
const ITEM_HEIGHT = 65;

const custom = {
    name: "",
    type: "Custom"
}

const PlayNext = ({ data, shuffle }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    const albertMessage = (dataListLength) => {
        if(dataListLength !== 0) {
            appContext.albertMessage(((data.type === "Custom")
                    ? dataListLength + " " + (i18n.t((dataListLength === 1) ? "Song" : "Songs"))
                    : i18n.t(data.type)
                ) + i18n.t(shuffle ? "will play next shuffle" : "will play next")
            );
        } else {
            appContext.albertMessage(i18n.t("Song is playing now"));
        }
    }

    const playNext = async () => {
        if(appContext.havingPlayer) {
            let removeIndex = [];
            const queue = await TrackPlayer.getQueue();
            const currentTrack = queue[await TrackPlayer.getCurrentTrack()];
            const dataList = data.list.filter(track => track.id != currentTrack.id);
            queue.forEach((inQueue, index) => {
                if(dataList.some(track => track.id === inQueue.id)) {
                    removeIndex.push(index);
                }
            });
            await TrackPlayer.remove(removeIndex);
            TrackPlayer.add(shuffle ? dataList.sort(() => Math.random() - 0.5) : dataList, (await TrackPlayer.getCurrentTrack()) + 1);
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
            albertMessage(dataList.length);
        } else {
            trackContext.setupQueue(data, 0, shuffle, true);
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
            albertMessage(data.list.length);
        }
    }

    return (
        <TouchableHighlight
            onPress={playNext}
            underlayColor={darkMode ? '#828282' :'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <Ionicons
                        name={ICONS.SKIP_NEXT}
                        size={30}
                        color={darkMode ? "#eaeaea" : "#555555"}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t(shuffle ? "Play next shuffle" : "Play next")}</Text>
				{
                    shuffle
                        ? <Ionicons
                            name={ICONS.SHUFFLE}
                            size={30}
                            color={darkMode ? "#eaeaea" : "#555555"}
                        />
                        : null
                }
            </View>
        </TouchableHighlight>
    )
}

const AddToQueue = ({ data, shuffle }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    const addToQueue = async () => {
        const queue = await TrackPlayer.getQueue();
        const notInQueue = data.list.filter(track => !queue.some(inQueue => inQueue.id === track.id));
        if(appContext.havingPlayer) {
            if(shuffle) {
                notInQueue.forEach((track, index) => {
                    TrackPlayer.add(track, Math.random() * (queue.length + index));
                });
            } else {
                TrackPlayer.add(notInQueue);
            }
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
        } else {
            console.log(data);
            trackContext.setupQueue(data, 0, shuffle, true);
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
        }
        if(notInQueue.length !== 0) {
            appContext.albertMessage(((data.type === "Custom")
                ? notInQueue.length + " " + (i18n.t((notInQueue.length === 1) ? "Song" : "Songs"))
                : i18n.t(data.type)
            )+ i18n.t(shuffle ? "added to queue shuffle" : "added to queue"));
        } else {
            appContext.albertMessage(((data.type === "Custom")
                ? (i18n.t((data.list.length === 1) ? "Song" : "Songs"))
                : i18n.t(data.type)
            )+ i18n.t("is already in the queue"));
        }
    }

    return (
        <TouchableHighlight
            onPress={addToQueue}
            underlayColor={darkMode ? '#828282' :'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={ICONS.QUEUE}
                        size={30}
                        color={darkMode ? "#eaeaea" : "#555555"}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t(shuffle ? "Add to queue shuffle" : "Add to queue")}</Text>
                {
                    shuffle
                        ? <Ionicons
                            name={ICONS.SHUFFLE}
                            size={30}
                            color={darkMode ? "#eaeaea" : "#555555"}
                        />
                        : null
                }
            </View>
        </TouchableHighlight>
    )
}

const AddToPlaylist = ({ tracks }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <TouchableHighlight
            onPress={() => appContext.openMenuModal(<AddToPlaylistModal tracks={tracks}/>)}
            underlayColor={darkMode ? '#828282' :'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <Entypo
                        name={ICONS.ADD_SONGS}
                        size={25}
                        color={darkMode ? "#eaeaea" : "#555555"}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t("Add to playlist")}</Text>
            </View>
        </TouchableHighlight>
    )
}

const EditPlaylist = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <TouchableOpacity
            onPress={() => appContext.openMenuModal(<EditPlaylistModal playlist={playlist}/>)}
            activeOpacity={1}
            style = {[styles.touchable, {marginBottom: 10}]}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <MaterialIcons
                        name={ICONS.EDIT_PLAYLIST}
                        size={30}
                        color={darkMode ? "#eaeaea" : "#555555"}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t("Edit playlist info")}</Text>
            </View>
        </TouchableOpacity>
    )
}

const DeletePlaylist = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <TouchableOpacity
            onPress={() => appContext.openMenuModal(<DeleteSuccessModal playlist={playlist}/>)}
            activeOpacity={1}
            style = {[styles.touchable, {backgroundColor: '#ff9696', marginTop: 10}]}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <MaterialIcons
                        name={ICONS.DELETE}
                        size={30}
                        color={'#800000'}
                    />
                </View>
                <Text style = {[styles.touchableText, {color: '#800000'}]} numberOfLines={2}>{i18n.t("Delete playlist")}</Text>
            </View>
        </TouchableOpacity>
    )
}

const Album = ({ album }) => {
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

            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.titleText}>{album.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.totalSongText} numberOfLines={1}>{album.artist}</Text>
                    <Text style = {styles.totalSongText}> • {album.list.length} {i18n.t((album.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>
        </View>
    )
}

const Playlist = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style={[styles.itemContainer]}>
            <View style={styles.coverWrapper}>
                <Image
                    source={playlist.coverBase64 === null
                        ? require('../assets/defaults/cover_default.jpg')
                        : {uri: playlist.coverBase64}
                    }
                    style={styles.coverImage}
                />
            </View>

            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.titleText}>{playlist.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style = {styles.totalSongText}>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>
        </View>
    )
}

export const SongMenu = ({ track }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (        <View>
            <View style = {styles.infoContainer}>
                <Track track={track}/>
                <MaterialCommunityIcons
                    name={ICONS.SONGS}
                    size={25}
                    color={darkMode ? "#eaeaea" : "#555555"}
                />
                <TrackIcon trackId={track.id}/>
            </View>
            <PlayNext data={{...custom, list: [track]}}/>
            <AddToQueue data={{...custom, list: [track]}}/>
            <AddToPlaylist tracks={[track]}/>
        </View>
    )
}

export const ArtistMenu = ({ artist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        <View>
            <View style = {styles.infoContainer}>
                <Artist artist={artist}/>
                <MaterialCommunityIcons
                    name={ICONS.ARTISTS}
                    size={25}
                    color={darkMode ? "#eaeaea" : "#555555"}
                />
            </View>
            <PlayNext data={artist}/>
            <AddToQueue data={artist}/>
            {
                artist.list.length > 1
                    ? <View>
                        <PlayNext data={artist} shuffle={true}/>
                        <AddToQueue data={artist} shuffle={true}/>
                    </View>
                    : null
            }
            <AddToPlaylist tracks={artist.list}/>
        </View>
    )
}

export const AlbumMenu = ({ album }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        <View>
            <View style = {styles.infoContainer}>
                <Album album={album}/>
                <MaterialCommunityIcons
                    name={ICONS.ALBUMS}
                    size={25}
                    color={darkMode ? "#eaeaea" : "#555555"}
                />
            </View>
            <PlayNext data={album}/>
            <AddToQueue data={album}/>
            {
                album.list.length > 1
                    ? <View>
                        <PlayNext data={album} shuffle={true}/>
                        <AddToQueue data={album} shuffle={true}/>
                    </View>
                    : null
            }
            <AddToPlaylist tracks={album.list}/>
        </View>
    )
}

export const PlaylistMenu = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        <View>
            <View style = {styles.infoContainer}>
                <Playlist playlist={playlist}/>
                <MaterialCommunityIcons
                    name={ICONS.PLAYLISTS}
                    size={25}
                    color={darkMode ? "#eaeaea" : "#555555"}
                />
            </View>
            <DeletePlaylist playlist={playlist}/>
            <EditPlaylist playlist={playlist}/>
            {
                playlist.list.length !== 0
                    ? <View>
                        <PlayNext data={playlist}/>
                        <AddToQueue data={playlist}/>
                    </View>
                    : null
            }
            {
                playlist.list.length > 1
                    ? <View>
                        <PlayNext data={playlist} shuffle={true}/>
                        <AddToQueue data={playlist} shuffle={true}/>
                    </View>
                    : null
            }
            <AddToPlaylist tracks={playlist.list}/>
        </View>
    )
}

export const SelectedItemMenu = ({ data }) => (
    <View>
        <PlayNext data={data}/>
        <AddToQueue data={data}/>
        {
            data.list.length > 1
                ? <View>
                    <PlayNext data={data} shuffle={true}/>
                    <AddToQueue data={data} shuffle={true}/>
                </View>
                : null
        }
    </View>
)

const MenuModal = () => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        <Modalize
            ref={appContext.menuModalRef}
            withHandle={false}
            modalStyle={{backgroundColor: darkMode ? '#494949' : '#f0f0f0'}}
            tapGestureEnabled={false}
            adjustToContentHeight={true}
        >
            <View style = {{marginVertical: 30}}>
                {appContext.menuModalContent}
            </View>
        </Modalize>
    )
}

export default MenuModal;

const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
    },
})

const getStyles = (darkMode) => StyleSheet.create({
    touchable: {
        width: '100%',
    },
    touchableContainer: {
        height: BUTTON_HEIGHT,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
    },
    touchableText: {
        flexShrink: 1,
        flexGrow: 1,
        fontSize: 17,
        fontWeight: 'bold',
        paddingRight: 20,
        color: darkMode ? '#ffffff' : '#151515',
    },
    iconContainer: {
        width: 70,
        alignItems: 'center',
    },
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
    info: {
        flexGrow: 1,
        flexShrink: 1,
    },
    titleText: {
        flexShrink: 1,
        fontWeight:'bold',
        color: darkMode ? '#ffffff' : '#151515',
    },
    totalSongText: {
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
})