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

export default function SignInScreen({navigation}) {
  const [save, setSave] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const resetInput = () => {
    console.log('Reset');
    setEmail('');
    setPassword('');
  };

  const login = async () => {
    setLoading(true);
    try {
      const {data} = await axios.post(`${BASE_URL}/signin`, {
        email,
        password,
      });
      // const {data} = await axios.post('http://10.0.2.2:8080/api/signin', {
      //   email,
      //   password,
      // });
      console.log(data);
      if (data.success) {
        resetInput();
        if (save) {
          storeDataWithExpiration('token', data.user._id);
        }
        setUser(data.user);
        if (data.user.role === 'ownrestaurant') {
          navigation.navigate('Ownres');
        } else {
          navigation.navigate('HomeTabs');
        }
      }
    } catch (error) {
      console.log(error.response.data);
      resetInput();
      navigation.navigate('Signin');
      setErrorMessage(error.response.data.error);
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
      <View className="flex-row items-center py-4 px-4">
        <Text className="text-xl font-POPPINS_MEDIUM w-[100%] text-center text-DEFAULT_BLACK">
          Sign in
        </Text>
      </View>
      <Text className="text-xl font-POPPINS_MEDIUM text-DEFAULT_BLACK  mt-12 mb-2 mx-5">
        Welcome
      </Text>
      <Text className="text-base font-POPPINS_MEDIUM text-DEFAULT_BLACK mt-2 mb-5 mx-5">
        Enter your email and password, and enjoy app
      </Text>
      <View className="bg-LIGHT_GREY px-2 mx-5 rounded-lg border border-LIGHT_GREY2 justify-center">
        <View className="flex-row items-center">
          <Feather name="user" size={22} color="#C2C2CB" className="mr-3" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#C2C2CB"
            selectionColor="#C2C2CB"
            className="text-xl text-DEFAULT_BLACK p-3 flex-1"
            autoCapitalize="none"
            onChangeText={text => {
              setErrorMessage('');
              setEmail(text);
            }}
            value={email}
          />
        </View>
      </View>
      <Separator height={15} />
      <View className="bg-LIGHT_GREY px-2 mx-5 rounded-lg border border-LIGHT_GREY2 justify-center">
        <View className="flex-row items-center">
          <Feather name="lock" size={22} color="#C2C2CB" className="mr-3" />
          <TextInput
            placeholder="Password"
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
      <Text className="text-base text-DEFAULT_RED font-POPPINS_MEDIUM text-center pt-4 pb-0">
        {errorMessage != '' && errorMessage}
      </Text>
      <View className="flex-row items-start justify-between pr-6 pt-4 pl-6">
        <View className="flex-row items-center space-x-1">
          <ToggleButton size={0.5} setSave={setSave} save={save} />
          <Text className="text-sm text-DEFAULT_GREY font-POPPINS_MEDIUM">
            Remember me
          </Text>
        </View>
        <Text
          className="text-sm text-DEFAULT_GREEN font-POPPINS_BOLD"
          onPress={() => navigation.navigate('Forgot')}>
          Forgot Password
        </Text>
      </View>
      <View
        className={`${
          loading ? 'bg-DEFAULT_WHITE' : 'bg-DEFAULT_GREEN'
        } border border-SECONDARY_WHITE rounded-xl mx-5 justify-center items-center mt-5`}>
        {loading ? (
          <Spinner width={'100%'} height={50} />
        ) : (
          <TouchableOpacity onPress={login}>
            <Text className="ml-[5px] py-2 text-lg text-DEFAULT_WHITE font-POPPINS_MEDIUM">
              Sign in
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex space-x-5 justify-center flex-row items-center mt-4">
        <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Don't have an account?
        </Text>

        <Text
          className="text-sm text-DEFAULT_GREEN font-POPPINS_MEDIUM ml-2"
          onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
      </View>
    </View>
  );
}
