import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ICONS from "../assets/ICONS";
import AppContext from "../utils/context/AppContext";
import i18n from "../utils/i18n";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

const NewPlaylistButton = ({ touchableStyle, tracks, navigateDetail }) => {
    const appContext = useContext(AppContext);

    return (
        <TouchableOpacity
            onPress={() => appContext.openMenuModal(<CreatePlaylistModal tracks={tracks} navigateDetail={navigateDetail}/>)}
            activeOpacity={1}
            style={touchableStyle}
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
    )
}

export default NewPlaylistButton;

const styles = StyleSheet.create({
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
})
