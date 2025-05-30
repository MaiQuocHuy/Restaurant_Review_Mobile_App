import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  RestaurantMenuScreen,
  RestaurantReviewScreen,
  RestaurantScreen,
} from '../../screens';
import TestScreen from '../../screens/TestScreen';

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Group>
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="Restaurant" component={RestaurantScreen} />
        <HomeStack.Screen
          name="RestaurantReview"
          component={RestaurantReviewScreen}
        />
        <HomeStack.Screen name="Test" component={TestScreen} />
      </HomeStack.Group>
      <HomeStack.Group screenOptions={{presentation: 'modal'}}>
        <HomeStack.Screen
          name="RestaurantMenu"
          component={RestaurantMenuScreen}
        />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
