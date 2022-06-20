import { useContext, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function FavoriteSongScreen({ navigation }) {
    const trackContext = useContext(TrackContext);
    const favoriteSongs = {
        name: "",
        type: "Favorite Songs",
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
