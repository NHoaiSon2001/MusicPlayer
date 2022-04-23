import React, { Component, createContext, useState } from "react";
import { Alert } from "react-native";
import * as MediaLibrary from 'expo-media-library';
//import { Permission } from "react-native-permissions";

const AppContext = createContext();

export class AppProvider extends Component {
	constructor() {
		super();
        this.state = {
            audioFile: [],
        }
	}

    getAudioFile = async () => {
        let media = await MediaLibrary.getAssetsAsync({mediaType: 'audio'})
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        });
        console.log(media.assets);
        console.log(media.assets);
        this.setState({
            audioFile: media.assets,
        })
        console.log("get audio")
    }

    getPermissions = async () => {
        const permissions = await MediaLibrary.getPermissionsAsync();
        if (permissions.granted) {
            this.getAudioFile();
        }

        if (!permissions.granted) {
            const permissions = await MediaLibrary.requestPermissionsAsync();
            console.log(permissions)
            //this.getAudioFile();
            // if (status == "granted") {
            //     this.getAudioFile();
            // }

            // if (status == "denied") {
            //     Alert.alert("Cannot access internal memory1");
            // }
        }

        if (!permissions.granted && !permissions.canAskAgain) {
            Alert.alert("Cannot access internal memory");
        }
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