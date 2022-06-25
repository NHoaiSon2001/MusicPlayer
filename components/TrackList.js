import { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import TrackIcon from './TrackIcon';
import AppContext from '../utils/context/AppContext';
import { SongMenu } from './MenuModal';

export default function TrackList({ tracks, searchValue, navigation }) {
    const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);

	return (
        tracks.list.map((track, index) => (
            <TouchableHighlight
                onPress={() => {
                    if(searchValue != null && searchValue.length != 0) {
                        trackContext.saveHistory(searchValue);
                    }
                    trackContext.setupQueue(tracks, index, false);
                }}
                onLongPress={() => appContext.openMenuModal(<SongMenu track={track}/>)}
                style = {{paddingRight: 5}}
                underlayColor={'#d0d0d0'}
                key={index.toString()}
            >
                <View style = {styles.itemWrapper}>
                    <Track track={track} index={index}/>
                    <TrackIcon trackId={track.id}/>
                </View>
            </TouchableHighlight>
        ))
	);
}

const styles = StyleSheet.create({
	itemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});
