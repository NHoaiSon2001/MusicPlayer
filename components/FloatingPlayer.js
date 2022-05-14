import { useRef, useEffect, useContext } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modalize } from "react-native-modalize";
import AppContext from '../utils/context/AppContext';
import FloatingControll from './FloatingControll';
import TrackPlayer from 'react-native-track-player';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const PLAYER_WIDTH = SCREEN_WIDTH - 20;
const PLAYER_HEIGHT = 70;

function FloatingPlayer() {
    const floatingPlayerRef = useRef();
    const appContext = useContext(AppContext);

    useEffect(async () => {
		if (appContext.havingPlayer) {
			setTimeout(() => {
				floatingPlayerRef.current?.open();
			}, 500);
		} else {
			floatingPlayerRef.current?.close();
            await TrackPlayer.stop();
		}
	}, [appContext.havingPlayer])

    return (
        <Modalize
            ref={floatingPlayerRef}
            modalHeight={PLAYER_HEIGHT + 10}
            withOverlay={false}
            withHandle={false}
            threshold={PLAYER_HEIGHT / 2}
            velocity={1000}
            modalStyle={styles.model}
            onClosed={() => appContext.setHavingPlayer(false)}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => appContext.openPlayer(200)}
                style = {styles.touchable}
            >
                <FloatingControll/>
            </TouchableOpacity>
        </Modalize>
    )
}

export default FloatingPlayer;

const styles = StyleSheet.create({
    model: {
        backgroundColor: 'transparent',
        shadowColor:'transparent',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    touchable: {
        height: PLAYER_HEIGHT,
        width: PLAYER_WIDTH,
    },
})