import { Component, createRef, useContext } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppContext from '../utils/context/AppContext';


function QueueFooter() {
	const context = useContext(AppContext);
	return (
		<View style={styles.queueFooterComponent}>

		</View>
	)
}

export default QueueFooter;

const styles = StyleSheet.create({
	queueFooterComponent: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});