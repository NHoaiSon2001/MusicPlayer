import React, { Component, createContext, useState } from "react";
import { Alert, PermissionsAndroid } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import MusicFiles from "react-native-get-music-files";

const AppContext = createContext();

export class AppProvider extends Component {
	constructor() {
		super();
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
		await MediaLibrary.requestPermissionsAsync();
		let media = await MediaLibrary.getAssetsAsync({mediaType: 'audio'});
		media = await MediaLibrary.getAssetsAsync({
			mediaType: 'audio',
			first: media.totalCount
		})
		this.setState({
			audioFile: media.assets.map(media => media.uri),
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
						if(res == RESULTS.GRANTED) {
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

	componentDidMount() {
		this.getPermissions();
	}

	render() {
		return (
			<AppContext.Provider value={{
				audioFile: this.state.audioFile,
			}}>
				{this.props.children}
			</AppContext.Provider>
		)
	}
}

export default AppContext;