import { useContext, useRef } from "react";
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

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
    const trackContext = useContext(TrackContext);
    const appContext = useContext(AppContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => appContext.createPlaylistModalRef.current?.open()}
                activeOpacity={1}
                style={styles.newPlaylistTouchable}
            >
                <View style={styles.newPlaylistContainer}>
                    <MaterialIcons
                        name={ICONS.NEW_PLAYLIST}
                        size={30}
                        color={'#004c7e'}
                    />
                    <Text style={styles.newPlaylistText}>{i18n.t("New playlist")}</Text>
                    <View style={{ width: 30 }} />
                </View>
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <PlaylistList
                    playlists={trackContext.playlists}
                    navigation={navigation}
                />
                <FloatingPlayerArea />
            </ScrollView>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
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
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    newPlaylistText: {
        color: '#004c7e',
        fontSize: 15,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
})
