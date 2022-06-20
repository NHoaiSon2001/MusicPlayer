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
import AppContext from '../utils/context/AppContext';

const SearchScreenHeader = ({ searchValue, setSearchValue, placeholder }) => {
    const appContext = useContext(AppContext);

    return (
        <View style = {styles.headerContainer}>
            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.goBack()}
                style = {styles.headerButton}
            >
                <Feather name={ICONS.BACK} size={35}/>
            </TouchableOpacity>

            <View style = {styles.searchContainer}>
                <TextInput
                    style = {styles.searchInput}
                    value={searchValue}
                    autoFocus={true}
                    placeholder = {placeholder}
                    onChangeText={(text) => {
                        setSearchValue(text);
                    }}
                />
                {
                    searchValue.length != 0
                    ? <TouchableOpacity
                        onPress={() => setSearchValue("")}
                        style = {styles.searchDeleteTouchable}
                    >
                        <Ionicons name={ICONS.SEARCH_DELETE} size={25} color = {"#555555"}/>
                    </TouchableOpacity>
                    : null
                }
            </View>
        </View>
    )
}

export default SearchScreenHeader;

const styles = StyleSheet.create({
	headerContainer: {
		height: 60,
        backgroundColor: '#e0e0e0',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
    searchContainer: {
        flexShrink: 1,
        flexGrow: 1,
        flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
        backgroundColor: "#bcbcbc",
        borderRadius: 5,
    },
    searchInput: {
        height: 40,
        flexShrink: 1,
        flexGrow: 1,
        backgroundColor: "#bcbcbc",
        borderRadius: 5,
        marginLeft: 5,
    },
    searchDeleteTouchable: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
