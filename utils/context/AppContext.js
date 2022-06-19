import { useNavigationContainerRef } from "@react-navigation/native";
import { useEffect, createContext, useState, useRef } from "react";
import TrackPlayer from "react-native-track-player";

const AppContext = createContext();

export function AppProvider({ children }) {
	const playerScreenRef = useRef();
	const queueScreenRef = useRef();
	const queueRef = useRef();
	const mainNavigationRef = useNavigationContainerRef();
	const [havingPlayer, setHavingPlayer] = useState(false);

	useEffect(() => {
		if (!havingPlayer) {
            playerScreenRef.current?.close('alwaysOpen');
            queueScreenRef.current?.close('alwaysOpen');
            TrackPlayer.stop();
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
			mainNavigationRef: mainNavigationRef,
			havingPlayer: havingPlayer,
			setHavingPlayer: setHavingPlayer,
			playerBack: playerBack,
		}}>
			{children}
		</AppContext.Provider>
	)
}

export default AppContext;