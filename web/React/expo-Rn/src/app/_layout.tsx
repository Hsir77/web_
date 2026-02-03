import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookStore/index"
        options={{
          title: '书城',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis/index"
        options={{
          title: '大模型分析',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: '我的书架',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting/index"
        options={{
          title: '设置',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
