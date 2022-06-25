import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native';
import AppContext from '../utils/context/AppContext';
import Album from './Album';
import { AlbumMenu } from './MenuModal';

const AlbumList = ({ albums, searchValue, navigation }) => {
    const appContext = useContext(AppContext);

    return (
        <View style = {styles.container}>
            {albums.map((album, index) => (
                <TouchableHighlight
                    onPress={() => navigation.navigate("AlbumDetailScreen", {
                        album: album,
                        searchValue: searchValue
                    })}
                    onLongPress={() => appContext.openMenuModal(<AlbumMenu album={album}/>)}
                    style = {styles.touchable}
                    underlayColor={'#d0d0d0'}
                    key={index.toString()}
                >
                    <Album
                        album={album}
                        searchValue={searchValue}
                    />
                </TouchableHighlight>
            ))}
        </View>
    );
}

export default AlbumList;

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    touchable: {
        borderRadius: 10,
    },
})