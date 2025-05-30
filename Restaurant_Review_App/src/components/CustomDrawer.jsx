import React, {useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {removeTokenInStorage} from '../helpers/asyncStorage';
import {UserContext} from '../contexts/userContext';
import {BASE_URL} from '../helpers';

const CustomDrawer = props => {
  const navigation = useNavigation();
  const {user, setUser} = useContext(UserContext);
  const handleSignOut = async () => {
    try {
      const {data} = await axios.get(`${BASE_URL}/logout`);
      console.log(data);
      removeTokenInStorage('token');
      if (data.success) {
        navigation.navigate('Signin');
      }
    } catch (error) {
      console.log('Error signout', error);
    }
  };

  return (
    <View style={{flex: 1, borderTopColor: '#fff'}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#0A8791'}}>
        <ImageBackground style={{padding: 20, backgroundColor: '#0A8791'}}>
          <Image
            source={{
              uri:
                user?.image?.url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
            }}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Poppins-Medium',
              marginBottom: 5,
            }}>
            {user?.name}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={handleSignOut} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Poppins-SemiBold',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
