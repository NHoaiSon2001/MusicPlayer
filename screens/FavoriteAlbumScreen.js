import { useContext, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ICONS from '../assets/ICONS';
import FloatingPlayer from '../components/FloatingPlayer';
import DetailScreenHeader from '../components/DetailScreemHeader';
import AlbumList from '../components/AlbumList';
import i18n from '../utils/i18n';
import AlbumDetailScreen from './AlbumDetailScreen';

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
    const trackContext = useContext(TrackContext);
    const favoriteAlbums = trackContext.albums
        .map(album => ({
            ...album,
            type: "Favorite album",
            list: album.list.filter(track => trackContext.favorites.some(favorite => favorite.id == track.id))
        }))
        .filter(album => album.list.length != 0)

	return (
		<View style = {styles.container}>
			<TouchableOpacity
                onPress={() => navigation.goBack()}
                style = {styles.headerButton}
            >
                <Feather name={ICONS.BACK} size={30}/>
            </TouchableOpacity>

			<ScrollView
				showsVerticalScrollIndicator={false}
				style = {{marginHorizontal: 10}}
			>
				<AlbumList
					albums={favoriteAlbums}
					navigation={navigation}
				/>
				<FloatingPlayerArea/>
			</ScrollView>

			<FloatingPlayer/>
		</View>
	);
}

export default function FavoriteArtistScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='FavoriteHome' component={Screen}/>
            <Stack.Screen name='AlbumDetailScreen' component={AlbumDetailScreen} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
    headerButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 30,
        margin: 5,
	},
});
