import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ManageRestaurantVoucher from '../../screens/ownres/ManageRestaurantVoucher';
import AddVoucherScreen from '../../screens/ownres/AddVoucherScreen';

const VoucherStack = createNativeStackNavigator();

const VoucherStackScreen = () => {
  return (
    <VoucherStack.Navigator screenOptions={{headerShown: false}}>
      <VoucherStack.Screen name="Vouchers" component={ManageRestaurantVoucher} />
      <VoucherStack.Screen name="AddVoucher" component={AddVoucherScreen} />
    </VoucherStack.Navigator>
  );
};

export default VoucherStackScreen;
