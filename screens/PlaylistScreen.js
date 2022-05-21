import { Component, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackContext from '../utils/context/TrackContext';
import AppContext from '../utils/context/AppContext';
import TrackPlayer from 'react-native-track-player';

export default function PlaylistScreen() {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	return (
		<View style = {styles.container}>
			<ScrollView>
				{trackContext.allTrack.map((track, index) => (
					<TouchableOpacity
						onPress={async () => {
							await TrackPlayer.add(track);
							await appContext.openPlayer(1000);
							await appContext.setHavingPlayer(true);
						}}
						key={index.toString()}
					>
						<Text>{track.title}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
