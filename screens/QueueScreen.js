import { Component, createRef, useContext } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather'
import AppContext from '../AppContext';

const HEADER_HEIGHT = 60;

const QueueHeaderComponent = () => {
	const context = useContext(AppContext);
	return (
		<View style={styles.queueHeaderComponent}>
			<TouchableOpacity
				onPress={() => context.queueScreenRef.current?.open('top')}
				style = {styles.upNextTouchble}
			>
				<Text style = {styles.upNextText}>UP NEXT</Text>
			</TouchableOpacity>
		</View>
	)
}

const QueueFooterComponent = () => {
	const context = useContext(AppContext);
	return (
		<View style={styles.queueFooterComponent}>

		</View>
	)
}

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
				overlayStyle={{backgroundColor:'#001eff'}}
				HeaderComponent={QueueHeaderComponent}
				FooterComponent={QueueFooterComponent}
			>
				{this.context.audioFile.map((audio, index) =>
					<Text key={index.toString()}>{audio.title}</Text>
				)}
			</Modalize>
		)
	}
}

const styles = StyleSheet.create({
	queueHeaderComponent: {
		height: HEADER_HEIGHT,
		width: "100%",
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	queueFooterComponent: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	upNextTouchble: {
		justifyContent:'center',
		alignItems: 'center',
		height: 45,
		width: 100,
	},
	upNextText: {
		fontSize: 15,
	},
});
