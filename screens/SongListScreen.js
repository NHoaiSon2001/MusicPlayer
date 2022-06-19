import { useContext} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ICONS from '../assets/ICONS';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import i18n from '../utils/i18n';
import FavoriteButton from '../components/FavoriteButton';
import FavoriteSongScreen from './FavoriteSongScreen';

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);

	return (
		<View style = {styles.container}>
			<FavoriteButton/>

			<View style = {styles.headerContainer}>
				<View style = {styles.controllContainer}>
					<TouchableOpacity
						onPress={() => trackContext.setupQueue(trackContext.allTrack, 0, true)}
						activeOpacity={1}
						style = {styles.shuffleButtonTouable}
					>
						<View style = {styles.shuffleButtonContainer}>
							<Ionicons name={ICONS.SHUFFLE} size={30} color={'#626262'}/>
							<Text style = {styles.shuffleButtonText}>{i18n.t("Shuffle playback")}</Text>
						</View>
					</TouchableOpacity>

					<View style = {styles.controllContainer}>
						<TouchableOpacity
							onPress={() => navigation.navigate("SearchScreen", {data: trackContext.allTrack})}
							style = {styles.headerButton}
						>
							<Ionicons name={ICONS.SEARCH} size={25}/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => navigation.navigate("SelectItemScreen", {
								data: trackContext.allTrack.list,
								index: null
							})}
							style = {styles.headerButton}
						>
							<Ionicons name={ICONS.SELECT_ITEM} size={30}/>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<ScrollView>
				<TrackList tracks={trackContext.allTrack} navigation={navigation}/>
				<FloatingPlayerArea/>
			</ScrollView>

			<FloatingPlayer/>
		</View>
	);
}

export default function SongListScreen() {
	return (
		<Stack.Navigator
			screenOptions={{headerShown: false}}
		>
			<Stack.Screen name='SongListScreen' component={Screen}/>
			<Stack.Screen name='FavoriteScreen' component={FavoriteSongScreen}/>
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	itemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5,
	},
	headerContainer: {
		margin: 5,
		marginHorizontal: 10,
	},
	controllContainer: {
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	shuffleButtonTouable: {
		height: 40,
		alignSelf: 'flex-start',
		flexShrink: 1,
	},
	shuffleButtonContainer: {
		height: '100%',
		backgroundColor: '#d0d0d0',
		borderRadius: 30,
		flexDirection: 'row',
		paddingHorizontal: 10,
		alignItems: 'center',
	},
	shuffleButtonText: {
		marginHorizontal: 5,
		fontSize: 15,
		fontWeight: 'bold',
	},
	headerButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 30,
	},
});
