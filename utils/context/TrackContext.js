import { Component, createContext } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNAndroidAudioStore } from "react-native-get-music-files";

const TrackContext = createContext();

export class TrackProvider extends Component {
	getAudioFile = async () => {
		RNAndroidAudioStore.getAll({
			id: true,
			blured: true,
			artist: true,
			duration: true,
			genre: true,
			title: true,
			cover: true,
			minimumSongDuration: 1000,
		}).then(tracks => {
			//console.log(tracks);
			tracks.map(tracks => {
				this.setState({
					trackData: [...this.state.trackData, tracks]
				})
			})
		}).catch(error => {
			console.log(error)
		})
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
							this.getAudioFile();
						}
					})
					break;
				case RESULTS.LIMITED:
					console.log('The permission is limited: some actions are possible');
					break;
				case RESULTS.GRANTED:
					console.log('The permission is granted');
					this.getAudioFile();
					break;
				case RESULTS.BLOCKED:
					console.log('The permission is denied and not requestable anymore');
					break;
			}
		})
	}

	constructor() {
		super();
		this.state = {
			trackData: [],
			currentTrackIndex: 0,
		}
	}

	componentDidMount() {
		this.getPermissions();
	}

	skipForward = () => {
		this.setState({
			currentTrackIndex: this.state.currentTrackIndex + 1,
		})
	}

	skipBack = () => {
		this.setState({
			currentTrackIndex: this.state.currentTrackIndex - 1,
		})
	}

	render() {
		return (
			<TrackContext.Provider value={{
                trackData: this.state.trackData,
				currentTrackIndex: this.state.currentTrackIndex,
				skipForward: this.skipForward,
				skipBack: this.skipBack,
			}}>
				{this.props.children}
			</TrackContext.Provider>
		)
	}
}

export default TrackContext;