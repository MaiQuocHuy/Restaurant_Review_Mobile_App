import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen, SearchScreen, UserProfileScreen} from '../../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Display} from '../../utils';
import HomeStackScreen from './HomeStackScreen';
import SearchStackScreen from './SearchStackScreen';
import ProfileStackScreen from './ProfileStackScreen';
import PostStackScreen from './PostStackScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

export default function BottomTabs() {
  const BottomTabs = createBottomTabNavigator();
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: Display.setHeight(8),
          backgroundColor: '#fff',
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0A8791',
        tabBarInactiveTintColor: '#A3A3A3',
      }}>
      <BottomTabs.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="home-outline" size={23} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="PostStack"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="post-add" size={23} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="SearchStack"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="search-outline" size={23} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="person-outline" size={23} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}
