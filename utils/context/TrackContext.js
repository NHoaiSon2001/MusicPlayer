import { Component, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import AppContext from "./AppContext";
var RNFS = require('react-native-fs');

const TrackContext = createContext();
const data_path = RNFS.DocumentDirectoryPath + "/data.txt";

export function TrackProvider({ children }) {
	const getAudioFile = async () => {
		let list;
		await RNAndroidAudioStore.getAll({
			id: true,
			artist: true,
			duration: true,
			genre: true,
			title: true,
			cover: true,
			minimumSongDuration: 1000,
		}).then(async tracks => {
			//console.log(tracks);
			list = (await Promise.all(tracks.map(async track => ({
				...track,
				exists: await RNFS.exists(track.path)
			}))))
				.filter(track => track.exists == true)
				.map((track) => ({
					id: track.id,
					url: track.path,
					title: track.title,
					artist: track.author,
					album: track.album,
					duration: track.duration / 1000,
					favourite: false
				}))
				.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
			setAllTrack({
				name: "",
				type: "All",
				list: list
			})
		}).catch(error => {
			console.log(error)
		})
		await RNAndroidAudioStore.getAlbums()
			.then(async (albums) => {
				setAlbums(albums
					.map(album => ({
						name: album.album,
						type: "Album",
						artist: album.author,
						list: list.filter(track => track.album == album.album)
					}))
					.filter(album => album.list.length != 0)
					.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
				);
			})
		await RNAndroidAudioStore.getArtists()
			.then((artists) => {
				setArtists(artists
					.map(artist => ({
						name: artist.artist,
						type: "Artist",
						list: list.filter(track => track.artist == artist.artist)
					}))
					.filter(artist => artist.list.length != 0)
					.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
				);
			})
	}

	const getPermissions = async () => {
		await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res => {
			console.log(res);
			switch (res) {
				case RESULTS.UNAVAILABLE:
					console.log('This feature is not available (on this device / in this context)');
					break;
				case RESULTS.DENIED:
					console.log('The permission has not been requested / is denied but requestable');
					request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res => {
						console.log(res);
						if (res == RESULTS.GRANTED) {
							getAudioFile();
						}
					})
					break;
				case RESULTS.LIMITED:
					console.log('The permission is limited: some actions are possible');
					break;
				case RESULTS.GRANTED:
					console.log('The permission is granted');
					getAudioFile();
					break;
				case RESULTS.BLOCKED:
					console.log('The permission is denied and not requestable anymore');
					break;
			}
		})
		request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res =>console.log(res));
	}

	const appContext = useContext(AppContext);

	const [allTrack, setAllTrack] = useState({ list: [] });
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);
	const [favorites, setFavorites] = useState([]);

	const [searchHistory, setSearchHistory] = useState([]);

	const [queueInfo, setQueueInfo] = useState({
		name: "",
		type: ""
	});
	const [shuffle, setShuffle] = useState(false);

	const setupPlayer = async () => {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToPrevious,
				Capability.SkipToNext,
				Capability.Stop,
			]
		})
	}

	const setupQueue = async (queue, index, shuffle) => {
		saveData();
		appContext.playerScreenRef.current?.open('top');
		appContext.setHavingPlayer(true);
		setShuffle(shuffle);
		setQueueInfo({
			name: queue.name,
			type: queue.type
		})
		TrackPlayer.reset();
		TrackPlayer.add(shuffle
			? ([].concat(queue.list).sort(() => Math.random() - 0.5))
			: queue.list);
		TrackPlayer.skip(index);
		setTimeout(() => {
			TrackPlayer.play();
		}, 500);
	}

	const saveHistory = (value) => {
		if (value != null) {
			setSearchHistory([
				value,
				...(searchHistory.filter(history => history != value))
			]);
		} else {
			setSearchHistory([]);
		}
		AsyncStorage.setItem("SearchHistory", JSON.stringify(searchHistory));
	}

	useEffect(async () => {
		getPermissions();
		setupPlayer();
		const storageSearchHistory = await AsyncStorage.getItem("SearchHistory");
		if(storageSearchHistory != null) setSearchHistory(JSON.parse(storageSearchHistory));
		// const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
		// 	//console.log(appContext.mainNavigationRef.getState())
		// 	BackHandler.exitApp();
		// 	return true;
		// });
		// const appState = AppState.addEventListener('change', nextAppState => {
		// 	console.log(nextAppState)
		// 	// if (nextAppState === '') {
		// 	// 	console.log('the app is closed');
		// 	// }
		// })
		// return () => {
		// 	// backHandler.remove();
		// 	appState.remove();
		// }
	}, [])

	const toggleFavorite = (favorite, track) => {
		if (!favorite) {
			setFavorites(favorites.filter(favorite => favorite.id != track.id));
		} else {
			setFavorites([...favorites, track].sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
		}
	}

	const saveData = () => {
		RNFS.writeFile(data_path, "this is data", 'utf8')
			.then((success) => {
			console.log('FILE WRITTEN!');
		   })
			.catch((err) => {
				console.log(err.message);
			});
	}

	return (
		<TrackContext.Provider value={{
			allTrack: allTrack,
			albums: albums,
			artists: artists,
			searchHistory: searchHistory,
			queueInfo: queueInfo,
			shuffle: shuffle,
			favorites: favorites,
			setupQueue: setupQueue,
			setQueueInfo: setQueueInfo,
			saveHistory: saveHistory,
			setFavorites: setFavorites,
			toggleFavorite: toggleFavorite,
			saveData: saveData,
		}}>
			{children}
		</TrackContext.Provider>
	)
}

export default TrackContext;