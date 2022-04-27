import { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppContext from '../utils/context/AppContext';
import i18n from '../utils/i18n';

const HEADER_HEIGHT = 60;

function QueueHeader() {
	const context = useContext(AppContext);
	return (
		<View style={styles.queueHeaderComponent}>
			<TouchableOpacity
				onPress={() => context.queueScreenRef.current?.open('top')}
				style = {styles.upNextTouchble}
			>
				<Text style = {styles.upNextText}>{i18n.t("UP NEXT")}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default QueueHeader;

const styles = StyleSheet.create({
	queueHeaderComponent: {
		height: HEADER_HEIGHT,
		width: "100%",
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	queueFooterComponent: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	upNextTouchble: {
		justifyContent:'center',
		alignItems: 'center',
		padding: 10,
	},
	upNextText: {
		fontSize: 15,
	},
});