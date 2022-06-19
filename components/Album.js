import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import i18n from '../utils/i18n';
import Feather from 'react-native-vector-icons/Feather';
import ICONS from '../assets/ICONS';

const ITEM_HEIGHT = 65;

const Album = (props) => {
    return (
        <View style = {[styles.itemContainer]}>
            <View style = {styles.coverWrapper}>
                <Image
                    source={require('../assets/defaults/cover_default.jpg')}
                    style = {styles.coverImage}
                />
            </View>

            <View style = {styles.albumInfo}>
                <Text numberOfLines={2} style = {styles.titleText}>{props.album.name}</Text>
                <View style = {{flexDirection: 'row'}}>
                    <Text style = {{flexShrink: 1}} numberOfLines={1}>{props.album.artist}</Text>
                    <Text> • {props.album.list.length} {i18n.t((props.album.list.length < 2) ? "Song": "Songs")}</Text>
                </View>
            </View>

            <Feather name={ICONS.NEXT} size={25} style={{marginHorizontal: 5}}/>
        </View>
    )
}

export default Album;

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
  albumInfo: {
      flexGrow: 1,
      flexShrink: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight:'bold',
  },
});
