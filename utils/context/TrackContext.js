import { Component, createContext, useEffect, useState } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
var RNFS = require('react-native-fs');

const TrackContext = createContext();

export function TrackProvider({ children }) {
	const getAudioFile = async () => {
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
			setAllTrack((await Promise.all(tracks.map(async track => ({
				...track,
				exists: await RNFS.exists(track.path)
			}))))
				.filter(track => track.exists == true)
				.map(track => ({
					url: track.path,
					title: track.title,
					artist: track.author,
					album: track.album,
					duration: track.duration / 1000,
				}))
			)
		}).catch(error => {
			console.log(error)
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
	}


	const playbackState = usePlaybackState();
	const [allTrack, setAllTrack] = useState([]);
	const [currentTrack, setCurrentTrack] = useState({});
	const [setuppingQueue, setSetuppingQueue] = useState(false);
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
		setSetuppingQueue(true);
		await TrackPlayer.reset();
		if(shuffle) {
			await TrackPlayer.add([].concat(queue).sort(() => Math.random() - 0.5));
		} else {
			await TrackPlayer.add(queue);
		}
		await TrackPlayer.skip(index);
		setCurrentTrack(await TrackPlayer.getTrack(index));
		setShuffle(shuffle);
		setTimeout(() => {
			TrackPlayer.play();
		}, 500);
		setSetuppingQueue(false);
	}

	const togglePlayback = async () => {
		const trackIndex = await TrackPlayer.getCurrentTrack();
		if (trackIndex != null) {
			if (playbackState === State.Playing) {
				await TrackPlayer.pause();
			} else {
				await TrackPlayer.play();
			}
		}
	}

	const toggleShuffle = async () => {
		setSetuppingQueue(true);
		setShuffle(!shuffle);
		const queue = await TrackPlayer.getQueue();
		const removeIndex = queue
			.map((track, index) => index)
		await TrackPlayer.remove(removeIndex);
		if (shuffle) {
			const newQueue = queue.sort((a, b) => a.title > b.title ? 1 : -1);
			const newTrackIndex = newQueue.findIndex(track => track.url == currentTrack.url);
			await TrackPlayer.add(newQueue.filter((track, index) => index < newTrackIndex), 0);
			await TrackPlayer.add(newQueue.filter((track, index) => index > newTrackIndex));
		} else {
			const newQueue = queue
				.filter(track => track.url != currentTrack.url)
				.sort(() => Math.random() - 0.5)
			await TrackPlayer.add(newQueue);
		}
		setSetuppingQueue(false);
	}

	useEffect(async () => {
		getPermissions();
		setupPlayer();
	}, [])

	useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackError], async (event) => {
		if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null && !setuppingQueue) {
			setCurrentTrack(await TrackPlayer.getTrack(event.nextTrack));
		}
	});

	return (
		<TrackContext.Provider value={{
			allTrack: allTrack,
			currentTrack: currentTrack,
			shuffle: shuffle,
			setuppingQueue: setuppingQueue,
			setupQueue: setupQueue,
			togglePlayback: togglePlayback,
			toggleShuffle: toggleShuffle,
		}}>
			{children}
		</TrackContext.Provider>
	)
}

export default TrackContext;