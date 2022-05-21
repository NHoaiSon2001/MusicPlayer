import { Component, createContext, useContext, useEffect, useState } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import AppContext from "./AppContext";
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
				.map((track) => ({
					id: track.id,
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

	const appContext = useContext(AppContext);
	const playbackState = usePlaybackState();
	const [allTrack, setAllTrack] = useState([]);
	const [currentTrack, setCurrentTrack] = useState({});
	const [currentIndex, setCurrentIndex] = useState(null);
	const [setupingQueue, setSetupingQueue] = useState(false);
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
		setSetupingQueue(true);
		await TrackPlayer.reset();
		if(shuffle) {
			await TrackPlayer.add([].concat(queue).sort(() => Math.random() - 0.5));
		} else {
			await TrackPlayer.add(queue);
		}
		await TrackPlayer.skip(index);
		setCurrent(index);
		setShuffle(shuffle);
		setTimeout(() => {
			TrackPlayer.play();
		}, 500);
		setSetupingQueue(false);
	}

	const moveTrack = async (index, newIndex) => {
		if(index == newIndex) return;
		setSetupingQueue(true);
		const track = await TrackPlayer.getTrack(index);
		if(currentIndex != index) {
			await TrackPlayer.remove(index);
			await TrackPlayer.add(track, newIndex);
		} else {
			const moveFrom = (index < newIndex) ? index + 1 : newIndex;
			const moveTo = (index < newIndex) ? newIndex : index - 1;
			const queue = await TrackPlayer.getQueue();
			const removeIndex = queue
				.map((track, index) => index)
				.filter((index) => index >= moveFrom && index <= moveTo);
			const moveTrack = queue.filter((track, index) => index >= moveFrom && index <= moveTo);
			await TrackPlayer.remove(removeIndex);
			await TrackPlayer.add(moveTrack, (index < newIndex) ? index : newIndex + 1);
		}
		setCurrent(await TrackPlayer.getCurrentTrack());
		setSetupingQueue(false);
	}

	const removeTrack = async(index) => {
		setSetupingQueue(true);
		if(index != currentIndex) {
			await TrackPlayer.remove(index);
			return;
		}
		const queueLength = (await TrackPlayer.getQueue()).length;
		if(queueLength == 1) {
			appContext.setHavingPlayer(false);
			return;
		}
		if (currentIndex == queueLength - 1){
			await TrackPlayer.skipToPrevious();
			setCurrent(currentIndex - 1)
		} else {
			await TrackPlayer.skipToNext();
			setCurrent(currentIndex + 1)

		}
		await TrackPlayer.remove(index);
		setSetupingQueue(false);
	}

	const togglePlayback = async () => {
		if (currentIndex != null) {
			if (playbackState === State.Playing) {
				await TrackPlayer.pause();
			} else {
				await TrackPlayer.play();
			}
		}
	}

	const toggleShuffle = async () => {
		setSetupingQueue(true);
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
		setCurrent(await TrackPlayer.getCurrentTrack());
		setSetupingQueue(false);
	}

	const setCurrent = async (index) => {
		setCurrentTrack(await TrackPlayer.getTrack(index));
		setCurrentIndex(index);
	}

	useEffect(async () => {
		getPermissions();
		setupPlayer();
	}, [])

	useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackError], async (event) => {
		if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null && !setupingQueue) {
			console.log(event.nextTrack);
			setCurrent(event.nextTrack);
		}
	});

	return (
		<TrackContext.Provider value={{
			allTrack: allTrack,
			currentTrack: currentTrack,
			shuffle: shuffle,
			setupingQueue: setupingQueue,
			currentIndex: currentIndex,
			setupQueue: setupQueue,
			togglePlayback: togglePlayback,
			toggleShuffle: toggleShuffle,
			moveTrack: moveTrack,
			removeTrack: removeTrack,
		}}>
			{children}
		</TrackContext.Provider>
	)
}

export default TrackContext;