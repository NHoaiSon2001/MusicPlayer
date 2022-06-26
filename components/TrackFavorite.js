import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import TrackContext from "../utils/context/TrackContext";
import AppContext from "../utils/context/AppContext";
import ICONS from "../assets/ICONS";

const TrackFavorite = React.memo(({ track, size }) => {
    const appContext = useContext(AppContext);
	const trackContext = useContext(TrackContext);
	const darkMode = appContext.darkMode;
    const [favorite, setFavorite] = useState(false);

	useEffect(async () => {
        setFavorite(trackContext.favorites.some(favorite => favorite.id == track.id));
	}, [trackContext.favorites, track])

    const toggleFavorite = async () => {
		setFavorite(!favorite);
		trackContext.toggleFavorite(!favorite, track);
	}

    return (
        <TouchableOpacity
            onPress={() => toggleFavorite()}
            style = {styles.favoriteButton}
        >
            <Ionicons
                name={favorite ? ICONS.FAVORITE : ICONS.NOT_FAVORITE}
                size={size}
                color={favorite ? '#ff8181' : (darkMode ? '#e4e4e4' : '#626262')}
            />
        </TouchableOpacity>
    )
})

export default TrackFavorite;

const styles = StyleSheet.create({
	favoriteButton: {
		borderRadius: 20,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
	}
});