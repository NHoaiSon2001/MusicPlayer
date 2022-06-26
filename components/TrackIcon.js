import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {useTrackPlayerEvents, Event} from 'react-native-track-player';
import TrackContext from "../utils/context/TrackContext";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ICONS from '../assets/ICONS';
import { View } from "react-native";
import AppContext from "../utils/context/AppContext";

const TrackIcon = ({ trackId }) => {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
    const trackContext = useContext(TrackContext);
    const [type, setType] = useState(2);

	useEffect(async () => {
        if(appContext.havingPlayer) {
            if((await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack())).id === trackId) {
                setType(0);
            } else {
                setType(trackContext.queue.some(inQueue => inQueue.id === trackId) ? 1 : 2);
            }
        } else {
            setType(2);
        }
	}, [trackContext.queue, appContext.havingPlayer])

	useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
		if (event.type === Event.PlaybackTrackChanged) {
			if((await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack())).id === trackId) {
                setType(0);
            } else if(type == 0) {
                setType(1);
            }
		}
	});

    const Icon  = () => {
        if(type == 0) {
            return <MaterialIcons
                name={ICONS.NOW_PLAY}
                size={30}
			    color={darkMode ? '#e4e4e4' : '#626262'}
            />
        }
        if(type === 1) {
            return <MaterialCommunityIcons
                name={ICONS.QUEUE}
                size={27}
				color={darkMode ? '#e4e4e4' : '#626262'}
            />
        }
        return null;
    }

    return (
        <View style = {{marginLeft: 5}}>
            <Icon/>
        </View>
    )
}

export default TrackIcon;