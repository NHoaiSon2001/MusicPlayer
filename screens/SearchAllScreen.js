import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArtistDetailScreen from './ArtistDetailScreen';
import AlbumDetailScreen from './AlbumDetailScreen';
import ICONS from '../assets/ICONS';
import i18n from '../utils/i18n';
import TrackList from '../components/TrackList';
import ArtistList from '../components/ArtistList';
import AlbumList from '../components/AlbumList';
import PlaylistList from '../components/PlaylistList';
import TrackContext from '../utils/context/TrackContext';
import SearchHistory from '../components/SearchHistory';
import SearchScreenHeader from '../components/SearchScreenHeader';
import AppContext from '../utils/context/AppContext';

const Stack = createStackNavigator();

const Screen = ({ route, navigation }) => {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
	const favorite = route.params.favorite;
	const trackContext = useContext(TrackContext);
	const [searchValue, setSearchValue] = useState("");
	const [type, setType] = useState(route.params.type);
	const songs = favorite ? trackContext.favorites : trackContext.allTrack.list;
	const [songResult, setSongResult] = useState({
		name: "",
		type: "Custom",
		list: []
	});
	const [artistResult, setArtistResult] = useState([]);
	const artists = (favorite
		? trackContext.artists
			.map(artist => ({
				...artist,
				type: "Favorite artist",
				list: artist.list.filter(track => trackContext.favorites.some(favorite => favorite.id == track.id))
			}))
			.filter(artist => artist.list.length != 0)
		: trackContext.artists
	)
	const [albumResult, setAlbumResult] = useState([]);
	const albums = (favorite
		? trackContext.albums
			.map(album => ({
				...album,
				type: "Favorite album",
				list: album.list.filter(track => trackContext.favorites.some(favorite => favorite.id == track.id))
			}))
			.filter(album => album.list.length != 0)
		: trackContext.albums
	)
	const [playlistResult, setPlaylistResult] = useState([]);

	useEffect(() => {
		setSongResult({
			...songResult,
			list: songs.filter(track => (track.title.toLowerCase()).includes(searchValue.toLowerCase()))
		});
		setArtistResult(artists.filter(artist => (artist.name.toLowerCase()).includes(searchValue.toLowerCase())))
		setAlbumResult(albums.filter(album => (album.name.toLowerCase()).includes(searchValue.toLowerCase())))
		setPlaylistResult(trackContext.playlists.filter(playlist => (playlist.name.toLowerCase()).includes(searchValue.toLowerCase())))
	}, [searchValue])

	const SongResult = () => (
		songResult.list.length != 0
			? <ScrollView showsVerticalScrollIndicator={false}>
				<TrackList
					tracks={songResult}
					searchValue={searchValue}
					navigation={navigation}
				/>
			</ScrollView>
			: <NoResult />
	)

	const ArtistResult = () => (
		artistResult.length != 0
			? <ScrollView showsVerticalScrollIndicator={false}>
				<ArtistList
					artists={artistResult}
					searchValue={searchValue}
					navigation={navigation}
					inSearch={true}
				/>
			</ScrollView>
			: <NoResult />
	)

	const AlbumResult = () => (
		albumResult.length != 0
			? <ScrollView
				showsVerticalScrollIndicator={false}
				style = {{marginHorizontal: 10}}
			>
				<AlbumList
					albums={albumResult}
					searchValue={searchValue}
					navigation={navigation}
				/>
			</ScrollView>
			: <NoResult />
	)

	const PlaylistResult = () => (
		playlistResult.length != 0
			? <ScrollView
				showsVerticalScrollIndicator={false}
				style = {{marginHorizontal: 10}}
			>
				<PlaylistList
					playlists={playlistResult}
					searchValue={searchValue}
					navigation={navigation}
				/>
			</ScrollView>
			: <NoResult />
	)

	const NoResult = () => (
		<View style={styles.noResult}>
			<Ionicons
                name={ICONS.SEARCH}
                size={60}
                color={darkMode ? '#d9d9d9' : '#151515'}
            />
            <Text style = {styles.noResultText}>{i18n.t("No result")} {searchValue}</Text>
		</View>
	)

	const ShowResult = () => {
		switch (type) {
			case "Songs": return <SongResult />
			case "Artists": return <ArtistResult />
			case "Albums": return <AlbumResult />
			case "Playlists": return <PlaylistResult />
		}
	}

	const Result = () => (
		<View style = {{flex: 1}}>
			<View style={styles.typeTouchableContainer}>
				<TouchableOpacity
					onPress={() => setType("Songs")}
					style={styles.typeTouchable}
				>
					<MaterialCommunityIcons
						name={ICONS.SONGS}
						size={30}
						color={(type === "Songs") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setType("Artists")}
					style={styles.typeTouchable}
				>
					<MaterialCommunityIcons
						name={ICONS.ARTISTS}
						size={30}
						color={(type === "Artists") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setType("Albums")}
					style={styles.typeTouchable}
				>
					<MaterialCommunityIcons
						name={ICONS.ALBUMS}
						size={30}
						color={(type === "Albums") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
					/>
				</TouchableOpacity>

				{
					favorite
						? null
						: <TouchableOpacity
							onPress={() => setType("Playlists")}
							style={styles.typeTouchable}
						>
							<MaterialCommunityIcons
								name={ICONS.PLAYLISTS}
								size={30}
								color={(type === "Playlists") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
							/>
						</TouchableOpacity>
				}
			</View>

			<ShowResult />
		</View>
	)

	return (
		<View style={styles.container}>
			<SearchScreenHeader
				placeholder={favorite ? i18n.t("Search all favorite") : i18n.t("Search all")}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>

			{
				searchValue.length != 0
					? <Result />
					: (
						trackContext.searchHistory.length != 0
							? <SearchHistory setSearchValue={setSearchValue} />
							: null
					)
			}
		</View>
	)
}

export default function SearchAllScreen({ route }) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name='SearchAllHome'
				component={Screen}
				initialParams={route.params}
			/>
			<Stack.Screen name='ArtistDetailScreen' component={ArtistDetailScreen} />
			<Stack.Screen name='AlbumDetailScreen' component={AlbumDetailScreen} />
		</Stack.Navigator>
	)
}

const getStyles = (darkMode) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: darkMode ? '#494949' : '#f0f0f0',
	},
	noResult: {
        marginTop: 100,
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#d9d9d9' : '#151515',
	},
	typeTouchableContainer: {
		height: 70,
		flexDirection: 'row',
	},
	typeTouchable: {
		height: '100%',
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});