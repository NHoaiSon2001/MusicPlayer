import { useEffect, createContext, useState, useRef } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
	const playerScreenRef = useRef();
	const queueScreenRef = useRef();
	const [havingPlayer, setHavingPlayer] = useState(false);

	const openPlayer = (timeout) => {
		playerScreenRef.current?.open();
		setTimeout(() => {
			playerScreenRef.current?.open('top');
		}, timeout);
	}

	return (
		<AppContext.Provider value={{
			playerScreenRef: playerScreenRef,
			queueScreenRef: queueScreenRef,
			havingPlayer: havingPlayer,
			openPlayer: openPlayer,
			setHavingPlayer: setHavingPlayer,
		}}>
			{children}
		</AppContext.Provider>
	)
}

export default AppContext;