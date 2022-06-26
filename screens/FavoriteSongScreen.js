import { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import DetailScreenHeader from '../components/DetailScreemHeader';
import AppContext from '../utils/context/AppContext';

export default function FavoriteSongScreen({ navigation }) {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);
    const favoriteSongs = {
        name: "",
        type: "Favorites all",
        list: trackContext.favorites
    }

	return (
		<View style = {styles.container}>
			<DetailScreenHeader
				data={favoriteSongs}
				navigation={navigation}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				<TrackList
					tracks={favoriteSongs}
					navigation={navigation}
				/>
				<FloatingPlayerArea/>
			</ScrollView>

			<FloatingPlayer/>
		</View>
	);
}

const getStyles = (darkMode) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: darkMode ? '#494949' : '#f0f0f0',
	},
});
