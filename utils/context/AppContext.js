import { useNavigationContainerRef } from "@react-navigation/native";
import { useEffect, createContext, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from "react-native-track-player";
import i18n from "../i18n";

const AppContext = createContext();

export function AppProvider({ children }) {
	const playerScreenRef = useRef();
	const queueScreenRef = useRef();
	const queueRef = useRef();
    const menuModalRef = useRef();
	const [darkMode, setDarkMode] = useState(false);
	const [messageVisible, setMessageVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [menuModalContent, setMenuModalContent] = useState(null);
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
			let storage = await AsyncStorage.getItem("HavingPlayer");
			if(storage != null) setHavingPlayer(JSON.parse(storage));
			storage = await AsyncStorage.getItem("Language");
			if (storage != null) i18n.changeLanguage(storage);
			setFirstRender(false);
		} else {
			AsyncStorage.setItem("HavingPlayer", JSON.stringify(havingPlayer));
		}
	}, [havingPlayer])

	useEffect(async () => {
		if(firstRender) {
			const storage = await AsyncStorage.getItem("DarkMode");
			if(storage != null) setDarkMode(JSON.parse(storage));
		} else {
			AsyncStorage.setItem("DarkMode", JSON.stringify(darkMode));
		}
	}, [darkMode])

	const playerBack = () => {
		playerScreenRef.current?.close('alwaysOpen');
	}

	const openMenuModal = (content) => {
		setMenuModalContent(content);
		menuModalRef.current.open();
	}

	const albertMessage = (message) => {
		setMessage(message);
		setMessageVisible(true);
		setTimeout(() => {
			setMessageVisible(false);
		}, 100);
	}

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	}

	return (
		<AppContext.Provider value={{
			playerScreenRef: playerScreenRef,
			queueScreenRef: queueScreenRef,
			queueRef: queueRef,
			menuModalRef: menuModalRef,
			mainNavigationRef: mainNavigationRef,
			havingPlayer: havingPlayer,
			firstRender: firstRender,
			menuModalContent: menuModalContent,
			messageVisible: messageVisible,
			message: message,
			darkMode: darkMode,
			setHavingPlayer: setHavingPlayer,
			playerBack: playerBack,
			setFirstRender: setFirstRender,
			openMenuModal: openMenuModal,
			albertMessage: albertMessage,
			toggleDarkMode: toggleDarkMode,
		}}>
			{children}
		</AppContext.Provider>
	)
}

export default AppContext;