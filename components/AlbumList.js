import { TouchableHighlight } from 'react-native';
import Album from '../components/Album';

const AlbumList = ({ albums, searchValue, navigation }) => {
    return (
        albums.map((album, index) => (
            <TouchableHighlight
                onPress={() => navigation.navigate("AlbumDetailScreen", {
                    album: album,
                    searchValue: searchValue
                })}
                underlayColor={'#d0d0d0'}
                key={index.toString()}
            >
                <Album album={album} />
            </TouchableHighlight>
        ))
    );
}

export default AlbumList;