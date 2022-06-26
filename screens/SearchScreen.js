import { useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ICONS from '../assets/ICONS';
import i18n from '../utils/i18n';
import TrackList from '../components/TrackList';
import TrackContext from '../utils/context/TrackContext';
import SearchHistory from '../components/SearchHistory';
import SearchScreenHeader from '../components/SearchScreenHeader';
import AddSongList from '../components/AddSongList';
import AppContext from '../utils/context/AppContext';

export default function SearchScreen({ route, navigation }) {
    const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
    const trackContext = useContext(TrackContext);
	const data = route.params.data;
    const playlistCreateTime = route.params.playlistCreateTime;
    const [searchValue, setSearchValue] = useState("");
    const [result, setResult] = useState({
        name: "",
        type: "Custom",
        list: []
    });

    useEffect(() => {
        console.log(playlistCreateTime);
        setResult({
            ...result,
            list: data.list.filter(track => (track.title.toLowerCase()).includes(searchValue.toLowerCase()))
        });
    }, [searchValue])

    const NoResult = () => (
        <View style = {styles.noResult}>
            <Ionicons
                name={ICONS.SEARCH}
                size={60}
                color={darkMode ? '#d9d9d9' : '#151515'}
            />
            <Text style = {styles.noResultText}>{i18n.t("No result")} {searchValue}</Text>
        </View>
    )

    const Result = () => {
        if(playlistCreateTime === undefined) {
            return <TrackList tracks={result} searchValue={searchValue} navigation={navigation}/>
        } else {
            return <AddSongList playlistCreateTime={playlistCreateTime} tracks={result.list} navigation={navigation}/>
        }
    }

	return (
		<View style = {styles.container}>
            <SearchScreenHeader
                placeholder={i18n.t("Search songs from") + " " + i18n.t(data.type).toLowerCase() + " " + data.name}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            {
                searchValue.length != 0
                ? (
                    result.list.length != 0
                        ? <ScrollView showsVerticalScrollIndicator={false}>
                            <Result/>
                        </ScrollView>
                        : <NoResult/>
                )
                : (
                    trackContext.searchHistory.length != 0
                        ? <SearchHistory setSearchValue={setSearchValue}/>
                        : null
                )
            }
        </View>
	)
}

const getStyles = (darkMode) => StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: darkMode ? '#494949' : '#f0f0f0',
	},
    noResult: {
        marginTop: 100,
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: darkMode ? '#d9d9d9' : '#151515',
    }
});
