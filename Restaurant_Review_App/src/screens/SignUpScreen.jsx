import {View, Text, TextInput, StatusBar, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Images} from '../constants';
import {Separator} from '../components';
import axios from 'axios';
import {BASE_URL} from '../helpers';

export default function SignUpScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const resetInput = () => {
    setUsername('');
    setPassword('');
    setEmail('');
  };

  const register = async () => {
    const user = {
      username,
      email,
      password,
    };
    try {
      const {data} = await axios.post(`${BASE_URL}/signup`, {
        name: username,
        email,
        password,
      });
      console.log(data);
      if (data.success) {
        resetInput();
        navigation.navigate('Signin');
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-DEFAULT_WHITE">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#C2C2CB"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex-row items-center px-4 py-4">
        <Ionicons
          name="chevron-back-outline"
          size={30}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-xl font-POPPINS_MEDIUM w-[80%] text-center text-DEFAULT_BLACK">
          Sign up
        </Text>
      </View>
      <Text className="mx-5 mt-12 mb-2 text-xl font-POPPINS_MEDIUM text-DEFAULT_BLACK">
        Create Account
      </Text>
      <Text className="mx-5 mt-2 mb-5 text-base font-POPPINS_MEDIUM text-DEFAULT_BLACK">
        Enter your email, choose a username and password
      </Text>
      <View className="bg-LIGHT_GREY px-[10px] mx-[20px] rounded-lg border border-LIGHT_GREY2 justify-center my-[8px]">
        <View className="flex-row items-center">
          <Feather
            name="user"
            size={22}
            color="#C2C2CB"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#C2C2CB"
            selectionColor="#000"
            className="text-lg align-middle text-DEFAULT_BLACK flex-1 h-[6vh]"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
            onEndEditing={({nativeEvent: {text}}) =>
              console.log('username', text)
            }
          />
        </View>
      </View>
      {/* <Text className="text-base text-DEFAULT_RED font-POPPINS_MEDIUM mx-5 my-[8px]">
        Username Error
      </Text> */}
      <View className="bg-LIGHT_GREY px-[10px] mx-[20px] rounded-lg border border-LIGHT_GREY2 justify-center my-[8px]">
        <View className="flex-row items-center">
          <Feather
            name="mail"
            size={22}
            color="#C2C2CB"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#C2C2CB"
            selectionColor="#000"
            className="text-lg align-middle text-DEFAULT_BLACK flex-1 h-[6vh]"
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            onEndEditing={({nativeEvent: {text}}) => console.log('email', text)}
          />
        </View>
      </View>
      {/* <Text className="text-base text-DEFAULT_RED font-POPPINS_MEDIUM mx-5 my-[8px]">
        Email Error
      </Text> */}
      <View className="bg-LIGHT_GREY px-[10px] mx-[20px] rounded-lg border border-LIGHT_GREY2 justify-center my-[8px]">
        <View className="flex-row items-center">
          <Feather
            name="lock"
            size={22}
            color="#C2C2CB"
            style={{marginRight: 10}}
          />
          <TextInput
            secureTextEntry={isPasswordShow ? false : true}
            placeholder="Password"
            placeholderTextColor="#C2C2CB"
            selectionColor="#C2C2CB"
            className="text-lg align-middle text-DEFAULT_BLACK flex-1 h-[6vh]"
            autoCapitalize="none"
            onChangeText={text => setPassword(text)}
          />
          <Feather
            name={isPasswordShow ? 'eye' : 'eye-off'}
            size={22}
            color="#C2C2CB"
            style={{marginRight: 10}}
            onPress={() => setIsPasswordShow(!isPasswordShow)}
          />
        </View>
      </View>
      <Text className="pt-4 pb-0 text-base text-center text-DEFAULT_RED font-POPPINS_MEDIUM">
        {errorMessage != '' && errorMessage}
      </Text>
      {/* <Text className="text-base text-DEFAULT_RED font-POPPINS_MEDIUM mx-5 my-[8px]">
        Email Error
      </Text> */}
      <TouchableOpacity
        className="bg-DEFAULT_GREEN rounded-lg mx-5 h-[6vh] justify-center items-center mt-5"
        onPress={() => register()}>
        <Text className="text-lg text-DEFAULT_WHITE font-POPPINS_MEDIUM">
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
