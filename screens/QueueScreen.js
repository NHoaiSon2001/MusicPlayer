import { Component, createRef, useContext, useEffect, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import QueueHeader from '../components/QueueHeader';
import AppContext from '../utils/context/AppContext';
import TrackPlayer from 'react-native-track-player';
import TrackContext from '../utils/context/TrackContext';
import FloatingControll from '../components/FloatingControll';
import QueueTrack from '../components/QueueTrack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const HEADER_HEIGHT = 60;
const PLAYER_HEIGHT = 70;

const FooterComponent = () => {
	const appContext = useContext(AppContext);

	return (
		<View style={styles.footerContainer}>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => appContext.queueScreenRef.current?.close('alwaysOpen')}
				style={{height: PLAYER_HEIGHT}}
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
	const [moving, setMoving] = useState(-1);

	useEffect(async () => {
		if (!trackContext.setupingQueue) {
			setQueue(await TrackPlayer.getQueue());
		}
	}, [trackContext.setupingQueue])

	return (
		<Modalize
			ref={appContext.queueScreenRef}
			modalHeight={props.PLAYER_SCREEN_HEIGHT / 1.1}
			threshold={props.PLAYER_SCREEN_HEIGHT / 4}
			handlePosition={'inside'}
			withOverlay={false}
			alwaysOpen={HEADER_HEIGHT}
			tapGestureEnabled={false}
			panGestureComponentEnabled={true}
			HeaderComponent={QueueHeader}
			FooterComponent={FooterComponent}
		>
			{queue.map((track, index) =>
				<TouchableHighlight
					onPress={async () => await TrackPlayer.skip(index)}
					style={{backgroundColor: trackContext.currentTrack.url == track.url ? '#dcdcdc' : '#ffffff'}}
					underlayColor={'#dcdcdc'}
					key={index.toString()}
				>
					<View style = {styles.container}>
						<QueueTrack track={track} index={index}/>
						<TouchableOpacity
							style={styles.moveButton}
							onLongPress={() => setMoving(index)}
							onPress={() => {
								setMoving(-1)
								trackContext.moveTrack(moving, index);
							}}
						>
							{moving != -1
								? <MaterialIcons name={'file-download-done'} size = {30}/>
								: <Text style = {styles.indexText}>{index + 1}</Text>
							}
						</TouchableOpacity>
					</View>
				</TouchableHighlight>
			)}
		</Modalize>
	)
}

const styles = StyleSheet.create({
	footerContainer: {
		backgroundColor: '#d0d0d0',
	},
	container: {
		borderBottomWidth: 1,
		borderBottomColor: '#dcdcdc',
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center',
	},
	moveButton: {
		minWidth: 41,
        height: 50,
        marginRight: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
    },
    indexText: {
        fontSize: 15,
        fontWeight:'bold',
    }
});