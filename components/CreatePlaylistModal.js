import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';

const MODAL_HEIGHT = 250;

const CreatePlaylist = () => {
    const appContext = useContext(AppContext);
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
                    onPress={() => appContext.createPlaylistModalRef.current?.close()}
                    style = {styles.actionTouchable}
                >
                    <Text style = {styles.actionTouchableText}>{i18n.t('Cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        appContext.createPlaylistModalRef.current?.close();
                        trackContext.createPlaylist(name, [], true);
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

const CreatePlaylistModal = () => {
    const appContext = useContext(AppContext);

    return (
        <Modalize
            ref={appContext.createPlaylistModalRef}
            modalHeight={MODAL_HEIGHT}
            withHandle={false}
            velocity={100}
            modalStyle={{flex: 1}}
        >
            <CreatePlaylist/>
        </Modalize>
    )
}

export default CreatePlaylistModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e0e0e0',
        flex: 1,
        height:  MODAL_HEIGHT,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
    },
    nameInputTitle: {
        fontSize: 17,
        alignSelf: 'flex-start',
        marginLeft: 40,
        marginBottom: 10,
    },
    nameInput: {
        height: 50,
        width: '90%',
        backgroundColor: "#bcbcbc",
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
        backgroundColor: "#bcbcbc",
        height: 50,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    actionTouchableText: {
        color: '#2e2e2e',
        fontWeight: 'bold',
        fontSize: 18,
    },
})