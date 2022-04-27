import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'

function MusicInfo() {
	return (
		<View style={styles.musicInfoContainer}>
			<View style={styles.coverWrapper}>
				<Image
					source={require('../assets/defaults/cover_default.jpg')}
					style = {styles.coverImage}
				/>
			</View>

			<View style = {styles.musicInfoView}>
				<View style = {styles.musicInfoWrapper}>
					<Text numberOfLines={1} style = {styles.titleText}>Music Title Music Title Music Title</Text>
					<TouchableOpacity
						onPress={() => {}}
					>
						<Text style = {{fontSize: 15}}>Music Artists</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={() =>{}}
					style = {styles.favoriteButton}
				>
					<AntDesign name="heart" size={25} color={'#626262'}/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default MusicInfo;

const styles = StyleSheet.create({
	musicInfoContainer: {
		borderColor: "#ffffff",
		flex: 0.6,
		alignItems: 'center',
	},
	coverWrapper: {
		height: 350,
		width: 350,
		padding: 16,
		borderColor: "#ffffff",
		shadowColor: '#000000',
		elevation: 50
	},
	coverImage: {
		height: '100%',
		width: '100%',
		borderRadius: 30,
	},
	musicInfoView: {
		width: '85%',
		top: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	musicInfoWrapper: {
		justifyContent: 'space-between',
		width: '85%',
		flexShrink: 1,
	},
	titleText: {
		fontSize: 25,
		fontWeight:'bold',
		flexShrink: 1,
	},
	favoriteButton: {
		borderRadius: 20,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
	}
});
