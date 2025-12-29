import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>详情页，ID: {id}</Text>
    </View>
  );
}