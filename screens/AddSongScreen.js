import { useContext, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import TrackPlayer from "react-native-track-player";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ICONS from "../assets/ICONS";
import AddSongList from "../components/AddSongList";
import AppContext from "../utils/context/AppContext";
import TrackContext from "../utils/context/TrackContext";
import i18n from "../utils/i18n";

const AddSongScreen = ({ route, navigation }) => {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);
    const [queue, setQueue] = useState([]);
    const [type, setType] = useState("All");
    const playlistCreateTime = route.params.playlistCreateTime;

    useEffect(async () => {
        if(appContext.havingPlayer) {
            setQueue((await TrackPlayer.getQueue()).sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
        }
    }, [])

    const List = () => {
        switch (type) {
            case "All": return <AddSongList playlistCreateTime={playlistCreateTime} tracks={trackContext.allTrack.list} navigation={navigation} />;
            case "Queue": return <AddSongList playlistCreateTime={playlistCreateTime} tracks={queue} navigation={navigation} />;
            case "Favorites": return <AddSongList playlistCreateTime={playlistCreateTime} tracks={trackContext.favorites} navigation={navigation} />;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => appContext.mainNavigationRef.goBack()}
                    style={styles.backButton}
                >
                    <Feather
                        name={ICONS.BACK}
                        size={35}
                        color={darkMode ? '#d9d9d9' : '#151515'}
                    />
                </TouchableOpacity>
                <Text style={styles.addSongText}>{i18n.t("Add songs")}</Text>
                <View style={{ width: 40 }} />
            </View>

            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.navigate("SearchScreen", {
                    data: trackContext.allTrack,
                    playlistCreateTime: playlistCreateTime
                })}
                activeOpacity={1}
                style={styles.searchTouchable}
            >
                <View style={styles.searchTouchableContainer}>
                    <Ionicons
                        name={ICONS.SEARCH}
                        size={20}
                        color={darkMode ? '#ffffff' : '#626262'}
                    />
                    <Text style={styles.searchTitle} numberOfLines={1}>{i18n.t("Search for songs")}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.typeTouchableContainer}>
                <TouchableOpacity
                    onPress={() => setType("All")}
                    style={styles.typeTouchable}
                >
                    <MaterialCommunityIcons
                        name={ICONS.SONGS}
                        size={30}
                        color={(type === "All") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
                    />
                    {
                        (type !== "All")
                            ? <Text style={styles.tabText}>
                                {i18n.t("All")}
                            </Text>
                            : null
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setType("Queue")}
                    style={styles.typeTouchable}
                >
                    <MaterialCommunityIcons
                        name={ICONS.QUEUE}
                        size={30}
                        color={(type === "Queue") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
                    />
                    {
                        (type !== "Queue")
                            ? <Text style={styles.tabText}>
                                {i18n.t("Queue")}
                            </Text>
                            : null
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setType("Favorites")}
                    style={styles.typeTouchable}
                >
                    <Ionicons
                        name={ICONS.FAVORITE}
                        size={30}
                        color={(type === "Favorites") ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
                    />
                    {
                        (type !== "Favorites")
                            ? <Text style={styles.tabText}>
                                {i18n.t("Favorites")}
                            </Text>
                            : null
                    }
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <List />
            </ScrollView>
        </View>
    )
}

export default AddSongScreen;

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: darkMode ? '#494949' : '#f0f0f0',
    },
    headerContainer: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 30,
    },
    addSongText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#d9d9d9' : '#151515',
    },
    searchTouchable: {
        height: 35,
        width: '90%',
        backgroundColor: darkMode ? '#8a8a8a' : '#d0d0d0',
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: 5,
    },
    searchTouchableContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 5,
    },
    searchTitle: {
        fontSize: 12,
        flexGrow: 1,
        color: darkMode ? '#ffffff' : '#151515',
    },
    typeTouchableContainer: {
        height: 70,
        flexDirection: 'row',
    },
    typeTouchable: {
        height: '100%',
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        color: darkMode ? '#dcdcdc' : "#555555",
    },
});