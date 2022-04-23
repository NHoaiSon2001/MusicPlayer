import { StyleSheet, Text, View } from 'react-native';

export default function AlbunListScreen() {
  return (
    <View style={styles.container}>
      <Text>AlbunListScreen</Text>
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
