import { useContext} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import Track from '../components/Track';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ICONS from '../assets/ICONS';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackList from '../components/TrackList';
import i18n from '../utils/i18n';
import TextTicker from "react-native-text-ticker";

export default function DetailScreenHeader({ data, navigation, searchValue }) {
	const trackContext = useContext(TrackContext);

	return (
        <View style = {styles.headerContainer}>
            <View style = {styles.headerNameContainer}>
                <View style = {[styles.headerNameContainer, {flexShrink: 1}]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style = {styles.headerButton}
                    >
                        <Feather name={ICONS.BACK} size={30}/>
                    </TouchableOpacity>

                    <View style = {{flexShrink: 1}}>
                        <TextTicker
                            style={styles.headerNameText}
                            duration={15000}
                            marqueeDelay={500}
                            animationType={'auto'}
                            loop={true}
                            bounce={false}
                            scroll={false}
                        >
                            {data.name}
                        </TextTicker>
                    </View>
                </View>

                <View style = {styles.headerNameContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SearchScreen", {data: data})}
                        style = {styles.headerButton}
                    >
                        <Ionicons name={ICONS.SEARCH} size={25}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("SelectItemScreen", {
                            data: data.list,
                            index: null
                        })}
                        style = {styles.headerButton}
                    >
                        <Ionicons name={ICONS.SELECT_ITEM} size={30}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {styles.controllContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if(searchValue != null && searchValue.length != 0) {
                            trackContext.saveHistory(searchValue);
                        }
                        trackContext.setupQueue(data, 0, false)
                    }}
                    activeOpacity={1}
                    style = {styles.playButtonTouable}
                >
                    <View style = {styles.playButtonContainer}>
                        <Ionicons name={ICONS.PLAY} size={30} color={'#626262'}/>
                        <Text style = {styles.playButtonText} numberOfLines={1}>{i18n.t("Play")}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if(searchValue != null && searchValue.length != 0) {
                            trackContext.saveHistory(searchValue);
                        }
                        trackContext.setupQueue(data, 0, true)
                    }}
                    activeOpacity={1}
                    style = {styles.playButtonTouable}
                >
                    <View style = {styles.playButtonContainer}>
                        <Ionicons name={ICONS.SHUFFLE} size={30} color={'#626262'}/>
                        <Text style = {styles.playButtonText} numberOfLines={1}>{i18n.t("Shuffle")}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		padding: 5,
	},
	headerNameContainer: {
		height: 40,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerNameText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	controllContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	playButtonTouable: {
		height: 40,
		minWidth: "45%",
		alignSelf: 'flex-start',
		flexShrink: 1,
		marginHorizontal: 10,
	},
	playButtonContainer: {
		height: '100%',
		backgroundColor: '#d0d0d0',
		borderRadius: 30,
		flexDirection: 'row',
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	playButtonText: {
		marginHorizontal: 5,
		fontSize: 15,
		fontWeight: 'bold',
	},
	headerButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 30,
	},
});
