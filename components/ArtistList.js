import { useContext } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import Artist from '../components/Artist';
import AppContext from '../utils/context/AppContext';
import Feather from 'react-native-vector-icons/Feather';
import ICONS from '../assets/ICONS';
import { ArtistMenu } from './MenuModal';

const ArtistList = ({ artists, searchValue, navigation, inSearch }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        artists.map((artist, index) => (
            <TouchableHighlight
                onPress={() => navigation.navigate("ArtistDetailScreen", {
                    artist: artist,
                    searchValue: searchValue,
                    inSearch: inSearch,
                })}
                onLongPress={() => appContext.openMenuModal(<ArtistMenu artist={artist}/>)}
                underlayColor={darkMode ? '#828282' :'#d0d0d0'}
                key={index.toString()}
            >
                <View style = {styles.itemWrapper}>
                    <Artist artist={artist} />
                    <Feather
                        name={ICONS.NEXT}
                        size={25}
					    color={darkMode ? '#d9d9d9' : '#151515'}
                        style={{marginHorizontal: 5}}
                    />
                </View>
            </TouchableHighlight>
        ))
    );
}

export default ArtistList;

const styles = StyleSheet.create({
	itemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});