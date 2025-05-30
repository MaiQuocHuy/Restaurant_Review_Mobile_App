import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import {Separator} from '../../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import ProgressBar from 'react-native-progress/Bar';
import {dataOwnresGlobalContext} from '../../contexts/dataOwnresGlobalContext';
import {UserContext} from '../../contexts/userContext';
import {BASE_URL} from '../../helpers';

const OverviewRestaurant = () => {
  const {restaurant, setRestaurant} = useContext(dataOwnresGlobalContext);
  const [rating, setRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/admin/restaurant/show`);
      if (data.success) {
        console.log('Restaurant', data.restaurant);
        setRestaurant(data.restaurant);
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

  const getAvarageRating = async () => {
    try {
      const {data} = await axios.get(`${BASE_URL}/restaurant/rating/avg`);
      if (data.success) {
        setRating(data.averageRating);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ownrestaurant') {
      fetchRestaurant();
      getAvarageRating();
    }
  }, [user]);

  useEffect(() => {
    if (restaurant && restaurant.comments.length > 0) {
      const newRatingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

      for (const review of restaurant.comments) {
        const rating = review.rating;
        newRatingCounts[rating] += 1;
      }
      setRatingCounts(newRatingCounts);
    }
  }, [restaurant, restaurant?.comments]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="justify-center items-center py-5">
        <Text className="text-xl font-POPPINS_SEMI_BOLD text-DEFAULT_BLACK">
          Overview
        </Text>
      </View>
      <View className="w-full px-5">
        <View className="flex-row justify-between  pb-2">
          <View className="gap-1">
            <Text className="text-base text-DEFAULT_BLACK font-POPPINS_MEDIUM">
              Overall rating
            </Text>
            <Text className="text-2xl font-POPPINS_SEMI_BOLD">
              {rating.toFixed(1)}
            </Text>
            <View className="flex-row">
              <Ionicons
                name="star"
                size={16}
                color={`${
                  parseFloat(rating.toFixed(1)) >= 1 ? '#FBA83C' : '#C2C2CB'
                }`}
              />
              <Ionicons
                name="star"
                size={16}
                color={`${
                  parseFloat(rating.toFixed(1)) >= 2 ? '#FBA83C' : '#C2C2CB'
                }`}
              />
              <Ionicons
                name="star"
                size={16}
                color={`${
                  parseFloat(rating.toFixed(1)) >= 3 ? '#FBA83C' : '#C2C2CB'
                }`}
              />
              <Ionicons
                name="star"
                size={16}
                color={`${
                  parseFloat(rating.toFixed(1)) >= 4 ? '#FBA83C' : '#C2C2CB'
                }`}
              />
              <Ionicons
                name="star"
                size={16}
                color={`${
                  parseFloat(rating.toFixed(1)) >= 5 ? '#FBA83C' : '#C2C2CB'
                }`}
              />
            </View>
          </View>
          <View className="flex">
            <View className="flex-row space-x-2 items-center">
              <Text className="text-sm font-POPPINS_REGULAR">5</Text>
              <ProgressBar
                progress={
                  parseFloat(
                    (
                      (ratingCounts[5] || 0) /
                      (restaurant?.comments?.length || 1)
                    ).toFixed(1),
                  ) || 0
                }
                width={192}
                color="#FBA83C"
              />
            </View>
            <View className="flex-row space-x-2 items-center">
              <Text className="text-sm font-POPPINS_REGULAR">4</Text>
              <ProgressBar
                progress={
                  parseFloat(
                    (
                      (ratingCounts[4] || 0) /
                      (restaurant?.comments?.length || 1)
                    ).toFixed(1),
                  ) || 0
                }
                width={192}
                color="#FBA83C"
              />
            </View>
            <View className="flex-row space-x-2 items-center">
              <Text className="text-sm font-POPPINS_REGULAR">3</Text>
              <ProgressBar
                progress={
                  parseFloat(
                    (
                      (ratingCounts[3] || 0) /
                      (restaurant?.comments?.length || 1)
                    ).toFixed(1),
                  ) || 0
                }
                width={192}
                color="#FBA83C"
              />
            </View>
            <View className="flex-row space-x-2 items-center">
              <Text className="text-sm font-POPPINS_REGULAR">2</Text>
              <ProgressBar
                progress={
                  parseFloat(
                    (
                      (ratingCounts[2] || 0) /
                      (restaurant?.comments?.length || 1)
                    ).toFixed(1),
                  ) || 0
                }
                width={192}
                color="#FBA83C"
              />
            </View>
            <View className="flex-row space-x-2 items-center">
              <Text className="text-sm font-POPPINS_REGULAR pr-[3px]">1</Text>
              <ProgressBar
                progress={
                  parseFloat(
                    (
                      (ratingCounts[1] || 0) /
                      (restaurant?.comments?.length || 1)
                    ).toFixed(1),
                  ) || 0
                }
                width={192}
                color="#FBA83C"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="px-5 flex-row items-center justify-between">
        <Text className="py-4 text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Show recent reviews
        </Text>
      </View>
      <ScrollView>
        {restaurant &&
          restaurant.comments.length > 0 &&
          restaurant.comments.map((item, index) => {
            console.log('Item', item.postedBy);
            if (item.postedBy) {
              return (
                <View className="mx-5 pt-5" key={index}>
                  <View className="w-full flex-row gap-4 ">
                    <Image
                      source={{
                        uri:
                          item?.postedBy?.image?.url ||
                          'https://as1.ftcdn.net/v2/jpg/03/24/73/92/1000_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
                      }}
                      className="w-[12vw] h-[6vh] rounded-full"
                    />
                    <View className="w-[50%]">
                      <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM ">
                        {item?.postedBy?.name || 'Anonymous'}
                      </Text>
                      <Text className="text-base text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                        {item.text}
                      </Text>
                      <Text className="text-base text-DEFAULT_GREY font-POPPINS_REGULAR">
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
                </View>
              );
            }
            return null;
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
});
export default OverviewRestaurant;
