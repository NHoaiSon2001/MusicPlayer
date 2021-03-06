import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextTicker from "react-native-text-ticker";
import TrackContext from "../utils/context/TrackContext";
import { useContext, useEffect, useState } from "react";
import TrackPlayer, { useTrackPlayerEvents, Event } from "react-native-track-player";
import AppContext from "../utils/context/AppContext";
import TrackFavourite from "./TrackFavorite";
import i18n from "../utils/i18n";

const MusicInfo = () => {
	const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
	const trackContext = useContext(TrackContext);
	const [track, setTrack] = useState({
		title: i18n.t("Title"),
		artist: i18n.t("Artist")
	});

	useEffect(async () => {
		const queue = JSON.parse(await AsyncStorage.getItem("Queue"));
		const index = JSON.parse(await AsyncStorage.getItem("Index"));
		if(queue != null && index != null && index < queue.length) {
			setTrack(queue[index]);
		}
	}, [])


	useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			setTrack(await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()));
		}
	});

	return (
		<View style={styles.musicInfoContainer}>
			<View style={styles.coverWrapper}>
				<Image
					source={track.cover === undefined
                        ? require('../assets/defaults/cover_default.jpg')
                        : {uri: track.cover}
                    }
					style={styles.coverImage}
				/>
			</View>

			<View style={styles.musicInfoView}>
				<View style={styles.musicInfoWrapper}>
					<TextTicker
						style={styles.titleText}
						duration={15000}
						marqueeDelay={500}
						animationType={'auto'}
						loop={true}
						bounce={false}
						scroll={false}
					>
						{track.title}
					</TextTicker>
					<TouchableOpacity
						onPress={() => {
							appContext.playerBack();
							appContext.mainNavigationRef.navigate("MainNavigator");
							appContext.mainNavigationRef.navigate("Artists");
							setTimeout(() => {
								appContext.mainNavigationRef.navigate("ArtistDetailScreen", { artist: trackContext.artists.find(({ name }) => name === track.artist) });
							}, 10);
						}}
						style={{ alignSelf: "flex-start" }}
					>
						<Text style={styles.artistText}>{track.artist}</Text>
					</TouchableOpacity>
				</View>

				<TrackFavourite
					track={track}
					size={30}
				/>
			</View>
		</View>
	)
}

export default MusicInfo;

const getStyles = (darkMode) => StyleSheet.create({
	musicInfoContainer: {
		borderColor: "#ffffff",
		flex: 0.6,
		alignItems: 'center',
	},
	coverWrapper: {
		height: 350,
		width: 350,
		padding: 16,
		borderColor: "#ffffff",
		shadowColor: '#000000',
		elevation: 140
	},
	coverImage: {
		height: '100%',
		width: '100%',
		borderRadius: 30,
	},
	musicInfoView: {
		width: '85%',
		top: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	musicInfoWrapper: {
		justifyContent: 'space-between',
		width: '85%',
	},
	titleText: {
		fontSize: 25,
		fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
	},
	artistText: {
		fontSize: 15,
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
	},
	favouriteButton: {
		borderRadius: 20,
		height: 40,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
	}
});
