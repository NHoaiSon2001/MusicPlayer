import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ICONS from '../assets/ICONS';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function ArtistDetailScreen({ route, navigation }) {
	const trackContext = useContext(TrackContext);
    const [artist, setArtist] = useState(route.params.artist);

	useEffect(() => {
		if(artist.type.includes("Favorite")) {
			setArtist({
				...artist,
				list: trackContext.favorites.filter(favorite => favorite.artist == artist.name)
			})
			if(!trackContext.favorites.some(favorite => favorite.artist === artist.name)) {
				navigation.goBack();
			}
		}
	}, [trackContext.favorites])

	return (
		<View style = {styles.container}>
			<DetailScreenHeader
				data={artist}
				navigation={navigation}
				searchValue={route.params.searchValue}
			/>

			<ScrollView>
				<TrackList
					tracks={artist}
					navigation={navigation}
					searchValue={route.params.searchValue}
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
