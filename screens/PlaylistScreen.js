import { Component, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FloatingPlayer from '../components/FloatingPlayer';

import AppContext from '../utils/context/AppContext';

export default function PlaylistScreen() {
	const appContext = useContext(AppContext);

	return (
		<View style = {styles.container}>
			<TouchableOpacity onPress={() => appContext.openPlayer(200)}>
				<Text>press</Text>
			</TouchableOpacity>

			<FloatingPlayer/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
