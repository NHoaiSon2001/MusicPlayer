import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import TrackContext from '../utils/context/TrackContext';

export default function AlbunListScreen() {
  const context = useContext(TrackContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => context.setupPlayer()}>
					<Text>press</Text>
			</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
