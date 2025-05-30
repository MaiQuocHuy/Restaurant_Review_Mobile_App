import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Separator} from '../../components';
import SearchComponent from '../../components/SearchComponent';
import RestaurantMediumCard from '../../components/RestaurantMediumCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useContext} from 'react';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import axios from 'axios';
import {UserContext} from '../../contexts/userContext';
import {debounce, set} from 'lodash';
import {useCallback} from 'react';
import {UserLocationContext} from '../../contexts/userLocationContext';
import {BASE_URL} from '../../helpers';
import Spinner from '../../components/Spinner';
const BookMarkedScreen = ({navigation}) => {
  const {restaurants, setRestaurants} = useContext(dataUserGlobalContext);
  const [restaurantsBookMark, setRestaurantsBookMark] = useState([]);
  const {user, setUser} = useContext(UserContext);
  const [textSearch, setTextSearch] = useState('');
  const {userLocation, setUserLocation} = useContext(UserLocationContext);
  const [originalRestaurantsBookMark, setOriginalRestaurantsBookMark] =
    useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurantsBookMarked = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/restaurant/show`);
      console.log('Data', data.restaurants);
      if (data.success) {
        setRestaurantsBookMark(
          data.restaurants.filter(restaurant =>
            restaurant.bookmarks.some(bookmark => bookmark === user._id),
          ),
        );
        setOriginalRestaurantsBookMark(
          data.restaurants.filter(restaurant =>
            restaurant.bookmarks.some(bookmark => bookmark === user._id),
          ),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMark = async id => {
    try {
      const {data} = await axios.put(`${BASE_URL}/restaurant/bookmark/${id}`);
      console.log('Bookmark', data);
      if (data.success) {
        const updateRestaurantBookMarked = restaurantsBookMark => {
          return restaurantsBookMark.map(restaurant => {
            if (String(restaurant._id) === String(id)) {
              if (data.check) {
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

        setRestaurantsBookMark(
          updateRestaurantBookMarked(restaurantsBookMark).filter(restaurant =>
            restaurant.bookmarks.some(bookmark => bookmark === user._id),
          ),
        );

        setOriginalRestaurantsBookMark(
          updateRestaurantBookMarked(restaurantsBookMark).filter(restaurant =>
            restaurant.bookmarks.some(bookmark => bookmark === user._id),
          ),
        );

        setRestaurants(updateRestaurantBookMarked(restaurants));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchByNameRestaurant = async text => {
    try {
      const newData = originalRestaurantsBookMark.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setRestaurantsBookMark(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRestaurantsBookMarked();
  }, []);

  useEffect(() => {
    if (textSearch.length > 0) {
      searchByNameRestaurant(textSearch);
    } else {
      if (
        originalRestaurantsBookMark &&
        originalRestaurantsBookMark.length > 0
      ) {
        console.log(originalRestaurantsBookMark);
        setRestaurantsBookMark(originalRestaurantsBookMark);
      }
    }
  }, [textSearch]);

  // useEffect(() => {
  //   if (restaurantsBookMark && restaurantsBookMark.length > 0) {
  //     setOriginalRestaurantsBookMark(restaurantsBookMark);
  //   }
  // }, [restaurantsBookMark]);

  return (
    <View className="flex-1 bg-SECONDARY_WHITE">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="w-full flex-row  pt-5 mx-3">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#000000" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-36 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          BookMarked
        </Text>
      </View>
      <SearchComponent textSearch={textSearch} setTextSearch={setTextSearch} />
      {loading ? (
        <Spinner width={'100%'} height={100} />
      ) : (
        <ScrollView>
          {restaurantsBookMark &&
            restaurantsBookMark.length > 0 &&
            restaurantsBookMark.map((item, index) => (
              <View className="w-full pb-4" key={index}>
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
              </View>
            ))}
          <Separator height={60} />
        </ScrollView>
      )}
    </View>
  );
};

export default BookMarkedScreen;
