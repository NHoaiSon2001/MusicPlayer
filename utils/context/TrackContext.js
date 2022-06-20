import { Component, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import AppContext from "./AppContext";
var RNFS = require('react-native-fs');

const TrackContext = createContext();

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
		request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res => console.log(res));
	}

	const getPlaylists = async () => {
		AsyncStorage.getAllKeys((err, keys) => {
			AsyncStorage.multiGet(keys.filter(key => key.includes("Playlist")), (err, storage) => {
				setPlaylists(storage.map(item => JSON.parse(item[1])))
			})
		});
	}

	const appContext = useContext(AppContext);

	const [allTrack, setAllTrack] = useState({ list: [] });
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);
	const [playlists, setPlaylists] = useState([]);
	const [favorites, setFavorites] = useState([]);

	const [searchHistory, setSearchHistory] = useState([]);

	const [queueInfo, setQueueInfo] = useState({
		name: "",
		type: ""
	});
	const [shuffle, setShuffle] = useState(-1);

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
		const queue = await AsyncStorage.getItem("Queue");
		if(queue != null) TrackPlayer.add(JSON.parse(queue));
		const index = await AsyncStorage.getItem("Index");
		if(index != null) TrackPlayer.skip(JSON.parse(index));
	}

	const setupQueue = async (tracks, index, newShuffle) => {
		appContext.playerScreenRef.current?.open('top');
		appContext.setHavingPlayer(true);
		if(newShuffle) {
			setShuffle(3 - Math.abs(shuffle));
		} else {
			setShuffle(-3 + Math.abs(shuffle));
		}
		setQueueInfo({
			name: tracks.name,
			type: tracks.type
		})
		TrackPlayer.reset();
		TrackPlayer.add(newShuffle > 0
			? ([].concat(tracks.list).sort(() => Math.random() - 0.5))
			: tracks.list);
		TrackPlayer.skip(index);
		AsyncStorage.setItem("Queue", JSON.stringify(await TrackPlayer.getQueue()));
		AsyncStorage.setItem("Index", JSON.stringify(index));
		setTimeout(() => {
			TrackPlayer.play();
		}, 500);
	}

	const saveHistory = (value) => {
		if (value != null) {
			const newSearchHistory = [value, ...(searchHistory.filter(history => history != value))];
			setSearchHistory(newSearchHistory);
			AsyncStorage.setItem("SearchHistory", JSON.stringify(newSearchHistory));
		} else {
			setSearchHistory([]);
			AsyncStorage.setItem("SearchHistory", "[]");
		}
	}

	const toggleFavorite = (favorite, track) => {
		if (!favorite) {
			const newFavorites = favorites.filter(favorite => favorite.id != track.id);
			setFavorites(newFavorites);
			AsyncStorage.setItem("Favorites", JSON.stringify(newFavorites));
		} else {
			const newFavorites = [...favorites, track].sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);
			setFavorites(newFavorites);
			AsyncStorage.setItem("Favorites", JSON.stringify(newFavorites));
		}
	}

	const createPlaylist = (name, list, navigateDetail) => {
		const newPlaylist = {
			createTime: (new Date()).getTime(),
			name: name,
			type: "Playlist",
			list: list
		};
		setPlaylists([...playlists, newPlaylist]);
		if(navigateDetail) {
			appContext.mainNavigationRef.navigate("PlaylistDetailScreen", {playlist: newPlaylist});
		}
		AsyncStorage.setItem("Playlist" + name + newPlaylist.createTime, JSON.stringify(newPlaylist));
	}

	useEffect(() => {
		setupPlayer();
		getPermissions();
		getPlaylists();
	}, [])

	useEffect(async () => {
		if(appContext.firstRender) {
			const storage = await AsyncStorage.getItem("Favorites");
			if (storage != null) setFavorites(JSON.parse(storage));
		} else {
			AsyncStorage.setItem("Favorites", JSON.stringify(favorites));
		}
	}, [favorites])

	useEffect(async () => {
		if(appContext.firstRender) {
			const storage = await AsyncStorage.getItem("SearchHistory");
			if (storage != null) setSearchHistory(JSON.parse(storage));
		} else {
			AsyncStorage.setItem("SearchHistory", JSON.stringify(searchHistory));
		}
	}, [searchHistory])

	useEffect(async () => {
		if(appContext.firstRender) {
			const storage = await AsyncStorage.getItem("QueueInfo");
			if (storage != null) setQueueInfo(JSON.parse(storage));
		} else {
			AsyncStorage.setItem("QueueInfo", JSON.stringify(queueInfo));
		}
	}, [queueInfo])

	return (
		<TrackContext.Provider value={{
			allTrack: allTrack,
			albums: albums,
			artists: artists,
			playlists: playlists,
			searchHistory: searchHistory,
			queueInfo: queueInfo,
			shuffle: shuffle,
			favorites: favorites,
			setupQueue: setupQueue,
			setQueueInfo: setQueueInfo,
			saveHistory: saveHistory,
			setFavorites: setFavorites,
			toggleFavorite: toggleFavorite,
			createPlaylist: createPlaylist,
		}}>
			{children}
		</TrackContext.Provider>
	)
}

export default TrackContext;