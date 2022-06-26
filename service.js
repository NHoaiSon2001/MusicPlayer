import TrackPlayer, {RepeatMode} from 'react-native-track-player';


module.exports = async function () {

	try {
		TrackPlayer.addEventListener('remote-play', () => {
			TrackPlayer.play()
		})

		TrackPlayer.addEventListener('remote-pause', () => {
			TrackPlayer.pause()
		});

		TrackPlayer.addEventListener('remote-next', async () => {
			if(await TrackPlayer.getCurrentTrack() === (await TrackPlayer.getQueue()).length - 1 && await TrackPlayer.getRepeatMode() !== RepeatMode.Queue) return;
			TrackPlayer.skipToNext()
		});

		TrackPlayer.addEventListener('remote-previous', async () => {
			if(await TrackPlayer.getCurrentTrack() === 0 && await TrackPlayer.getRepeatMode() !== RepeatMode.Queue) return;
			TrackPlayer.skipToPrevious();
		});

		TrackPlayer.addEventListener('remote-stop', () => {
			TrackPlayer.destroy()
		});
	} catch (error) { }

};