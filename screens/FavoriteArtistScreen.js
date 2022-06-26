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
import ArtistList from '../components/ArtistList';
import DetailScreenHeader from '../components/DetailScreemHeader';
import i18n from '../utils/i18n';
import ArtistDetailScreen from './ArtistDetailScreen';

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);
    const favoriteArtists = trackContext.artists
        .map(artist => ({
            ...artist,
            type: "Favorites artist",
            list: artist.list.filter(track => trackContext.favorites.some(favorite => favorite.id == track.id))
        }))
        .filter(artist => artist.list.length != 0)

	return (
		<View style = {styles.container}>
			<TouchableOpacity
                onPress={() => navigation.goBack()}
                style = {styles.headerButton}
            >
                <Feather
					name={ICONS.BACK}
					size={35}
					color={darkMode ? '#d9d9d9' : '#151515'}
				/>
            </TouchableOpacity>

			<ScrollView showsVerticalScrollIndicator={false}>
				<ArtistList
					artists={favoriteArtists}
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
            <Stack.Screen name='ArtistDetailScreen' component={ArtistDetailScreen} />
        </Stack.Navigator>
    )
}

const getStyles = (darkMode) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: darkMode ? '#494949' : '#f0f0f0',
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
