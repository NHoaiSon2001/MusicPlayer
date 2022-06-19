import { useContext, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Track from '../components/Track';
import ICONS from '../assets/ICONS';
import i18n from '../utils/i18n';
import TrackFavourite from '../components/TrackFavorite';

const ITEM_HEIGHT = 65;

export default function SelectItemScreen({ route, navigation }) {
	const [selected, setSelected] = useState(route.params.index != null ? 1 : 0);
	const length = route.params.data.length;
	const [indexSelected, setIndexSelected] = useState(route.params.data.map((track, index) => (index == route.params.index) ? true : false));

	return (
		<View style = {styles.container}>
			<View style = {styles.headerContainer}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style = {styles.headerButton}
				>
					<Feather name={ICONS.BACK} size={35}/>
				</TouchableOpacity>

				<Text style = {styles.headerText}>{selected} {i18n.t((selected < 2) ? 'item selected' : 'items selected')}</Text>

				<TouchableOpacity
					onPress={() => {
						if(selected < length) {
							setSelected(length);
							setIndexSelected(indexSelected.map((check) => true));
						} else {
							setSelected(0);
							setIndexSelected(indexSelected.map((check) => false));
						}
					}}
					style = {styles.headerButton}
				>
					<MaterialCommunityIcons
						name={(selected == length) ? ICONS.ITEM_SELECT : ICONS.ITEM_UNSELECT}
						size={35}
						color={(selected == length) ? '#81a7ff' : '#b0b0b0'}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentOffset={{x: 0, y: route.params.index * ITEM_HEIGHT}}
			>
				{route.params.data.map((track, index) => (
					<TouchableHighlight
						onPress={() => {
							setSelected(selected + ((indexSelected[index]) ? -1 : 1));
							setIndexSelected(indexSelected.map((check, checkIndex) => (checkIndex != index) ? check : !check));
						}}
						underlayColor={'#d0d0d0'}
						key={index.toString()}
					>
						<View style = {styles.itemContainer}>
							<Track track={track} index={index}/>

							<View style = {styles.indexWrapper}>
								<Text style = {styles.indexText}>{index + 1}</Text>

								<TrackFavourite
									track={track}
									size={30}
								/>

								<MaterialCommunityIcons
									name={(indexSelected[index]) ? ICONS.ITEM_SELECT : ICONS.ITEM_UNSELECT}
									size={35}
									color={(indexSelected[index]) ? '#81a7ff' : '#b0b0b0'}
								/>
							</View>
						</View>
					</TouchableHighlight>
				))}
			</ScrollView>
        </View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#e0e0e0',
	},
	headerContainer: {
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
	headerButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 30,
	},
	headerText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	itemContainer: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center',
	},
    indexWrapper: {
        marginHorizontal: 8,
        flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
    },
    indexText: {
        fontSize: 15,
        fontWeight:'bold',
    },
});
