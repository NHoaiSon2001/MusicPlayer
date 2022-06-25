import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native';
import AppContext from '../utils/context/AppContext';
import { PlaylistMenu } from './MenuModal';
import Playlist from './Playlist';

const PlaylistList = ({ playlists, searchValue, navigation }) => {
    const appContext = useContext(AppContext);

    return (
        <View style = {styles.container}>
            {playlists.map((playlist, index) => (
                <TouchableHighlight
                    onPress={() => navigation.navigate("PlaylistDetailScreen", {
                        playlist: playlist,
                        searchValue: searchValue
                    })}
                    onLongPress={() => appContext.openMenuModal(<PlaylistMenu playlist={playlist}/>)}
                    style = {styles.touchable}
                    underlayColor={'#d0d0d0'}
                    key={index.toString()}
                >
                    <Playlist
                        playlist={playlist}
                        searchValue={searchValue}
                    />
                </TouchableHighlight>
            ))}
        </View>
    );
}

export default PlaylistList;

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    touchable: {
        borderRadius: 10,
    },
})