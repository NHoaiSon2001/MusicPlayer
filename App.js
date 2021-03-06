import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import AppContext, { AppProvider } from './utils/context/AppContext';
import { TrackProvider } from './utils/context/TrackContext';
import SelectItemScreen from './screens/SelectItemScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SongListScreen from './screens/SongListScreen';
import ArtistListScreen from './screens/ArtistListScreen';
import AlbumListScreen from './screens/AlbumListScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import PlayerScreen from './screens/PlayerScreen';
import SearchScreen from './screens/SearchScreen';
import SearchAllScreen from './screens/SearchAllScreen';
import i18n from './utils/i18n';
import ICONS from './assets/ICONS';
import ScreenHeader from './components/ScreenHeader';
import AddSongScreen from './screens/AddSongScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MenuModal from './components/MenuModal';
import Message from './components/Message';
import SettingScreen from './screens/SettingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const appContext = useContext(AppContext);
	const darkMode = appContext.darkMode;
	const styles = getStyles(darkMode);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name='Songs'
        component={SongListScreen}
        options={{
          tabBarIcon: ({ focused  }) => (
            <View style = {styles.tabBarIcon}>
              <MaterialCommunityIcons
                name={ICONS.SONGS}
                size={25}
                color={focused ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
              />
              {
                focused
                  ? null
                  : <Text style = {{color: (darkMode ? '#dcdcdc' : "#555555"), fontSize: 10}}>{i18n.t('Songs')}</Text>
              }
            </View>
          ),
          header: () => <ScreenHeader name={'Songs'} icon={ICONS.SONGS}/>
        }}
      />

      <Tab.Screen
        name='Artists'
        component={ArtistListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style = {styles.tabBarIcon}>
              <MaterialCommunityIcons
                name={ICONS.ARTISTS}
                size={25}
                color={focused ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
              />
              {
                focused
                  ? null
                  : <Text style = {{color: (darkMode ? '#dcdcdc' : "#555555"), fontSize: 10}}>{i18n.t('Artists')}</Text>
              }
            </View>
          ),
          header: () => <ScreenHeader name={'Artists'} icon={ICONS.ARTISTS}/>
        }}
      />

      <Tab.Screen
        name='Albums'
        component={AlbumListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style = {styles.tabBarIcon}>
              <MaterialCommunityIcons
                name={ICONS.ALBUMS}
                size={25}
                color={focused ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
              />
              {
                focused
                  ? null
                  : <Text style = {{color: (darkMode ? '#dcdcdc' : "#555555"), fontSize: 10}}>{i18n.t('Albums')}</Text>
              }
            </View>
          ),
          header: () => <ScreenHeader name={'Albums'} icon={ICONS.ALBUMS}/>
        }}
      />

      <Tab.Screen
        name='Playlists'
        component={PlaylistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style = {styles.tabBarIcon}>
              <MaterialCommunityIcons
                name={ICONS.PLAYLISTS}
                size={25}
                color={focused ? '#81a7ff' : (darkMode ? '#dcdcdc' : "#555555")}
              />
              {
                focused
                  ? null
                  : <Text style = {{color: (darkMode ? '#dcdcdc' : "#555555"), fontSize: 10}}>{i18n.t('Playlists')}</Text>
              }
            </View>
          ),
          header: () => <ScreenHeader name={'Playlists'} icon={ICONS.PLAYLISTS}/>
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <AppProvider>
      <TrackProvider>
        <GestureHandlerRootView style={{width:'100%', height:'100%'}}>
          <AppContext.Consumer>
            {appContext=>(
              <NavigationContainer ref={appContext.mainNavigationRef}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  <Stack.Screen name='MainNavigator' component={MainNavigator}/>
                  <Stack.Screen name='SelectItemScreen' component={SelectItemScreen}/>
                  <Stack.Screen name='SearchScreen' component={SearchScreen}/>
                  <Stack.Screen name='SearchAllScreen' component={SearchAllScreen}/>
                  <Stack.Screen name='AddSongScreen' component={AddSongScreen}/>
                  <Stack.Screen name='SettingScreen' component={SettingScreen}/>
                </Stack.Navigator>
              </NavigationContainer>
            )}
          </AppContext.Consumer>

          <PlayerScreen/>
          <MenuModal/>
          <Message/>
        </GestureHandlerRootView>
      </TrackProvider>
    </AppProvider>
  );
}

const getStyles = (darkMode) => StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: darkMode ? '#585858' :'#dcdcdc',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  tabBarIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});