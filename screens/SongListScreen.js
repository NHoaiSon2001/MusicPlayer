import { Component, useContext} from 'react';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import PlayerScreen from './PlayerScreen';

import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer from 'react-native-track-player';

export default function SongListScreen() {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	return (
		<View>
			<TouchableOpacity
				onPress={async () => {
					await trackContext.setupQueue(trackContext.allTrack, 0, true);
					await appContext.openPlayer(1000);
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
