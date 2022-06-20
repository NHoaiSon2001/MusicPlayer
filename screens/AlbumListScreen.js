import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FloatingPlayer from '../components/FloatingPlayer';
import TrackContext from '../utils/context/TrackContext';
import FloatingPlayerArea from '../components/FloatingPlayerArea';
import AlbumDetailScreen from './AlbumDetailScreen';
import i18n from '../utils/i18n';
import Feather from 'react-native-vector-icons/Feather';
import ICONS from '../assets/ICONS';
import Album from '../components/Album';
import FavoriteButton from '../components/FavoriteButton';
import FavoriteAlbumScreen from './FavoriteAlbumScreen';
import AlbumList from '../components/AlbumList';

const Stack = createStackNavigator();

const ITEM_HEIGHT = 65;

const Screen = ({ navigation }) => {
  const trackContext = useContext(TrackContext);

  return (
    <View style={styles.container}>
      <FavoriteButton/>

			<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle = {{marginHorizontal: 10, marginTop: 5}}
      >
        <AlbumList
          albums={trackContext.albums}
          navigation={navigation}
        />
        <FloatingPlayerArea/>
      </ScrollView>

      <FloatingPlayer/>
    </View>
  );
}

export default function AlbumListScreen() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='AlbunListScreen' component={Screen}/>
      <Stack.Screen name='AlbumDetailScreen' component={AlbumDetailScreen}/>
			<Stack.Screen name='FavoriteScreen' component={FavoriteAlbumScreen}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  coverWrapper: {
      height: 50,
      width: 50,
      marginHorizontal: 10,
  },
  coverImage: {
    height: '100%',
    width: '100%',
      borderRadius: 5,
  },
  albumInfo: {
      flexGrow: 1,
      flexShrink: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight:'bold',
  },
});
