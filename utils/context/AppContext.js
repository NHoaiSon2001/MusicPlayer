import { useEffect, createContext, useState, useRef } from "react";
import TrackPlayer from "react-native-track-player";

const AppContext = createContext();

export function AppProvider({ children }) {
	const playerScreenRef = useRef();
	const queueScreenRef = useRef();
	const queueRef = useRef();
	const [havingPlayer, setHavingPlayer] = useState(false);

	const openPlayer = (timeout) => {
		playerScreenRef.current?.open();
		setTimeout(() => {
			playerScreenRef.current?.open('top');
		}, timeout);
	}

	useEffect(async () => {
		if (!havingPlayer) {
            playerScreenRef.current?.close();
            await TrackPlayer.stop();
            await TrackPlayer.reset();
		}
	}, [havingPlayer])

	return (
		<AppContext.Provider value={{
			playerScreenRef: playerScreenRef,
			queueScreenRef: queueScreenRef,
			queueRef: queueRef,
			havingPlayer: havingPlayer,
			openPlayer: openPlayer,
			setHavingPlayer: setHavingPlayer,
		}}>
			{children}
		</AppContext.Provider>
	)
}

export default AppContext;