import { Component, createRef, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './utils/context/AppContext';
import { TrackProvider } from './utils/context/TrackContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SongListScreen from './screens/SongListScreen';
import ArtistListScreen from './screens/ArtistListScreen';
import AlbunListScreen from './screens/AlbumListScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import PlayerScreen from './screens/PlayerScreen';
import i18n from './utils/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import FloatingPlayer from './components/FloatingPlayer';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const Tab = createBottomTabNavigator();

const renderScene = SceneMap({
  songs: SongListScreen,
  artists: AlbunListScreen,
  albums: AlbunListScreen,
  playlists: PlaylistScreen,
});

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'songs', title: 'Songs' },
    { key: 'artists', title: 'Artists' },
    { key: 'albums', title: 'Albums' },
    { key: 'playlists', title: 'Playlists' },
  ]);

  return (
    <AppProvider>
      <TrackProvider>
        <GestureHandlerRootView style={{width:'100%', height:'100%'}}>
          {/* <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: SCREEN_WIDTH }}
          /> */}

          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen
                name={i18n.t('Songs')}
                component={SongListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='music-note-outline'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Artists')}
                component={ArtistListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='account-music-outline'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Albums')}
                component={AlbunListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='album'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Playlists')}
                component={PlaylistScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
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

          <FloatingPlayer/>
          <PlayerScreen/>
        </GestureHandlerRootView>
      </TrackProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({

});


{/* <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen
                name={i18n.t('')}
                component={SongListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='music-note-outline'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Artists')}
                component={ArtistListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='account-music-outline'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Albums')}
                component={AlbunListScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='album'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />

              <Tab.Screen
                name={i18n.t('Playlists')}
                component={PlaylistScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name='playlist-music-outline'
                      size={size}
                      color={color}
                    />
                  )
                }}
              />
            </Tab.Navigator>
          </NavigationContainer> */}