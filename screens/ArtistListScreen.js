import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FloatingPlayer from '../components/FloatingPlayer';
import i18n from '../utils/i18n';


export default function ArtistListScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>i18n.changeLanguage("en")}>
        <Text>en</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>i18n.changeLanguage("vi")}>
        <Text>vi</Text>
      </TouchableOpacity>

      <FloatingPlayer/>
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
