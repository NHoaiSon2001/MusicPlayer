import { StyleSheet, Text, View } from 'react-native';

export default function ArtistListScreen() {
  return (
    <View style={styles.container}>
      <Text>ArtistListScreen</Text>
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
