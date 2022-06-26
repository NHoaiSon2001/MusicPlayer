import { Component, useCallback, useContext, useState } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import FloatingControll from '../components/FloatingControll';
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer from 'react-native-track-player';
import i18n from '../utils/i18n';
import Track from '../components/Track';
import ICONS from '../assets/ICONS';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTrackPlayerEvents, Event } from 'react-native-track-player';
import TrackIcon from '../components/TrackIcon';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

const HEADER_HEIGHT = 60;
const ITEM_HEIGHT = 65;
const PLAYER_HEIGHT = 70;

export default function QueueScreen(props) {
	const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
	const trackContext = useContext(TrackContext);
	const [queue, setQueue] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hidden, setHidden] = useState(-1);
	const [moving, setMoving] = useState(-1);

	useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			setCurrentIndex(await TrackPlayer.getCurrentTrack());
		}
	});

	const getQueue = async () => {
		setQueue(await TrackPlayer.getQueue());
		setCurrentIndex(await TrackPlayer.getCurrentTrack());
	}

	const moveTrack = async (index, newIndex) => {
		if (index == newIndex) return;
		const track = await TrackPlayer.getTrack(index);
		if (currentIndex != index) {
			TrackPlayer.remove(index);
			TrackPlayer.add(track, newIndex);
		} else {
			const moveFrom = (index < newIndex) ? index + 1 : newIndex;
			const moveTo = (index < newIndex) ? newIndex : index - 1;
			const removeIndex = queue
				.map((track, index) => index)
				.filter((index) => index >= moveFrom && index <= moveTo);
			const moveTrack = queue.filter((track, index) => index >= moveFrom && index <= moveTo);
			TrackPlayer.remove(removeIndex);
			TrackPlayer.add(moveTrack, (index < newIndex) ? index : newIndex + 1);
		}
		getQueue();
	}

	const removeTrack = async (index) => {
		trackContext.setQueueInfo({
			name: "",
			type: "Custom",
		})
		if (index != currentIndex) {
			TrackPlayer.remove(index);
			getQueue();
			trackContext.updateQueue();
			return;
		}
		const queueLength = queue.length;
		if (queueLength == 1) {
			appContext.setHavingPlayer(false);
			getQueue();
			trackContext.updateQueue();
			return;
		}
		if (currentIndex == queueLength - 1) {
			TrackPlayer.skipToPrevious();
		} else {
			TrackPlayer.skipToNext();
		}
		TrackPlayer.remove(index);
		getQueue();
		trackContext.updateQueue();
	}

	const QueueHeader = () => (
		<View>
			<View style={styles.headerContainer}>
				<View style = {{width: 40}}/>

				<TouchableOpacity
					onPress={() => {
						appContext.queueScreenRef.current?.open('top');
						appContext.queueRef.current?.scrollTo({ x: 0, y: ITEM_HEIGHT * currentIndex, animated: true });
					}}
					style={styles.upNextTouchble}
				>
					<Text style={styles.upNextText}>{i18n.t("UP NEXT")}</Text>
				</TouchableOpacity>

				{
					trackContext.queueInfo.type === "Custom"
						? <TouchableOpacity
							onPress={async () => {
								const queue = await TrackPlayer.getQueue();
								appContext.openMenuModal(<CreatePlaylistModal tracks={queue} navigateDetail={false} saveFromQueue={true}/>)
							}}
							style={styles.saveQueue}
						>
							<MaterialIcons
								name={ICONS.NEW_PLAYLIST}
								size={25}
								color={darkMode ? '#e5e5e5' : '#626262'}
							/>
						</TouchableOpacity>
						: <View style = {{width: 40}}/>
				}
			</View>
			{
				moving != -1
					? <TrackMove />
					: null
			}
		</View>
	)

	const QueueFooter = () => (
		<View style={styles.footerContainer}>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => appContext.queueScreenRef.current?.close('alwaysOpen')}
				style={{ height: PLAYER_HEIGHT }}
			>
				<FloatingControll />
			</TouchableOpacity>
		</View>
	)

	const TrackMove = () => (
		<View style={[styles.itemContainer, { backgroundColor: darkMode? '#51749f' : '#b0d3ff' }]}>
			<Track track={queue[moving]} />
			<View style={[styles.indexWrapper, { marginRight: 0 }]}>
				<Text style={styles.indexText}>Moving {moving + 1}</Text>
			</View>
			<TouchableOpacity
				onPress={() => setMoving(-1)}
				style={styles.cancelButton}
			>
				<MaterialIcons name={ICONS.QUEUE_MOVE_CANCEL} size={35} />
			</TouchableOpacity>
		</View>
	)

	const HiddenButton = () => (
		<View style={styles.hiddenContainer}>
			<TouchableOpacity
				style={[styles.hiddenButton, styles.moveButton]}
				onPress={() => {
					setMoving(hidden);
					setHidden(-1);
				}}
			>
				<MaterialIcons name={ICONS.QUEUE_MOVE} size={30} />
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.hiddenButton, styles.deleteButton]}
				onPress={() => {
					removeTrack(hidden);
					setHidden(-1);
				}}
			>
				<MaterialIcons name={ICONS.DELETE} size={30} />
			</TouchableOpacity>
		</View>
	)

	return (
		<Modalize
			ref={appContext.queueScreenRef}
			contentRef={appContext.queueRef}
			modalHeight={props.PLAYER_SCREEN_HEIGHT / 1.1}
			threshold={props.PLAYER_SCREEN_HEIGHT / 4}
			handlePosition={'inside'}
			withOverlay={false}
			alwaysOpen={HEADER_HEIGHT}
			scrollViewProps={{ onScroll: () => setHidden(-1), }}
			panGestureComponentEnabled={true}
			onPositionChange={async (position) => {
				if (position != 'top') return;
				getQueue();
				appContext.queueRef.current?.scrollTo({ x: 0, y: ITEM_HEIGHT * (await TrackPlayer.getCurrentTrack()), animated: true });
			}}
			modalStyle={{backgroundColor: darkMode ? '#494949' :'#ffffff'}}
			HeaderComponent={QueueHeader}
			FooterComponent={QueueFooter}
		>
			{
				queue.map((track, index) => (
					<TouchableHighlight
						onPress={() => {
							if (moving == -1) {
								TrackPlayer.skip(index)
							} else {
								setMoving(-1);
								moveTrack(moving, index);
							}
						}}
						onLongPress={() => setHidden(index)}
						style={{ backgroundColor: currentIndex == index 
							? (darkMode ? '#828282' :'#dcdcdc')
							: (darkMode ? '#494949' :'#ffffff')
						}}
						underlayColor={darkMode ? '#828282' : '#d0d0d0'}
						key={index.toString()}
					>
						<View style={styles.itemContainer}>
							<Track track={track} />

							{
								currentIndex === index
									? <TrackIcon trackId={track.id}/>
									: null
							}

							<View style={styles.indexWrapper}>
								{moving != -1
									? <MaterialIcons name={ICONS.QUEUE_MOVE_COMPLETE} size={30} />
									: null
								}
								<Text style={styles.indexText}>{index + 1}</Text>
							</View>
							{
								hidden == index
									? <HiddenButton />
									: null
							}
						</View>
					</TouchableHighlight>
				))
			}
		</Modalize>
	)
}
const getStyles = (darkMode) => StyleSheet.create({
	footerContainer: {
		backgroundColor: darkMode ? '#585858' :'#dcdcdc',
	},
	headerContainer: {
		backgroundColor: darkMode ? '#5d5d5d' : '#f0f0f0',
		width: "100%",
		height: HEADER_HEIGHT,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	upNextTouchble: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
		padding: 10,
		borderBottomWidth: 3,
		borderBottomColor: darkMode ? '#979797' : '#d0d0d0',
	},
	upNextText: {
		fontSize: 15,
        color: darkMode ? '#ffffff' : '#151515',
	},
	itemContainer: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center',
	},
	indexWrapper: {
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	indexText: {
		fontSize: 15,
		fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#151515',
	},
	cancelButton: {
		borderRadius: 30,
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	hiddenContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	hiddenButton: {
		alignItems: 'center',
		justifyContent: 'center',
		height: ITEM_HEIGHT,
		width: ITEM_HEIGHT,
	},
	moveButton: {
		backgroundColor: '#7bb6ff',
	},
	deleteButton: {
		backgroundColor: '#ff4f4f',
	},
	saveQueue: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 30,
	},
});