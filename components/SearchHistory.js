import { useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Track from '../components/Track';
import ICONS from '../assets/ICONS';
import i18n from '../utils/i18n';
import TrackList from '../components/TrackList';
import TrackContext from '../utils/context/TrackContext';

const SearchHistory = ({ setSearchValue }) => {
    const trackContext = useContext(TrackContext);

    return (
        <View>
            <View style = {styles.searchHistoryHeader}>
                <Text style ={styles.SearchHistoryText}>{i18n.t("Search history")}</Text>
                <TouchableOpacity
                onPress={() => trackContext.saveHistory()}
                    style = {styles.SearchHistoryDeleteTouchble}
                >
                    <AntDesign name={ICONS.SEARCH_HISTORY_DELETE} size={25} color = {"#555555"}/>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
            {
                trackContext.searchHistory.map((history, index) => (
                    <TouchableOpacity
                        onPress={() => setSearchValue(history)}
                        key={index.toString()}
                    >
                        <View style = {styles.historyItem}>
                            <Text>{history}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
        </View>
    )
}

export default SearchHistory;

const styles = StyleSheet.create({
    searchHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    SearchHistoryText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    SearchHistoryDeleteTouchble: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    historyItem:  {
        height: 30,
        minWidth: 50,
        marginTop: 10,
        margin: 5,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#bcbcbc",
        borderRadius: 20,
    },
});
