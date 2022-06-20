import { StyleSheet, View } from 'react-native';
import { TouchableHighlight } from 'react-native';
import Album from './Album';

const AlbumList = ({ albums, searchValue, navigation }) => {
    return (
        <View style = {styles.container}>
            {albums.map((album, index) => (
                <TouchableHighlight
                    onPress={() => navigation.navigate("AlbumDetailScreen", {
                        album: album,
                        searchValue: searchValue
                    })}
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