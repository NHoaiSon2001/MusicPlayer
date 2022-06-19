import { useContext, useState, useEffect } from 'react';
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
import i18n from '../utils/i18n';
import TextTicker from "react-native-text-ticker";
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function AlbumDetailScreen({ route, navigation }) {
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		margin: 5,
	},
	albumNameContainer: {
		height: 40,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	albumNameText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	controllContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	playButtonTouable: {
		height: 40,
		minWidth: "45%",
		alignSelf: 'flex-start',
		flexShrink: 1,
		marginHorizontal: 10,
	},
	playButtonContainer: {
		height: '100%',
		backgroundColor: '#d0d0d0',
		borderRadius: 30,
		flexDirection: 'row',
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	playButtonText: {
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
		height: 150,
	},
	nameText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	artistText: {
		fontSize: 15,
	},
	totalSongText: {
		fontSize: 14,
	},
});
