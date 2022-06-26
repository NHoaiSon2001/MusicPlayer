import { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ICONS from '../assets/ICONS';
import i18n from '../utils/i18n';
import TrackContext from '../utils/context/TrackContext';
import AppContext from '../utils/context/AppContext';

const SearchHistory = ({ setSearchValue }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);

    return (
        <View>
            <View style = {styles.searchHistoryHeader}>
                <Text style ={styles.SearchHistoryText}>{i18n.t("Search history")}</Text>
                <TouchableOpacity
                onPress={() => trackContext.saveHistory()}
                    style = {styles.SearchHistoryDeleteTouchble}
                >
                    <AntDesign
                        name={ICONS.SEARCH_HISTORY_DELETE}
                        size={25}
                        color = {darkMode ? '#dcdcdc' : "#555555"}
                    />
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
                            <Text style = {{color: darkMode ? '#ffffff' : '#151515'}}>{history}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
        </View>
    )
}

export default SearchHistory;

const getStyles = (darkMode) => StyleSheet.create({
    searchHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    SearchHistoryText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#e7e7e7' : '#151515',
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
        backgroundColor: darkMode ? '#8a8a8a' : '#bcbcbc',
        borderRadius: 20,
    },
});
