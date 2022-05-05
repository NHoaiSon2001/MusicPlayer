import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import TextTicker from "react-native-text-ticker";
import TrackContext from "../utils/context/TrackContext";
import { Component, useContext } from "react";

class MusicInfo extends Component {
	render() {
		return (
			<View style={styles.musicInfoContainer}>
				<View style={styles.coverWrapper}>
					<Image
						source={require('../assets/defaults/cover_default.jpg')}
						style = {styles.coverImage}
					/>
				</View>

				<View style = {styles.musicInfoView}>
					<TrackContext.Consumer>
						{(trackContext) => {
							return (
								<View style = {styles.musicInfoWrapper}>
									<TextTicker
										style={styles.titleText}
										duration={10000}
										marqueeDelay={500}
										animationType={'auto'}
										loop={true}
										bounce={false}
										scroll={false}
									>
										{trackContext.trackData[trackContext.currentTrackIndex].title}
									</TextTicker>
									<TouchableOpacity
										onPress={() => {}}
										style = {{alignSelf: "flex-start"}}
									>
										<Text style = {{fontSize: 15}}>{trackContext.trackData[trackContext.currentTrackIndex].author}</Text>
									</TouchableOpacity>
								</View>
							)
						}}
					</TrackContext.Consumer>

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
	},
	titleText: {
		fontSize: 25,
		fontWeight:'bold',
	},
	favoriteButton: {
		borderRadius: 20,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
	}
});
