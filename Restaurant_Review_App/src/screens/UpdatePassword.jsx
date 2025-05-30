import {View, Text, StatusBar, TextInput, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import Separator from '../components/Separator';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ToggleButton from '../components/ToggleButton';
import axios from 'axios';
import {
  getDataWithExpiration,
  storeDataWithExpiration,
} from '../helpers/asyncStorage';
import Spinner from '../components/Spinner';
import {UserContext} from '../contexts/userContext';
import {BASE_URL} from '../helpers';

export default function UpdatePassword({navigation, route}) {
  const email = route.params ? route.params.email : null;
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const resetInput = () => {
    console.log('Reset');
    setPassword('');
    setConfirmedPassword('');
  };

  const updatePassword = async () => {
    setLoading(true);
    if (password === '' || confirmedPassword === '') {
      setErrorMessage('Please fill all fields');
      return;
    }
    if (password !== confirmedPassword) {
      setErrorMessage('Password and confirmed password must be the same');
      return;
    }
    try {
      const {data} = await axios.put(`${BASE_URL}/updatePassword`, {
        email,
        newPassword: password,
        reNewPassword: confirmedPassword,
      });
      if (data.success) {
        resetInput();
        navigation.navigate('Signin');
      }
    } catch (error) {
      console.log(error.response.data);
      resetInput();
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-DEFAULT_WHITE">
      <StatusBar
        barStyle="light-content"
        className="bg-DEFAULT_GREY"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            resetInput('');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-32 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Update Password
        </Text>
      </View>
      <View className="bg-LIGHT_GREY mt-4 px-2 mx-5 rounded-lg border border-LIGHT_GREY2 justify-center">
        <View className="flex-row items-center">
          <Feather name="lock" size={22} color="#C2C2CB" className="mr-3" />
          <TextInput
            placeholder="New Password"
            secureTextEntry={isPasswordShow ? false : true}
            placeholderTextColor="#C2C2CB"
            selectionColor="#C2C2CB"
            autoCapitalize="none"
            className="text-xl text-DEFAULT_BLACK p-3 flex-1"
            onChangeText={text => {
              setErrorMessage('');
              setPassword(text);
            }}
            value={password}
          />
          <Feather
            name={isPasswordShow ? 'eye' : 'eye-off'}
            size={22}
            color="#C2C2CB"
            className="mr-3"
            onPress={() => setIsPasswordShow(!isPasswordShow)}
          />
        </View>
      </View>

      <View className="bg-LIGHT_GREY mt-5 px-2 mx-5 rounded-lg border border-LIGHT_GREY2 justify-center">
        <View className="flex-row items-center">
          <Feather name="lock" size={22} color="#C2C2CB" className="mr-3" />
          <TextInput
            placeholder="Confirmed Password"
            secureTextEntry={isConfirmPasswordShow ? false : true}
            placeholderTextColor="#C2C2CB"
            selectionColor="#C2C2CB"
            autoCapitalize="none"
            className="text-xl text-DEFAULT_BLACK p-3 flex-1"
            onChangeText={text => {
              setErrorMessage('');
              setConfirmedPassword(text);
            }}
            value={confirmedPassword}
          />
          <Feather
            name={isConfirmPasswordShow ? 'eye' : 'eye-off'}
            size={22}
            color="#C2C2CB"
            className="mr-3"
            onPress={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}
          />
        </View>
      </View>
      <Text className="text-base text-DEFAULT_RED font-POPPINS_MEDIUM text-center pt-4 pb-0">
        {errorMessage != '' && errorMessage}
      </Text>
      <View
        className={`${
          loading ? 'bg-DEFAULT_WHITE' : 'bg-DEFAULT_GREEN'
        } border border-SECONDARY_WHITE rounded-xl mx-5 justify-center items-center`}>
        {loading ? (
          <Spinner width={'100%'} height={50} />
        ) : (
          <TouchableOpacity onPress={updatePassword}>
            <Text className="ml-[5px] py-2 text-lg text-DEFAULT_WHITE font-POPPINS_MEDIUM">
              Update Password
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
