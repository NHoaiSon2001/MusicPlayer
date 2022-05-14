import { Component, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FloatingPlayer from '../components/FloatingPlayer';

import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer from 'react-native-track-player';

export default function SongListScreen() {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
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
					<TouchableOpacity
						onPress={async () => {
							await trackContext.setupQueue(trackContext.allTrack, index, false);
							await appContext.openPlayer(1000);
							await appContext.setHavingPlayer(true);
						}}
						key={index.toString()}
					>
						<Text>{track.title}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>


			<FloatingPlayer />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
