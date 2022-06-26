import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function ArtistDetailScreen({ route, navigation }) {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
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

			{
				route.params.inSearch
					? null
					: <FloatingPlayer/>
			}
		</View>
	);
}

const getStyles = (darkMode) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: darkMode ? '#494949' : '#f0f0f0',
	},
});
