import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import i18n from '../utils/i18n';

const ITEM_HEIGHT = 65;

const Artist = (props) => {
    return (
        <View style = {[styles.itemContainer]}>
            <View style = {styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style = {styles.coverImage}
                />
            </View>

            <View style = {styles.artistInfo}>
                <Text numberOfLines={2} style = {styles.nameText}>{props.artist.name}</Text>
                <Text>{props.artist.list.length} {i18n.t((props.artist.list.length < 2) ? "Song": "Songs")}</Text>
            </View>
        </View>
    )
}

export default Artist;

const styles = StyleSheet.create({
    itemContainer: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
    },
    coverWrapper: {
        height: 50,
        width: 50,
        marginHorizontal: 10,
    },
    coverImage: {
      height: '100%',
      width: '100%',
        borderRadius: 5,
    },
    artistInfo: {
        flexGrow: 1,
        flexShrink: 1,
    },
    nameText: {
      fontSize: 15,
      fontWeight:'bold',
    },
})