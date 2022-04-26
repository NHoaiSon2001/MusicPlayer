import { Component, createContext, createRef } from "react";
import { Alert, PermissionsAndroid } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";

const AppContext = createContext();

export class AppProvider extends Component {
	constructor() {
		super();
		this.playerScreenRef = createRef();
		this.queueScreenRef = createRef();
		this.state = {
			audioFile: [],
		}
	}

	getAudioFileData = () => {


		// MusicFiles.getAll({
		//     }).then(tracks => {
		// 		this.setState({
		// 			audioFile:tracks,
		// 		})
		//     }).catch(error => {
		//     console.log(error)
		// })
	}

	getAudioFileUri = async () => {
		await RNAndroidAudioStore.getAll({
			id: true,
			blured: true,
			artist: true,
			duration: true,
			genre: true,
			title: true,
			cover: true,
			minimumSongDuration: 1000,
		}).then(tracks => {
			tracks.map(tracks => {
				this.setState({
					audioFile: [...this.state.audioFile, tracks],
				})
			})
		}).catch(error => {
			console.log(error)
		})
		console.log(this.state.audioFile);
	}

	getPermissions = async () => {
		check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res => {
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
							this.getAudioFileUri();
						}
					})
					break;
				case RESULTS.LIMITED:
					console.log('The permission is limited: some actions are possible');
					break;
				case RESULTS.GRANTED:
					console.log('The permission is granted');
					this.getAudioFileUri();
					break;
				case RESULTS.BLOCKED:
					console.log('The permission is denied and not requestable anymore');
					break;
			}
		})

		// 	const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
		// 	if (permission === PermissionsAndroid.RESULTS.GRANTED) {
		//   console.log("1");
		// } else {
		//   console.log("0");
		// }
	}

	// componentDidMount() {
	// 	DeviceEventEmitter.addListener(
	// 		'onBatchReceived',
	// 		(params) => {
	// 			this.setState({songs : [
	// 				...this.state.songs,
	// 				...params.batch
	// 			]});
	// 		}
	// 	)
	// }

	componentDidMount() {
		this.getPermissions();
	}

	render() {
		return (
			<AppContext.Provider value={{
				audioFile: this.state.audioFile,
				playerScreenRef: this.playerScreenRef,
				queueScreenRef: this.queueScreenRef,
			}}>
				{this.props.children}
			</AppContext.Provider>
		)
	}
}

export default AppContext;