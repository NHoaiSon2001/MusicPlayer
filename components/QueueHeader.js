import { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppContext from '../utils/context/AppContext';
import TrackContext from '../utils/context/TrackContext';
import i18n from '../utils/i18n';

const HEADER_HEIGHT = 60;

function QueueHeader() {
	const appContext = useContext(AppContext);
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => appContext.queueScreenRef.current?.open('top')}
				style = {styles.upNextTouchble}
			>
				<Text style = {styles.upNextText}>{i18n.t("UP NEXT")}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default QueueHeader;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f0f0f0',
		height: HEADER_HEIGHT,
		width: "100%",
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	upNextTouchble: {
		justifyContent:'center',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 3,
		borderBottomColor: '#d0d0d0',
	},
	upNextText: {
		fontSize: 15,
	},
});