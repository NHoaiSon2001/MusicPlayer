import { Component } from 'react';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import PlayerScreen from './PlayerScreen';

import AppContext from '../utils/context/AppContext';

export default class SongListScreen extends Component {
	static contextType = AppContext;

	render() {
		return (
			<View>
				<TouchableOpacity onPress={() => this.context.openPlayer(200)}>
					<Text>press</Text>
				</TouchableOpacity>
				<ScrollView>
					{this.context.audioFile.map((audio, index) =>
						<Text key={index.toString()}>{audio.title}</Text>
					)}
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
