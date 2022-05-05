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
				<TouchableOpacity onPress={() => this.context.playerScreenRef.current?.open()}>
					<Text>press</Text>
				</TouchableOpacity>
				<ScrollView>
					<TrackContext.Consumer>{(trackContext) => {
						return (trackContext.trackData.map((audio, index) =>
							<Text key={index.toString()}>{audio.author}</Text>
						))
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
