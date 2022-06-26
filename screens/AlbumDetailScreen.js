import { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import i18n from '../utils/i18n';
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function AlbumDetailScreen({ route, navigation }) {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
	const trackContext = useContext(TrackContext);
    const [album, setAlbum] = useState(route.params.album);

	useEffect(() => {
		if(album.type.includes("Favorite")) {
			setAlbum({
				...album,
				list: trackContext.favorites.filter(favorite => favorite.album == album.name)
			})
			if(!trackContext.favorites.some(favorite => favorite.album === album.name)) {
				navigation.goBack();
			}
		}
	}, [trackContext.favorites])

	return (
		<View style = {styles.container}>
			<DetailScreenHeader
				data={album}
				navigation={navigation}
				searchValue={route.params.searchValue}
			/>

			<ScrollView>
				<View style = {styles.albumInfoContainer}>
					<View style = {styles.coverWrapper}>
						<Image
							source={require('../assets/defaults/cover_default.jpg')}
							style = {styles.coverImage}
						/>
					</View>

					<View style = {styles.infoView}>
						<Text style = {styles.nameText} numberOfLines={3}>{album.name}</Text>
						<Text style = {styles.artistText} numberOfLines={2}>{i18n.t("By")} {album.artist}</Text>
						<Text style = {styles.totalSongText} numberOfLines={1}>{album.list.length} {i18n.t((album.list.length < 2) ? "Song": "Songs")}</Text>
					</View>
				</View>

				<TrackList tracks={album} navigation={navigation} searchValue={route.params.searchValue}/>

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
	headerContainer: {
		margin: 5,
	},
	albumInfoContainer: {
		margin: 5,
		flexDirection: 'row',
	},
	coverWrapper: {
        height: 170,
        width: 170,
        marginHorizontal: 10,
    },
    coverImage: {
		height: '100%',
		width: '100%',
        borderRadius: 15,
	},
	infoView: {
		flexShrink: 1,
		flexGrow: 1,
		marginVertical: 10,
		marginRight: 5,
		height: 150,
	},
	nameText: {
		fontSize: 20,
		fontWeight: 'bold',
        color: darkMode ? '#e7e7e7' : '#151515',
	},
	artistText: {
		fontSize: 15,
        color: darkMode ? '#dcdcdc' : '#151515',
	},
	totalSongText: {
		fontSize: 14,
        color: darkMode ? '#dcdcdc' : '#151515',
	},
});
