import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';

const CreatePlaylistModal = ({ tracks, navigateDetail, saveFromQueue }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);
    const [name, setName] = useState("")

    return (
        <View style = {styles.container}>
            <Text style = {styles.headerText}>{i18n.t("Create new playlist")}</Text>
            <Text style = {styles.nameInputTitle}>{i18n.t("Playlist name")}</Text>
            <TextInput
                style = {styles.nameInput}
                value={name}
                autoFocus={true}
                onChangeText={(text) => {
                    setName(text);
                }}
            />
            <View style = {styles.actionTouchableContainer}>
                <TouchableOpacity
                    onPress={() => appContext.menuModalRef.current?.close()}
                    style = {styles.actionTouchable}
                >
                    <Text style = {styles.actionTouchableText}>{i18n.t('Cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        appContext.menuModalRef.current?.close();
                        trackContext.createPlaylist(name, tracks, navigateDetail, saveFromQueue);
                    }}
                    style = {[styles.actionTouchable, {backgroundColor: (name.length != 0) ? '#cdeaff' : "#bcbcbc" ,}]}
                    disabled={name.length == 0}
                >
                    <Text style = {[styles.actionTouchableText, {color: (name.length != 0) ? '#004c7e' : '#2e2e2e',}]}>{i18n.t('Done')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreatePlaylistModal;

const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
        height:  230,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
    nameInputTitle: {
        fontSize: 17,
        alignSelf: 'flex-start',
        marginLeft: 40,
        marginBottom: 10,
        color: darkMode ? '#e3e3e3' : '#1e1e1e',
    },
    nameInput: {
        height: 50,
        width: '90%',
        backgroundColor: darkMode ? '#8a8a8a' : '#bcbcbc',
        color: darkMode ? '#e7e7e7' : '#151515',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 17,
    },
    actionTouchableContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20,
    },
    actionTouchable: {
        backgroundColor: darkMode ? '#8a8a8a' : '#d0d0d0',
        height: 50,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    actionTouchableText: {
        color: darkMode ? '#ffffff' : '#151515',
        fontWeight: 'bold',
        fontSize: 18,
    },
})