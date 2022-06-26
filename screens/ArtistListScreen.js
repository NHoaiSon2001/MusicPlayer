import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import ArtistDetailScreen from './ArtistDetailScreen';
import Artist from '../components/Artist';
import FavoriteButton from '../components/FavoriteButton';
import FavoriteArtistScreen from './FavoriteArtistScreen';
import ArtistList from '../components/ArtistList';
import AppContext from '../utils/context/AppContext';

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
  const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);
  const trackContext = useContext(TrackContext);

  return (
    <View style={styles.container}>
      <FavoriteButton/>

			<ScrollView
        showsVerticalScrollIndicator={false}
      >
        <ArtistList
          artists={trackContext.artists}
          navigation={navigation}
        />
        <FloatingPlayerArea/>
      </ScrollView>

      <FloatingPlayer/>
    </View>
  );
}

export default function ArtistListScreen() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name='ArtistListScreen' component={Screen}/>
      <Stack.Screen name='ArtistDetailScreen' component={ArtistDetailScreen}/>
			<Stack.Screen name='FavoriteScreen' component={FavoriteArtistScreen}/>
    </Stack.Navigator>
  );
}

const getStyles = (darkMode) => StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: darkMode ? '#494949' : '#f0f0f0',
  },
});
