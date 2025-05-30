import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CategoryMenuItem from '../../components/CategoryMenuItem';
import RestaurantCard from '../../components/RestaurantCard';
import RestaurantMediumCard from '../../components/RestaurantMediumCard';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import Spinner from '../../components/Spinner';
import {fetchAddress} from '../../helpers/location';
import {useContext} from 'react';
import {UserLocationContext} from '../../contexts/userLocationContext';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {UserContext} from '../../contexts/userContext';
import {LogBox} from 'react-native';
import {BASE_URL} from '../../helpers';

LogBox.ignoreLogs(['ReactImageView: Image source']);
export default function HomeScreen({navigation}) {
  const {restaurants, setRestaurants} = useContext(dataUserGlobalContext);
  const {user, setUser} = useContext(UserContext);
  const {userLocation, setUserLocation} = useContext(UserLocationContext);

  const [activeSortItem, setActiveSortItem] = useState('asianrestaurant');
  const [restaurantsType, setRestaurantsType] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingActiveSortItem, setLoadingActiveSortItem] = useState(false);
  const [address, setAddress] = useState('');

  const fetchRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/restaurant/show`);
      console.log('Data', data.restaurants);
      if (data.success) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const handleActiveSortItem = async activeItem => {
    console.log(activeItem);
    setLoadingActiveSortItem(true);
    try {
      if (restaurants && restaurants.length > 0) {
        setRestaurantsType(restaurants.filter(res => res.type === activeItem));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingActiveSortItem(false);
    }
  };

  const updateRestaurantBookMarked = (restaurantsBookMark, id, check) => {
    return restaurantsBookMark.map(restaurant => {
      console.log('Restaurant', restaurant._id, id);
      if (String(restaurant._id.trim()) == String(id.trim())) {
        if (check) {
          console.log('User', user._id);
          return {
            ...restaurant,
            bookmarks: [...restaurant.bookmarks, user._id],
          };
        } else {
          return {
            ...restaurant,
            bookmarks: restaurant.bookmarks.filter(
              bookmark => bookmark !== user._id,
            ),
          };
        }
      } else return restaurant;
    });
  };

  const handleBookMark = async id => {
    try {
      const {data} = await axios.put(
        `${BASE_URL}/restaurant/bookmark/${id.trim()}`,
      );
      console.log('Bookmark', data);
      if (data.success) {
        console.log('Dâta', data);
        setRestaurants(updateRestaurantBookMarked(restaurants, id, data.check));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user') fetchRestaurants();
  }, [user]);

  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      setRestaurantsType(
        restaurants.filter(res => res.type === activeSortItem),
      );
    }
    // console.log('Render', restaurants);
  }, [restaurants]);

  useEffect(() => {
    if (activeSortItem) {
      handleActiveSortItem(activeSortItem);
    }
  }, [activeSortItem]);

  useEffect(() => {
    if (userLocation) {
      console.log('User-Location', userLocation);
      fetchAddress(userLocation.latitude, userLocation.longitude)
        .then(address => {
          console.log('address', address);
          setAddress(address);
        })
        .catch(error => console.error(error));
    }
  }, [userLocation]);

  return (
    <View classname="flex-1 bg-SECONDARY_WHITE">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      {/* BackgroundContainer */}
      <View className=" bg-DEFAULT_GREEN h-[2000px] absolute -top-[1770px] w-[2000px] rounded-full self-center z-999" />
      {/* HeaderContainer */}
      <View className="justify-evenly mx-6 pt-10 pb-4">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={30} color="#fff" />
          <View className="w-full ml-2">
            <Text className="text-DEFAULT_WHITE text-lg font-POPPINS_MEDIUM">
              Address of you
            </Text>

            <Text
              className="text-DEFAULT_YELLOW w-[60%] text-base font-POPPINS_MEDIUM"
              numberOfLines={1}
              ellipsizeMode="tail">
              {address != '' ? address : 'Cannot get your location'}
            </Text>
          </View>
          {/* <MaterialIcons name="keyboard-arrow-down" size={30} color="#FBA83C" /> */}
        </View>
        <View className="absolute right-1 top-0 rounded-full w-26 h-26 items-center justify-center mt-7">
          <Image
            className="w-14 h-14 rounded-full"
            source={{
              uri:
                user?.image?.url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
            }}
          />
        </View>
      </View>
      <ScrollView className="p-2 -z-5">
        <View className="flex-1">
          <View className="w-full">
            <View className="flex-row items-center justify-between mx-5 mb-1">
              <Text className="text-DEFAULT_WHITE text-lg font-POPPINS_MEDIUM">
                Newest Restaurant
              </Text>
            </View>
            {loadingRestaurants ? (
              <Spinner width={'100%'} height={1080 * 0.15} />
            ) : (
              <FlatList
                data={restaurants}
                keyExtractor={item => item?._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => <Separator width={20} />}
                ListFooterComponent={() => <Separator width={20} />}
                ItemSeparatorComponent={() => <Separator width={10} />}
                renderItem={({item}) => (
                  <RestaurantCard
                    key={item?._id}
                    {...item}
                    user={user}
                    userLocation={userLocation}
                    handleBookMark={handleBookMark}
                    navigate={restaurantId =>
                      navigation.navigate('Restaurant', {restaurantId})
                    }
                  />
                )}
              />
            )}
          </View>
          <View className="flex-row justify-evenly items-center mt-2 shadow-sm px-4">
            <TouchableOpacity
              className={`flex-1 ease-linear justify-center items-center border-b ${
                activeSortItem === 'asianrestaurant'
                  ? 'border-b-DEFAULT_YELLOW'
                  : 'border-b-SECONDARY_WHITE'
              }`}
              activeOpacity={0.8}
              onPress={() => {
                // handleActiveSortItem('asian');
                setActiveSortItem('asianrestaurant');
              }}>
              <Text className="text-DEFAULT_BLACK text-base font-POPPINS_SEMI_BOLD">
                Asian
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 ease-linear justify-center items-center border-b ${
                activeSortItem === 'europeanrestaurant'
                  ? 'border-b-DEFAULT_YELLOW'
                  : 'border-b-SECONDARY_WHITE'
              }`}
              activeOpacity={0.8}
              onPress={() => {
                // handleActiveSortItem('european');
                setActiveSortItem('europeanrestaurant');
              }}>
              <Text className="text-DEFAULT_BLACK text-base font-POPPINS_SEMI_BOLD">
                European
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 ease-linear justify-center items-center border-b ${
                activeSortItem === 'americanrestaurant'
                  ? 'border-b-DEFAULT_YELLOW'
                  : 'border-b-SECONDARY_WHITE'
              }`}
              activeOpacity={0.8}
              onPress={() => {
                // handleActiveSortItem('american');
                setActiveSortItem('americanrestaurant');
              }}>
              <Text className="text-DEFAULT_BLACK text-base font-POPPINS_SEMI_BOLD">
                American
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 ease-linear justify-center items-center border-b ${
                activeSortItem === 'africanrestaurant'
                  ? 'border-b-DEFAULT_YELLOW'
                  : 'border-b-SECONDARY_WHITE'
              }`}
              activeOpacity={0.8}
              onPress={() => {
                // handleActiveSortItem('african');
                setActiveSortItem('africanrestaurant');
              }}>
              <Text className="text-DEFAULT_BLACK text-base font-POPPINS_SEMI_BOLD">
                African
              </Text>
            </TouchableOpacity>
          </View>
          {loadingActiveSortItem ? (
            <Spinner width={'100%'} height={1080 * 0.15} />
          ) : (
            restaurantsType.length > 0 &&
            restaurantsType.map((item, index) => (
              <RestaurantMediumCard
                key={index}
                {...item}
                user={user}
                userLocation={userLocation}
                handleBookMark={handleBookMark}
                navigate={restaurantId =>
                  navigation.navigate('Restaurant', {restaurantId})
                }
              />
            ))
          )}

          <Separator height={250} />
        </View>
      </ScrollView>
    </View>
  );
}
