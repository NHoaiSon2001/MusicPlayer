import { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ICONS from '../assets/ICONS';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import i18n from '../utils/i18n';
import TextTicker from "react-native-text-ticker";
import DetailScreenHeader from '../components/DetailScreemHeader';

export default function PlaylistDetailScreen({ route, navigation }) {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
	const trackContext = useContext(TrackContext);
	const [playlist, setPlaylist] = useState(route.params.playlist);

	useEffect(() => {
		const newPlaylist = trackContext.playlists.find(inPlaylists => inPlaylists.createTime === playlist.createTime);
		if (newPlaylist !== undefined) {
			setPlaylist(newPlaylist);
		} else {
			navigation.goBack();
		}
	}, [trackContext.playlists])

	const AddSongButton = () => (
		<View style={styles.addSongsTouchable}>
			<Entypo
				name={ICONS.ADD_SONGS}
				size={25}
				color={darkMode ? '#ffffff' : '#626262'}
			/>
			<Text style={styles.addSongsText}>{i18n.t("Add songs")}</Text>
		</View>
	)

	return (
		<View style={styles.container}>
			<DetailScreenHeader
				data={playlist}
				navigation={navigation}
				searchValue={route.params.searchValue}
			/>

			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<View style={styles.playlistInfoContainer}>
					<View style={styles.coverWrapper}>
						<Image
							source={playlist.coverBase64 === null
								? require('../assets/defaults/cover_default.jpg')
								: {uri: playlist.coverBase64}
							}
							style={styles.coverImage}
						/>
					</View>

					<View style={styles.infoView}>
						<View>
							<Text style={styles.nameText} numberOfLines={3}>{playlist.name}</Text>
							<Text style={styles.totalSongText} numberOfLines={1}>{playlist.list.length} {i18n.t((playlist.list.length < 2) ? "Song" : "Songs")} • {new Date(playlist.createTime).toISOString().slice(0, 10)}</Text>
						</View>

						{
							playlist.list.length != 0
								? <TouchableOpacity
									onPress={() => navigation.navigate("AddSongScreen", { playlistCreateTime: playlist.createTime })}
									style={styles.addSongsTouchable}
									activeOpacity={1}
								>
									<AddSongButton />
								</TouchableOpacity>
								: <View />
						}
					</View>
				</View>

				{
					playlist.list.length != 0
						? <View>
							<TrackList
								tracks={playlist}
								navigation={navigation}
								searchValue={route.params.searchValue}
							/>
							<FloatingPlayerArea />
						</View>
						: <View style={{ flexGrow: 1 }}>
							<View style={styles.endIcon} />
							<TouchableOpacity
								onPress={() => navigation.navigate("AddSongScreen", { playlistCreateTime: playlist.createTime })}
								activeOpacity={1}
								style={styles.addSongsArea}
							>
								<AddSongButton />
								<View />
							</TouchableOpacity>
						</View>
				}
			</ScrollView>

			<FloatingPlayer />
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
		height: 150,
		marginVertical: 10,
		marginRight: 5,
		justifyContent: 'space-between',
	},
	nameText: {
		fontSize: 20,
		fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
	},
	totalSongText: {
		fontSize: 14,
        color: darkMode ? '#dbdbdb' : '#151515',
	},
	addSongsTouchable: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: darkMode ? '#8a8a8a' : '#d0d0d0',
		height: 40,
		borderRadius: 20,
		paddingHorizontal: 20,
	},
	endIcon: {
		height: 5,
		alignSelf: 'center',
		width: 200,
		backgroundColor: '#ababab',
		borderRadius: 30,
	},
	addSongsArea: {
		flexGrow: 1,
		justifyContent: 'space-around',
	},
	addSongsText: {
		fontWeight: 'bold',
		marginLeft: 5,
        color: darkMode ? '#ffffff' : '#151515',
	},
});
