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
import SearchHistory from '../components/SearchHistory';
import SearchScreenHeader from '../components/SearchScreenHeader';

export default function SearchScreen({ route, navigation }) {
    const trackContext = useContext(TrackContext);
	const data = route.params.data;
    const [searchValue, setSearchValue] = useState("");
    const [result, setResult] = useState({
        name: "",
        type: "Custom",
        list: []
    });

    useEffect(() => {
        setResult({
            ...result,
            list: data.list.filter(track => (track.title.toLowerCase()).includes(searchValue.toLowerCase()))
        });
    }, [searchValue])

    const NoResult = () => (
        <View style = {styles.noResult}>
            <Ionicons name={ICONS.SEARCH} size={60} color={"#555555"}/>
            <Text style = {{fontSize: 20, fontWeight: 'bold'}}>{i18n.t("No result")} {searchValue}</Text>
        </View>
    )

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
                        ? <ScrollView>
                            <TrackList tracks={result} searchValue={searchValue} navigation={navigation}/>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#e0e0e0',
	},
    noResult: {
        marginTop: 100,
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
});
