import React, { Component, useCallback, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FloatingPlayer from '../components/FloatingPlayer';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer from 'react-native-track-player';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from '../assets/ICONS';

export default function SongListScreen() {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);

	const Item = ({track, index}) => (
		<TouchableOpacity
			onPress={async () => {
				await trackContext.setupQueue(trackContext.allTrack, index, false);
				await appContext.openPlayer(1000);
				await appContext.setHavingPlayer(true);
			}}
		>
			<View style = {styles.itemWrapper}>
				<Track track={track} index={index}/>
				<TouchableOpacity
					style = {styles.optionButton}
				>
					<Ionicons name={ICONS.TRACK_OPTION} size={23}/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	)

	return (
		<View style = {styles.container}>
			<TouchableOpacity
				onPress={async () => {
					await trackContext.setupQueue(trackContext.allTrack, 0, true);
					await appContext.openPlayer(1000);
					await appContext.setHavingPlayer(true);
				}}
			>
				<Text>shuffle all</Text>
			</TouchableOpacity>

			<ScrollView>
				{trackContext.allTrack.map((track, index) => (
					<Item
						track={track}
						index={index}
						key={index.toString()}
					/>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	itemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	optionButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5,
	},
});
