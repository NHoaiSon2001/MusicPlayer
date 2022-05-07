import { Component, createContext, useEffect, useState } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";

const TrackContext = createContext();

export function TrackProvider({children}) {
	const getAudioFile = async () => {
		await RNAndroidAudioStore.getAll({
			id: true,
			artist: true,
			duration: true,
			genre: true,
			title: true,
			cover: true,
			minimumSongDuration: 1000,
		}).then(tracks => {
			//console.log(tracks);
			//console.log(FileSystem.fileExists('/storage/emulated/0/Music/NewFolder/DualExistenceToaruKagakuNoRailgunTOpening2-Fripside-6384001.mp3'))
			setAllTrack(tracks.map(track => (
				
				{
					url: track.path,
					title: track.title,
					artist: track.author,
					album: track.album,
					duration: track.duration / 1000,
				}
			)))
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

	const setupQueue = async (queue, index) => {
		await TrackPlayer.reset();
		await TrackPlayer.add(queue);
		await TrackPlayer.skip(index);
		await TrackPlayer.play();
	}

	const togglePlayback = async () => {
		const trackIndex = await TrackPlayer.getCurrentTrack();
		if(trackIndex != null) {
			if(playbackState === State.Playing) {
				await TrackPlayer.pause();
			} else {
				await TrackPlayer.play();
			}
		}
	}

	const skipToNext = async () => {
		TrackPlayer.skipToNext();
	}

	const skipToPrevious = async () => {
		TrackPlayer.skipToPrevious();
	}

	useEffect(() => {
		getPermissions();
		TrackPlayer.setupPlayer();
	}, [])

	useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackError], async (event) => {
		if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
			console.log(event.nextTrack);
            setCurrentTrack(await TrackPlayer.getTrack(event.nextTrack));
        }
		if (event.type === Event.PlaybackError) {
            console.log(event.message);
        }
	});

	return (
		<TrackContext.Provider value={{
			allTrack: allTrack,
			currentTrack: currentTrack,
			setupQueue: setupQueue,
			skipToNext: skipToNext,
			skipToPrevious: skipToPrevious,
			togglePlayback: togglePlayback,
		}}>
			{children}
		</TrackContext.Provider>
	)
}

export default TrackContext;