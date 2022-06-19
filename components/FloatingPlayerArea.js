import { useContext} from 'react';
import { StyleSheet, View, } from 'react-native';
import AppContext from '../utils/context/AppContext';

export default function FloatingPlayerArea() {
	const appContext = useContext(AppContext);

	return (
        <View style = {[styles.floatingPlayerArea, {height: (appContext.havingPlayer) ? 140 : 65}]}>
            <View style = {styles.endIcon}/>
        </View>
	);
}

const styles = StyleSheet.create({
	floatingPlayerArea: {
		alignItems: 'center',
	},
	endIcon: {
		height: 5,
		width: 200,
		backgroundColor: '#ababab',
		borderRadius: 30,
	},
});
