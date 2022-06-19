import { TouchableHighlight } from 'react-native';
import Artist from '../components/Artist';

const ArtistList = ({ artists, searchValue, navigation }) => {
    return (
        artists.map((artist, index) => (
            <TouchableHighlight
                onPress={() => navigation.navigate("ArtistDetailScreen", {
                    artist: artist,
                    searchValue: searchValue
                })}
                underlayColor={'#d0d0d0'}
                key={index.toString()}
            >
                <Artist artist={artist} />
            </TouchableHighlight>
        ))
    );
}

export default ArtistList;
