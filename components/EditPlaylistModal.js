import { useContext, useState } from 'react';
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';
import ICONS from '../assets/ICONS';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const EditPlaylistModal = ({ playlist }) => {
    const appContext = useContext(AppContext);
    const trackContext = useContext(TrackContext);
    const [name, setName] = useState(playlist.name);
    const [coverBase64, setCoverBase64] = useState(playlist.coverBase64);

    const getImageInLibrary = () => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 200,
            maxWidth: 200,
        }, res => {
            if(res.didCancel !== true) setCoverBase64("data:image/png;base64," + res.assets[0].base64);
        })
    }

    const getImageFromCamera = () => {
        launchCamera({
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 200,
            maxWidth: 200,
        }, res => {
            if(res.didCancel !== true) setCoverBase64("data:image/png;base64," + res.assets[0].base64);
        })
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.headerText}>{i18n.t("Edit playlist info")}</Text>
            <Text style = {styles.nameInputTitle}>{i18n.t("New playlist name")}</Text>
            <TextInput
                style = {styles.nameInput}
                value={name}
                autoFocus={true}
                onChangeText={(text) => {
                    setName(text);
                }}
            />

                <View style = {styles.coverWrapper}>
                    <Image
                        source={coverBase64 === null
                            ? require('../assets/defaults/cover_default.jpg')
                            : {uri: coverBase64}
                        }
                        style={styles.coverImage}
                    />

                    <TouchableOpacity
                        onPress={getImageInLibrary}
                        activeOpacity={1}
                        style = {styles.browseImage}
                    >
                        <AntDesign
                            name={ICONS.EDIT_IMAGE}
                            size={30}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={getImageFromCamera}
                        activeOpacity={1}
                        style = {[styles.browseImage, {right: 70}]}
                    >
                        <AntDesign
                            name={ICONS.CAMERA}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>

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
                        trackContext.editPlaylist({
                            createTime: playlist.createTime,
                            name: name,
                            type: "Playlist",
                            coverBase64: coverBase64
                        })
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

export default EditPlaylistModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height:  230,
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
    coverWrapper: {
        height: 200,
        width: 200,
        margin: 20,
    },
    coverImage: {
		height: '100%',
		width: '100%',
        borderRadius: 15,
	},
    browseImage: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 50,
        width: 50,
        backgroundColor: "#bcbcbc",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
})