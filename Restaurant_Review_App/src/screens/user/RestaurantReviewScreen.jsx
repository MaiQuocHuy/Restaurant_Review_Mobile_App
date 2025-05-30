import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  StyleSheet,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Separator} from '../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheetModel from '../../components/BottomSheetModel';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import Spinner from '../../components/Spinner';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {BASE_URL} from '../../helpers';

const RestaurantReviewScreen = ({
  navigation,
  route: {
    params: {restaurantId},
  },
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {comments, setComments} = useContext(dataUserGlobalContext);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const checkToGetVoucher = () => {
    const now = new Date();
    const eligibleVoucher = vouchers.find(voucher => {
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      return now >= startDate && now <= endDate;
    });

    if (eligibleVoucher) {
      console.log('Current time is within the validity period of a voucher.');
      addVoucherToUser(eligibleVoucher._id);
    }
  };

  const addVoucherToUser = async id => {
    console.log('id', id);
    try {
      const {data} = await axios.put(`${BASE_URL}/vouncher/get/${id}`);
      if (data.success) {
        alert(data.message);
      }
    } catch (error) {
      console.log('Error', error.response.data.message);
    }
  };

  const handleSubmit = async (rating, content) => {
    console.log('Rating, content', rating, content);
    setLoading(true);
    try {
      const {data} = await axios.put(
        `${BASE_URL}/restaurant/comment/${restaurantId}`,
        {
          comment: content,
          rating,
        },
      );
      console.log(data.restaurant.comments);
      if (data.success) {
        setComments(data.restaurant.comments);
        checkToGetVoucher();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    const {data} = await axios.get(
      `${BASE_URL}/vouncher/restaurant/${restaurantId}`,
    );
    if (data.success) {
      console.log('Vouchers', data.data);
      setVouchers(data.data);
    }
  };

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `${BASE_URL}/restaurant/show/${restaurantId}`,
      );
      console.log('Restaurant', data.restaurant.comments);
      if (data.success) {
        setComments(data.restaurant.comments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  function formatDate(dateString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    fetchRestaurant();
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <View classname="bg-SECONDARY_WHITE" style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        className="bg-DEFAULT_GREY"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <TouchableOpacity
        className="absolute z-10 bg-DEFAULT_YELLOW flex items-center justify-center rounded-full w-16 h-16 right-6 top-[720px] shadow-2xl"
        onPress={handleModal}>
        <AntDesign name="plus" color={'#fff'} size={30} />
      </TouchableOpacity>
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-40 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Reviews
        </Text>
      </View>
      {/* Comments */}
      {loading ? (
        <Spinner width={'100%'} height={'80%'} />
      ) : (
        <ScrollView>
          <View style={{flex: 1}}>
            {comments &&
              comments.length > 0 &&
              comments.map((item, index) => (
                <View
                  className="w-full pr-2 pt-4 pb-2 border-b-2 border-b-DEFAULT_GREY"
                  key={index}>
                  <View className="flex-row items-center px-3">
                    <Image
                      source={{
                        uri:
                          item.postedBy.image.url ||
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
                      }}
                      className="h-14 w-14 rounded-full"
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                        {item.postedBy.name}
                      </Text>
                      <Text className="text-DEFAULT_GREY font-POPPINS_REGULAR">
                        {formatDate(item.created)}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Ionicons
                        name="star"
                        size={20}
                        color={`${item.rating >= 1 ? '#FBA83C' : '#C2C2CB'}`}
                      />
                      <Ionicons
                        name="star"
                        size={20}
                        color={`${item.rating >= 2 ? '#FBA83C' : '#C2C2CB'}`}
                      />
                      <Ionicons
                        name="star"
                        size={20}
                        color={`${item.rating >= 3 ? '#FBA83C' : '#C2C2CB'}`}
                      />
                      <Ionicons
                        name="star"
                        size={20}
                        color={`${item.rating >= 4 ? '#FBA83C' : '#C2C2CB'}`}
                      />
                      <Ionicons
                        name="star"
                        size={20}
                        color={`${item.rating >= 5 ? '#FBA83C' : '#C2C2CB'}`}
                      />
                    </View>
                  </View>
                  <View className="py-2 px-3">
                    <Text
                      className="text-base text-DEFAULT_BLACK font-POPPINS_REGULAR"
                      numberOfLines={4}
                      ellipsizeMode="tail">
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}

            <Separator height={70} />
          </View>
        </ScrollView>
      )}

      {modalVisible == true && (
        <BottomSheetModel
          handleModal={handleModal}
          handleSubmit={handleSubmit}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      {/* </View> */}
    </View>
  );
};
export default RestaurantReviewScreen;
