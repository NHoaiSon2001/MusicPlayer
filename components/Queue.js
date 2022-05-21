import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import TrackPlayer from 'react-native-track-player';
import Track from './Track';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ICONS from '../assets/ICONS';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const ITEM_HEIGHT = 65;

const Queue = () => {
    const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	const [queue, setQueue] = useState([]);
	const [moving, setMoving] = useState(-1);

    useEffect(async () => {
		if (!trackContext.setupingQueue) {
			setQueue((await TrackPlayer.getQueue()).map((track, index) => ({
                key: `${index}`,
                track: track
            })));
		}
	}, [trackContext.setupingQueue])

    useEffect(async () => {
        setTimeout(() => {
            setMoving(-2)
        }, 1000);
	}, [])

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const renderItem = useCallback((data) => (
        <TouchableHighlight
            onPress={async () => {
                if(moving == -1) {
                    await TrackPlayer.skip(data.index)
                } else {
                    setMoving(-1);
                    trackContext.moveTrack(moving, data.index);
                }
            }}
            style={{backgroundColor: trackContext.currentIndex == data.index ? '#dcdcdc' : '#ffffff'}}
            underlayColor={'#070707'}
            key={data.index.toString()}
        >
            <View style = {styles.rowFront}>
                <Track track={data.item.track}/>
                <View style = {styles.indexWrapper}>
                    {moving > -1
                        ? <MaterialIcons name={ICONS.QUEUE_MOVE_COMPLETE} size = {30}/>
                        : null
                    }
                    <Text style = {styles.indexText}>{data.index + 1}</Text>
                </View>
            </View>
        </TouchableHighlight>
    ), [moving, trackContext.currentIndex]);

    const renderHiddenItem = useCallback((data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.rowBackButton, styles.moveButton]}
                onPress={() => {
                    setMoving(data.index)
                    closeRow(rowMap, data.index);
                }}
            >
                <MaterialIcons name = {ICONS.QUEUE_MOVE} size = {30}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.rowBackButton, styles.deleteButton]}
                onPress={() => {
                    closeRow(rowMap, data.index);
                    trackContext.removeTrack(data.index)
                }}
            >
                <MaterialIcons name = {ICONS.DELETE} size = {30}/>
            </TouchableOpacity>
        </View>
    ), []);

    const keyExtractor = useCallback((data) => data.key, []);

    const getItemLayout = useCallback((data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}), []);

    const TrackMove = () => {
        return (
            <View style = {[styles.rowFront, {backgroundColor: '#7bb6ff'}]}>
                <Track track={queue[moving].track}/>
                <View style = {styles.indexWrapper}>
                    <Text style = {styles.indexText}>Moving {moving + 1}</Text>
                </View>
                <TouchableOpacity
                onPress={() => setMoving(-1)}
                    style = {styles.cancelButton}
                >
                    <MaterialIcons name = {ICONS.QUEUE_MOVE_CANCEL} size = {35}/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {moving > -1
                ? <TrackMove/>
                : null
            }
            {/* <SwipeListView
                listViewRef={appContext.queueRef}
                data={queue}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                renderHiddenItem={renderHiddenItem}
                extraData={moving}
                disableRightSwipe={true}
                rightOpenValue={-140}
                previewRowKey={`${trackContext.currentIndex}`}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                initialNumToRender={20}
                maxToRenderPerBatch={50}
                updateCellsBatchingPeriod={10}
                removeClippedSubviews={true}
                getItemLayout={getItemLayout}
            /> */}
            {queue.map((track, index) => {
                <
            })

            }
        </View>
    );
}

export default Queue;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
    rowFront: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center',
	},
    indexText: {
        fontSize: 15,
        fontWeight:'bold',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#dcdcdc',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
	indexWrapper: {
        marginHorizontal: 10,
        flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
    },
    rowBackButton: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 70,
    },
    moveButton: {
        backgroundColor: '#7bb6ff',
        right: 70,
    },
    deleteButton: {
        backgroundColor: '#ff4f4f',
        right: 0,
    },
    cancelButton: {
        marginRight: 10,
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
