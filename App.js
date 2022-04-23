import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppProvider } from './AppContext';
import SongListScreen from './screens/SongListScreen';
import ArtistListScreen from './screens/ArtistListScreen';
import AlbunListScreen from './screens/AlbumListScreen';
import PlaylistScreen from './screens/PlaylistScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name='Songs'
            component={SongListScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name='music-note-outline'
                  size={size}
                  color={color}
                />
              )
            }}
          />

          <Tab.Screen
            name='Artists'
            component={ArtistListScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name='account-music-outline'
                  size={size}
                  color={color}
                />
              )
            }}
          />

          <Tab.Screen
            name='Albuns'
            component={AlbunListScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name='album'
                  size={size}
                  color={color}
                />
              )
            }}
          />

          <Tab.Screen
            name='Playlists'
            component={PlaylistScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name='playlist-music-outline'
                  size={size}
                  color={color}
                />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({

});
