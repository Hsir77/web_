import React from 'react';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)/index" options={{ title: '首页' }} />
      <Stack.Screen name="detail/[id]" options={{ title: '详情页' }} />
    </Stack>
  );
}
