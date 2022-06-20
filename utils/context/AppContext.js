import { useNavigationContainerRef } from "@react-navigation/native";
import { useEffect, createContext, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from "react-native-track-player";

const AppContext = createContext();

export function AppProvider({ children }) {
	const playerScreenRef = useRef();
	const queueScreenRef = useRef();
	const queueRef = useRef();
    const createPlaylistModalRef = useRef();
	const mainNavigationRef = useNavigationContainerRef();
	const [havingPlayer, setHavingPlayer] = useState(false);
	const [firstRender, setFirstRender] = useState(true);

	useEffect(async () => {
		if (!havingPlayer) {
			playerScreenRef.current?.close('alwaysOpen');
			queueScreenRef.current?.close('alwaysOpen');
			TrackPlayer.stop();
		}
		if(firstRender) {
			const storage = await AsyncStorage.getItem("HavingPlayer");
			if(storage != null) setHavingPlayer(JSON.parse(storage));
			setFirstRender(false);
		} else {
			AsyncStorage.setItem("HavingPlayer", JSON.stringify(havingPlayer));
		}
	}, [havingPlayer])

	const playerBack = () => {
		playerScreenRef.current?.close('alwaysOpen');
	}

	return (
		<AppContext.Provider value={{
			playerScreenRef: playerScreenRef,
			queueScreenRef: queueScreenRef,
			queueRef: queueRef,
			createPlaylistModalRef: createPlaylistModalRef,
			mainNavigationRef: mainNavigationRef,
			havingPlayer: havingPlayer,
			firstRender: firstRender,
			setHavingPlayer: setHavingPlayer,
			playerBack: playerBack,
			setFirstRender: setFirstRender,
		}}>
			{children}
		</AppContext.Provider>
	)
}

export default AppContext;