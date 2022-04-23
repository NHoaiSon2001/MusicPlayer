import { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import AppContext from '../AppContext';

export default class SongListScreen extends Component {
	static contextType = AppContext;

	render() {
		return (
			<ScrollView>
				{this.context.audioFile.map(audio =>
					<Text>{audio.filename}</Text>
				)}
				
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
