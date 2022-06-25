import { useContext, useState } from 'react';
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

const BUTTON_HEIGHT = 50;
const ITEM_HEIGHT = 65;

const custom = {
    name: "",
    type: "Custom"
}

const PlayNext = ({ data, shuffle }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    const playNext = async () => {
        if(appContext.havingPlayer) {
            let removeIndex = [];
            (await TrackPlayer.getQueue()).forEach((inQueue, index) => {
                if(data.list.some(track => track.id === inQueue.id)) {
                    removeIndex.push(index);
                }
            });
            await TrackPlayer.remove(removeIndex);
            TrackPlayer.add(shuffle ? data.list.sort(() => Math.random() - 0.5) : data.list, (await TrackPlayer.getCurrentTrack()) + 1);
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
        } else {
            trackContext.setupQueue(data, 0, shuffle, true);
            appContext.menuModalRef.current?.close();
            trackContext.updateQueue();
        }
    }

    return (
        <TouchableHighlight
            onPress={playNext}
            underlayColor={'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <Ionicons
                        name={ICONS.SKIP_NEXT}
                        size={30}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t(shuffle ? "Play next shuffle" : "Play next")}</Text>
				{
                    shuffle
                        ? <Ionicons name={ICONS.SHUFFLE} size={30}/>
                        : null
                }
            </View>
        </TouchableHighlight>
    )
}

const AddToQueue = ({ data, shuffle }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    const addToQueue = async () => {
        if(appContext.havingPlayer) {
            const queue = await TrackPlayer.getQueue();
            const notInQueue = data.list.filter(track => !queue.some(inQueue => inQueue.id === track.id));
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
    }

    return (
        <TouchableHighlight
            onPress={addToQueue}
            underlayColor={'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={ICONS.QUEUE}
                        size={30}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t(shuffle ? "Add to queue shuffle" : "Add to queue")}</Text>
                {
                    shuffle
                        ? <Ionicons name={ICONS.SHUFFLE} size={30}/>
                        : null
                }
            </View>
        </TouchableHighlight>
    )
}

const AddToPlaylist = ({ tracks }) => {
    const appContext = useContext(AppContext);

    return (
        <TouchableHighlight
            onPress={() => appContext.openMenuModal(<AddToPlaylistModal tracks={tracks}/>)}
            underlayColor={'#d0d0d0'}
            style = {styles.touchable}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <Entypo
                        name={ICONS.ADD_SONGS}
                        size={25}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t("Add to playlist")}</Text>
            </View>
        </TouchableHighlight>
    )
}

const EditPlaylist = ({ playlistCreateTime }) => {
    const appContext = useContext(AppContext);

    return (
        <TouchableOpacity
            onPress={() => appContext.openMenuModal(<EditPlaylistModal playlistCreateTime={playlistCreateTime}/>)}
            activeOpacity={1}
            style = {[styles.touchable, {marginBottom: 10}]}
        >
            <View style = {styles.touchableContainer}>
                <View style = {styles.iconContainer}>
                    <MaterialIcons
                        name={ICONS.EDIT_PLAYLIST}
                        size={30}
                    />
                </View>
                <Text style = {styles.touchableText} numberOfLines={2}>{i18n.t("Edit playlist info")}</Text>
            </View>
        </TouchableOpacity>
    )
}

const DeletePlaylist = ({ playlistCreateTime }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    return (
        <TouchableOpacity
            onPress={() => {
                trackContext.deletePlaylist(playlistCreateTime);
                appContext.menuModalRef.current?.close();
            }}
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
                    <Text style={{ flexShrink: 1 }} numberOfLines={1}>{album.artist}</Text>
                    <Text> • {album.list.length} {i18n.t((album.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>
        </View>
    )
}

const Playlist = ({ playlist }) => {
    return (
        <View style={[styles.itemContainer]}>
            <View style={styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style={styles.coverImage}
                />
            </View>

            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.titleText}>{playlist.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")}</Text>
                </View>
            </View>
        </View>
    )
}

export const SongMenu = ({ track }) => (
    <View>
        <View style = {styles.infoContainer}>
            <Track track={track}/>
            <MaterialCommunityIcons
                name={ICONS.SONGS}
                size={25}
                color={"#555555"}
            />
            <TrackIcon trackId={track.id}/>
        </View>
        <PlayNext data={{...custom, list: [track]}}/>
        <AddToQueue data={{...custom, list: [track]}}/>
        <AddToPlaylist tracks={[track]}/>
    </View>
)

export const ArtistMenu = ({ artist }) => (
    <View>
        <View style = {styles.infoContainer}>
            <Artist artist={artist}/>
            <MaterialCommunityIcons
                name={ICONS.ARTISTS}
                size={25}
                color={"#555555"}
            />
        </View>
        <PlayNext data={artist}/>
        <PlayNext data={artist} shuffle={true}/>
        <AddToQueue data={artist}/>
        <AddToQueue data={artist} shuffle={true}/>
        <AddToPlaylist tracks={artist.list}/>
    </View>
)

export const AlbumMenu = ({ album }) => (
    <View>
        <View style = {styles.infoContainer}>
            <Album album={album}/>
            <MaterialCommunityIcons
                name={ICONS.ALBUMS}
                size={25}
                color={"#555555"}
            />
        </View>
        <PlayNext data={album}/>
        <PlayNext data={album} shuffle={true}/>
        <AddToQueue data={album}/>
        <AddToQueue data={album} shuffle={true}/>
        <AddToPlaylist tracks={album.list}/>
    </View>
)

export const PlaylistMenu = ({ playlist }) => (
    <View>
        <View style = {styles.infoContainer}>
            <Playlist playlist={playlist}/>
            <MaterialCommunityIcons
                name={ICONS.PLAYLISTS}
                size={25}
                color={"#555555"}
            />
        </View>
        <DeletePlaylist playlistCreateTime={playlist.createTime}/>
        <EditPlaylist playlistCreateTime={playlist.createTime}/>
        <PlayNext data={playlist}/>
        <PlayNext data={playlist} shuffle={true}/>
        <AddToQueue data={playlist}/>
        <AddToQueue data={playlist} shuffle={true}/>
        <AddToPlaylist tracks={playlist.list}/>
    </View>
)

export const SelectedItemMenu = ({ data }) => (
    <View>
        <PlayNext data={data}/>
        <PlayNext data={data} shuffle={true}/>
        <AddToQueue data={data}/>
        <AddToQueue data={data} shuffle={true}/>
    </View>
)

const MenuModal = () => {
    const appContext = useContext(AppContext);

    return (
        <Modalize
            ref={appContext.menuModalRef}
            withHandle={false}
            modalStyle={{backgroundColor: '#e0e0e0'}}
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
    },
    iconContainer: {
        width: 70,
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
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
        fontSize: 15,
        fontWeight: 'bold',
    },
})