import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Styles } from './index.style';
import { Navigation } from '../../navigation/navigation';

const IndexComponent = () => {
  const router = useRouter();

  const handleToDetailPage = () => {
    Navigation.toDetail(1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={Styles.helloText}>Hello World</Text>
        <TouchableOpacity onPress={() => handleToDetailPage()} style={Styles.detailButtom}>
          <Text style={Styles.detailText}>跳转Detail</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default IndexComponent;
