import { useContext} from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from '../assets/ICONS';
import FloatingPlayerArea from './FloatingPlayerArea';

export default function TrackList({ tracks, searchValue, navigation }) {
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
                onLongPress={() => navigation.navigate("SelectItemScreen", {
                    data: tracks.list,
                    index: index
                })}
                underlayColor={'#d0d0d0'}
                key={index.toString()}
            >
                <View style = {styles.itemWrapper}>
                    <Track track={track} index={index}/>
                    <TouchableOpacity
                        style = {styles.optionButton}
                    >
                        <Ionicons name={ICONS.TRACK_OPTION} size={23}/>
                    </TouchableOpacity>
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
	optionButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5,
	},
});
