import { Component } from 'react';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import PlayerScreen from './PlayerScreen';

import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';

export default class SongListScreen extends Component {
	static contextType = AppContext;

	render() {
		return (
			<View>
				<ScrollView>
					<TrackContext.Consumer>{(trackContext) => {
						return (trackContext.allTrack.map((track, index) => (
							<TouchableOpacity
								onPress={async () => {
									await trackContext.setupQueue(trackContext.allTrack, index);
									await this.context.playerScreenRef.current?.open();
								}}
								key={index.toString()}
							>
								<Text>{track.url}</Text>
							</TouchableOpacity>
						)))
					}}
					</TrackContext.Consumer>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
