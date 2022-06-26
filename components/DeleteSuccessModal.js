import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';

const DeleteSuccessModal = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);

    return (
        <View style = {styles.container}>
            <Text style = {styles.headerText}>{i18n.t("Delete")}</Text>
            <Text style = {{fontSize: 18}}>{i18n.t("Delete playlist")} {playlist.name}</Text>
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
                        trackContext.deletePlaylist(playlist.createTime);
                    }}
                    style = {[styles.actionTouchable, {backgroundColor: '#ff9696'}]}
                >
                    <Text style = {[styles.actionTouchableText, {color: '#800000'}]}>{i18n.t('Delete')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DeleteSuccessModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:  180,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 20,
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