import { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Picker, Switch } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import ICONS from "../assets/ICONS";
import AppContext from "../utils/context/AppContext";
import i18n from "../utils/i18n";

const SettingScreen = () => {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const [language, setLanguage] = useState(i18n.language);

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
                <Text style={styles.headerText}>{i18n.t("Setting")}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style = {styles.settingContainer}>
                <Text style = {styles.settingTitle}>{i18n.t("Language")}</Text>
                <View style = {styles.pickerContainer}>
                <Picker
                    selectedValue={language}
                    style = {styles.languagePicker}
                    onValueChange={(itemValue) => {
                        setLanguage(itemValue);
                        i18n.changeLanguage(itemValue);
			            AsyncStorage.setItem("Language", itemValue);
                        appContext.albertMessage(i18n.t("Change language"));
                    }}
                >
                    <Picker.Item label="English" value="en"/>
                    <Picker.Item label="Tiếng việt" value="vi"/>
                </Picker>
                </View>
            </View>

            <View style = {styles.settingContainer}>
                <Text style = {styles.settingTitle}>{i18n.t("Dark mode")}</Text>
                <Switch
                    trackColor={{ false: "#848484", true: "#8a8a8a" }}
                    thumbColor={appContext.darkMode ? "#7ccbff" : "#bababa"}
                    onValueChange={() => appContext.toggleDarkMode()}
                    value={appContext.darkMode}
                />
            </View>
        </View>
    )
}

export default SettingScreen;

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
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#d9d9d9' : '#151515',
    },
    settingContainer: {
        width: '100%',
        minHeight: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    settingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#d9d9d9' : '#151515',
    },
    pickerContainer: {
        backgroundColor: darkMode ? '#919191' : "#bcbcbc",
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    languagePicker: {
        height: 40,
        width: 150,
    },
});