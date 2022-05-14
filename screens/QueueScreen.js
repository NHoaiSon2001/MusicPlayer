import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import QueueHeader from '../components/QueueHeader';
import QueueFooter from '../components/QueueFooter';
import AppContext from '../utils/context/AppContext';
import TrackPlayer from 'react-native-track-player';
import TrackContext from '../utils/context/TrackContext';
import FloatingControll from '../components/FloatingControll';

const HEADER_HEIGHT = 60;
const PLAYER_HEIGHT = 70;

const FooterComponent = () => {
	const appContext = useContext(AppContext);

	return (
		<View style = {styles.container}>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => appContext.queueScreenRef.current?.close('alwaysOpen')}
				style = {styles.touchable}
			>
				<FloatingControll/>
			</TouchableOpacity>
		</View>
	)
}

export default function QueueScreen(props) {
	const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	const [queue, setQueue] = useState([]);

	useEffect(async () => {
		if(!trackContext.shuffling) {
			setQueue(await TrackPlayer.getQueue());
		}
	}, [trackContext.shuffling])

	return (
		<Modalize
			ref={appContext.queueScreenRef}
			modalHeight={props.PLAYER_SCREEN_HEIGHT / 1.1}
			threshold={props.PLAYER_SCREEN_HEIGHT / 4}
			handlePosition={'inside'}
			withOverlay={false}
			alwaysOpen={HEADER_HEIGHT}
			tapGestureEnabled={false}
			disableScrollIfPossible={true}
			HeaderComponent={QueueHeader}
			FooterComponent={FooterComponent}
		>
			{queue.map((track, index) =>
				<TouchableOpacity
					onPress={async () => {
						await TrackPlayer.skip(index);
					}}
					key={index.toString()}
				>
					<Text>{track.title}</Text>
				</TouchableOpacity>
			)}
		</Modalize>
	)
}

const styles = StyleSheet.create({
	container: {
		// justifyContent: 'center',
		backgroundColor: '#d0d0d0',
	},
	touchable: {
        height: PLAYER_HEIGHT,
    },
});