import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './App.style'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>学习Rn</Text>
      {/* 用于控制手机顶部状态栏 */}
      <StatusBar style="auto" />
    </View>
  );
}
