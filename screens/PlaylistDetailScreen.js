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

export default function PlaylistDetailScreen({ route, navigation }) {
    const playlist = route.params.playlist;

	return (
		<View style = {styles.container}>
			<DetailScreenHeader
				data={playlist}
				navigation={navigation}
				searchValue={route.params.searchValue}
			/>

			<ScrollView>
				<View style = {styles.playlistInfoContainer}>
					<View style = {styles.coverWrapper}>
						<Image
							source={require('../assets/defaults/cover_default.jpg')}
							style = {styles.coverImage}
						/>
					</View>

					<View style = {styles.infoView}>
						<Text style = {styles.nameText} numberOfLines={3}>{playlist.name}</Text>
						<Text style = {styles.totalSongText} numberOfLines={1}>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song": "Songs")}</Text>
					</View>
				</View>

				<TrackList
                    tracks={playlist}
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
	headerContainer: {
		margin: 5,
	},
	playlistInfoContainer: {
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
	totalSongText: {
		fontSize: 14,
	},
});
