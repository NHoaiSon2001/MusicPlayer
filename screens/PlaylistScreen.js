import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ICONS from "../assets/ICONS";
import AppContext from "../utils/context/AppContext";
import i18n from "../utils/i18n";
import FloatingPlayer from "../components/FloatingPlayer";
import FloatingPlayerArea from "../components/FloatingPlayerArea";
import PlaylistList from "../components/PlaylistList";
import TrackContext from "../utils/context/TrackContext";
import PlaylistDetailScreen from "./PlaylistDetailScreen";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import NewPlaylistButton from "../components/NewPlaylistButton";

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    return (
        <View style={styles.container}>
            {
                trackContext.playlists.length !== 0
                    ? <NewPlaylistButton
                        touchableStyle={styles.newPlaylistTouchable}
                        tracks={[]}
                        navigateDetail={true}
                    />
                    : null
            }

            {
                trackContext.playlists.length !== 0
                    ? <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <PlaylistList
                            playlists={trackContext.playlists}
                            navigation={navigation}
                        />
                        <FloatingPlayerArea />
                    </ScrollView>
                    : <View style={[styles.container, { flexGrow: 1 }]}>
                        <View style={styles.endIcon} />
                        <NewPlaylistButton
                            touchableStyle={styles.newPlaylistArea}
                            tracks={[]}
                            navigateDetail={true}
                        />
                    </View>
            }

            <FloatingPlayer />
        </View>
    )
}

export default function PlaylistScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='PlaylistListScreen' component={Screen} />
            <Stack.Screen name='PlaylistDetailScreen' component={PlaylistDetailScreen} />
        </Stack.Navigator>
    );
}

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: darkMode ? '#494949' : '#f0f0f0',
    },
    newPlaylistTouchable: {
        backgroundColor: '#cdeaff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 10,
        height: 40,
        borderRadius: 30,
    },
    newPlaylistContainer: {
        backgroundColor: '#cdeaff',
        borderRadius: 30,
        paddingHorizontal: 30,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    newPlaylistText: {
        color: '#004c7e',
        fontSize: 15,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
    newPlaylistArea: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    endIcon: {
        height: 5,
        alignSelf: 'center',
        width: 200,
        backgroundColor: '#ababab',
        borderRadius: 30,
    },
})
