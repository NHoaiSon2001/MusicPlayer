import { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from '../assets/ICONS';
import AppContext from '../utils/context/AppContext';

const SCREEN_WIDTH = Dimensions.get('screen').width;

export default function AddSongList({ playlistCreateTime, tracks }) {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const trackContext = useContext(TrackContext);
    let playlist = trackContext.playlists.find(playlist => playlist.createTime === playlistCreateTime).list;

    useEffect(() => {
		playlist = trackContext.playlists.find(playlist => playlist.createTime === playlistCreateTime).list;
	}, [trackContext.playlists])

	return (
        tracks.filter(track => !playlist.some(inPlaylist => inPlaylist.id == track.id)).map((track, index) => (
            <TouchableHighlight
                onPress={() => trackContext.addSongToPlaylist(playlistCreateTime, [track])}
                underlayColor={darkMode ? '#828282' :'#d0d0d0'}
                key={index.toString()}
            >
                <View style = {styles.itemWrapper}>
                    <Track track={track} index={index}/>
                    <Ionicons
                        name={ICONS.ADD}
                        size={30}
                        color={darkMode ? '#acacac' : '#626262'}
                        style={{marginHorizontal: 5}}
                    />
                </View>
            </TouchableHighlight>
        ))
	);
}

const styles = StyleSheet.create({
	itemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
        width: SCREEN_WIDTH,
	},
});
