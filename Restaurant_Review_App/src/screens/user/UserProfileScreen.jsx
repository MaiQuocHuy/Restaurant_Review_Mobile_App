import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import {StatusBar} from 'react-native';
import {Separator, ToggleButton} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {BASE_URL, removeTokenInStorage} from '../../helpers';
import {useEffect} from 'react';
import {useState} from 'react';
import {Images} from '../../constants';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {UserContext} from '../../contexts/userContext';

export default function UserProfile({navigation}) {
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    // sign out logic here
    try {
      const {data} = await axios.get(`${BASE_URL}/logout`);
      console.log(data);
      if (data.success) {
        await removeTokenInStorage('token');
        navigation.navigate('Signin');
      }
    } catch (error) {
      console.log('Error signout', error);
    }
  };

  const handleVerify = async () => {
    try {
      if (user.verified) return alert('Your account already verified');
      const {data} = await axios.put(`${BASE_URL}/sendVerification`);
      console.log(data);
      navigation.navigate('Verification');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-DEFAULT_WHITE px-4 space-y-3">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#C2C2CB"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex-row items-center pt-4  justify-center">
        <Text className="text-xl font-POPPINS_MEDIUM w-[80%] text-center text-DEFAULT_BLACK">
          Profile
        </Text>
      </View>
      <View className="w-full flex-row gap-3 mb-6">
        <Image
          className="w-16 h-16 rounded-full"
          source={{
            uri:
              user?.image?.url ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
          }}
        />
        <View className="flex-1 gap-1">
          <Text className="text-lg font-POPPINS_MEDIUM text-DEFAULT_BLACK">
            {user?.name}
          </Text>
          <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_GREY">
            {user?.email}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
        <View className="bg-DEFAULT_GREEN justify-center items-center p-2 rounded-lg mb-6">
          <Text className="text-DEFAULT_WHITE font-POPPINS_MEDIUM text-  ">
            Edit Profile
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <Ionicons size={26} color="#0A8791" name="notifications" />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                Notifcations
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PostPersonal')}>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <MaterialCommunityIcons
                size={26}
                color="#0A8791"
                name="post-outline"
              />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                PostPersonal
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVerify}>
          <View className="pl-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <MaterialCommunityIcons
                size={24}
                color={`${user?.verified ? '#0A8791' : '#FF0000'}`}
                name="update"
              />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                Vertification
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmarked')}>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <FontAwesome size={26} color="#0A8791" name="bookmark" />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                BookMarked
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Voucher')}>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <FontAwesome6 size={26} color="#0A8791" name="disease" />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                Voucher
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UpdatePassword', {
              email: user?.email,
            })
          }>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <MaterialCommunityIcons size={26} color="#0A8791" name="update" />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                Update Password
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut}>
          <View className="pl-3 py-2 pr-6 flex-row mb-6">
            <View className="flex-row w-full items-center">
              <MaterialIcons size={20} color="#0A8791" name="logout" />
              <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM px-4">
                Logout
              </Text>
            </View>
            <Ionicons size={28} color="#0E122B" name="chevron-forward" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
          <View className="bg-LIGHT_GREEN flex-row justify-center py-6 px-3 rounded-lg mb-6">
            <FontAwesome5 name="robot" size={22} color="#FBA83C" />
            <Text
              className="pl-2 text-DEFAULT_YELLOW font-POPPINS_SEMI_BOLD "
              style={{fontSize: 20}}>
              How can we help you!
            </Text>
          </View>
        </TouchableOpacity>
        <Separator height={60} />
      </ScrollView>
    </View>
  );
}
