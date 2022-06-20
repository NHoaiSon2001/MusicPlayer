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

    useEffect(() => {
		if (appContext.havingPlayer) {
            floatingPlayerRef.current?.open();
		} else {
			floatingPlayerRef.current?.close();
		}
	}, [appContext.havingPlayer, appContext.firstRender])

    return (
        <Modalize
            ref={floatingPlayerRef}
            modalHeight={PLAYER_HEIGHT + 60}
            withOverlay={false}
            withHandle={false}
            threshold={PLAYER_HEIGHT / 2}
            onBackButtonPress={() => appContext.playerBack()}
            velocity={1000}
            modalStyle={styles.model}
            onClosed={() => {
                if(!appContext.firstRender) appContext.setHavingPlayer(false)
            }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => appContext.playerScreenRef.current?.open('top')}
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