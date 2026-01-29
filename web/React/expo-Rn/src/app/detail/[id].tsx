import { useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useState } from 'react';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [user, setUser] = useState<any>(null);

  const handleTestReq = async () => {

   const res = await fetch(
      'http://192.168.10.107:3000/api/quilkFilter/integrationInfo'
    );
    const result = await res.json();

    // result.data = { name: 'east' }
    setUser(result.data);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>详情页，ID: {id}</Text>

      <Button title="去请求数据" onPress={handleTestReq} />

      {user && (
        <Text>用户名：{user.name}</Text>
      )}
    </View>
  );
}
