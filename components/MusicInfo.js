import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextTicker from "react-native-text-ticker";
import TrackContext from "../utils/context/TrackContext";
import { Component, useContext, useEffect, useMemo, useState } from "react";
import TrackPlayer, { useTrackPlayerEvents, Event } from "react-native-track-player";
import AppContext from "../utils/context/AppContext";
import ICONS from "../assets/ICONS";
import TrackFavourite from "./TrackFavorite";

const MusicInfo = () => {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	const [track, setTrack] = useState({
		title: "Title",
		artist: "Artist"
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
					source={require('../assets/defaults/cover_default.jpg')}
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
						<Text style={{ fontSize: 15 }}>{track.artist}</Text>
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

const styles = StyleSheet.create({
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
	},
	favouriteButton: {
		borderRadius: 20,
		height: 40,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
	}
});
