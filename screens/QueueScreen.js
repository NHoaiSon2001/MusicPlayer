import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import QueueHeader from '../components/QueueHeader';
import QueueFooter from '../components/QueueFooter';
import AppContext from '../utils/context/AppContext';
import TrackPlayer from 'react-native-track-player';
import TrackContext from '../utils/context/TrackContext';

const HEADER_HEIGHT = 60;

export default function QueueScreen(props) {
	const context = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	const [queue, setQueue] = useState([]);

	useEffect(async () => {
		if(!trackContext.shuffling) {
			setQueue(await TrackPlayer.getQueue());
		}
	}, [trackContext.shuffling])

	return (
		<Modalize
			ref={context.queueScreenRef}
			modalHeight={props.PLAYER_SCREEN_HEIGHT / 1.1}
			threshold={props.PLAYER_SCREEN_HEIGHT / 4}
			handlePosition={'inside'}
			withOverlay={false}
			alwaysOpen={HEADER_HEIGHT}
			tapGestureEnabled={false}
			disableScrollIfPossible={true}
			HeaderComponent={QueueHeader}
			FooterComponent={QueueFooter}
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
	queueFooterComponent: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});