import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native"
import i18n from "../utils/i18n";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from "../assets/ICONS";
import { useContext } from "react";
import AppContext from "../utils/context/AppContext";
import { useNavigationState } from "@react-navigation/native";
import TrackContext from "../utils/context/TrackContext";

const ScreenHeader = ({ name, icon }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    const inFavoriteScreen = useNavigationState(state => {
        const currentState = state.routes.find(route => route.name === name);
        if(typeof currentState.state != 'object') return false;
        return currentState.state.routes.some(route => route.name === "FavoriteScreen");
    });

    return (
        <View style = {styles.container}>
            <MaterialCommunityIcons
                name={icon}
                size={25}
                color={"#555555"}
                />
            <Text style = {styles.nameText}>{i18n.t(name)}</Text>

            {
                inFavoriteScreen
                    ? <Ionicons
                        name={ICONS.FAVORITE}
                        size={25}
                        color={'#ff8181'}
                        style = {{marginLeft: 2}}
                    />
                    : null
            }

            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.navigate("SearchAllScreen", {
                    favorite: inFavoriteScreen,
                    type: name,
                })}
                activeOpacity={1}
                style = {styles.searchTouchable}
                >
                <View style = {styles.searchTouchableContainer}>
					<Ionicons name={ICONS.SEARCH} size={20} color={"#555555"}/>
                    <Text style = {styles.searchTitle} numberOfLines={1}>{inFavoriteScreen ? i18n.t("Search all favorite") : i18n.t("Search all")}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.navigate("SettingScreen")}
                style = {styles.settingTouchable}
            >
                <Ionicons name={ICONS.SETTING} size={25}/>
            </TouchableOpacity>
        </View>
    )
}
export default ScreenHeader;

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchTouchable: {
        height: 30,
        flexShrink: 1,
        flexGrow: 1,
        marginLeft: 5,
        backgroundColor: '#d0d0d0',
        borderRadius: 10,
        justifyContent: 'center',
    },
    searchTouchableContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 5,
    },
    searchTitle: {
        fontSize: 12,
        flexShrink: 1,
        flexGrow: 1,
    },
    settingTouchable: {
        height: 40,
        width: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})