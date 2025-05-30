import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Separator} from '../../components';
import NotificationList from '../../components/NotificationList';
import Spinner from '../../components/Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useEffect} from 'react';
import {BASE_URL} from '../../helpers';
const NotificationScreen = ({navigation}) => {
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [notification, setNotification] = useState([]);

  const fetchNotifications = async () => {
    setLoadingNotification(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/notifications/show`);
      if (data.success) {
        console.log('Data', data);
        setNotification(data.notifications);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotification(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-xl w-full ml-36 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Notifcation
        </Text>
      </View>
      <ScrollView>
        {loadingNotification ? (
          <Spinner width={'100%'} height={'100%'} />
        ) : (
          <NotificationList
            notification={notification}
            navigate={restaurantId =>
              navigation.navigate('Restaurant', {restaurantId})
            }
          />
        )}

        <Separator height={60} />
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
