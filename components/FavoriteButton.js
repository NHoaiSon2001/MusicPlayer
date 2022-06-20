import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import ICONS from "../assets/ICONS";
import AppContext from "../utils/context/AppContext";
import i18n from "../utils/i18n";

const FavoriteButton = () => {
    const appContext = useContext(AppContext);

    return (
        <View style = {styles.container}>
            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.navigate("FavoriteScreen")}
                activeOpacity={1}
                style = {styles.touchable}
            >
                <View style = {styles.buttonContainer}>
                    <Ionicons
                        name={ICONS.FAVORITE}
                        size={30}
                        color={'#ff8181'}
                    />
                    <Text style = {styles.favoriteText}>{i18n.t("Favorites")}</Text>
                    <View style = {{width: 30}}/>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default FavoriteButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    touchable: {
        backgroundColor: '#ffcdcd',
        height: 40,
        width: '100%',
        borderRadius: 30,
    },
    buttonContainer: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteText: {
        color: '#7e0000',
        fontSize: 15,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
})