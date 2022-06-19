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

const Stack = createStackNavigator();

const Screen = ({ navigation }) => {
  const trackContext = useContext(TrackContext);

  return (
    <View style={styles.container}>
      <FavoriteButton/>

      <ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
