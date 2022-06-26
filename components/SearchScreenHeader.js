import { useContext } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from '../assets/ICONS';
import AppContext from '../utils/context/AppContext';

const SearchScreenHeader = ({ searchValue, setSearchValue, placeholder }) => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

    return (
        <View style = {styles.headerContainer}>
            <TouchableOpacity
                onPress={() => appContext.mainNavigationRef.goBack()}
                style = {styles.headerButton}
            >
                <Feather
					name={ICONS.BACK}
					size={35}
					color={darkMode ? '#d9d9d9' : '#151515'}
				/>
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

const getStyles = (darkMode) => StyleSheet.create({
	headerContainer: {
		height: 60,
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
        backgroundColor: darkMode ? '#8a8a8a' : '#bcbcbc',
        borderRadius: 5,
    },
    searchInput: {
        height: 40,
        flexShrink: 1,
        flexGrow: 1,
        backgroundColor: darkMode ? '#8a8a8a' : '#bcbcbc',
        color: darkMode ? '#e7e7e7' : '#151515',
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
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 30,
    },
});
