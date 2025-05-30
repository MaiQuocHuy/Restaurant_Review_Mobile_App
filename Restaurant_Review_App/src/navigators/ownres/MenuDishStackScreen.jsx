import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ManageMenuDishScreen} from '../../screens';
import AddDishScreen from '../../screens/ownres/AddDishScreen';

const MenuDishStack = createNativeStackNavigator();

const MenuDishStackScreen = () => {
  return (
    <MenuDishStack.Navigator screenOptions={{headerShown: false}}>
      <MenuDishStack.Screen name="MenuDish" component={ManageMenuDishScreen} />
      <MenuDishStack.Screen name="AddDish" component={AddDishScreen} />
    </MenuDishStack.Navigator>
  );
};

export default MenuDishStackScreen;
