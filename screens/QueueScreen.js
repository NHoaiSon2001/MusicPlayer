import { Component, createRef, useContext } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import QueueHeader from '../components/QueueHeader';
import QueueFooter from '../components/QueueFooter';
import AppContext from '../utils/context/AppContext';

const HEADER_HEIGHT = 60;

export default class QueueScreen extends Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modalize
				ref={this.context.queueScreenRef}
				modalHeight={this.props.PLAYER_SCREEN_HEIGHT / 1.1}
				threshold={this.props.PLAYER_SCREEN_HEIGHT / 4}
				handlePosition={'inside'}
				withOverlay={false}
				alwaysOpen={HEADER_HEIGHT}
				tapGestureEnabled={false}
				disableScrollIfPossible={true}
				HeaderComponent={QueueHeader}
				FooterComponent={QueueFooter}
			>
				{this.context.audioFile.map((audio, index) =>
					<Text key={index.toString()}>{audio.title}</Text>
				)}
			</Modalize>
		)
	}
}

const styles = StyleSheet.create({
	queueFooterComponent: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});