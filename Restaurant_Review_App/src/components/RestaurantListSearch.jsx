import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import RestaurantItemSearch from './RestaurantItemSearch';
import {useState} from 'react';
import {useEffect} from 'react';
import * as turf from '@turf/turf';
import axios from 'axios';
import {BASE_URL} from '../helpers';

const RestaurantListSearch = ({
  setRestaurants,
  restaurants,
  nearByPlace,
  userLocation,
  navigate,
}) => {
  const [selectedDistance, setselectedDistance] = useState(10);

  useEffect(() => {
    try {
      console.log(nearByPlace, userLocation);
      if (nearByPlace && userLocation) {
        const storeRestaurnt = restaurants.filter(item => {
          if (item.coordinates.latitude && item.coordinates.longitude) {
            const distance = calculateDistances(
              [userLocation.longitude, userLocation.latitude],
              [item.coordinates.longitude, item.coordinates.latitude],
            );
            console.log('NearDistance', distance);
            return distance <= selectedDistance; // only include items where distance is less than or equal to 10
          }
          return false; // exclude items without valid coordinates
        });
        console.log('StoreRestaurnt', storeRestaurnt);
        setRestaurants(storeRestaurnt);
      } else if (nearByPlace == false && userLocation) {
        console.log('Nearby Place is false');
        fetchRestaurants();
      }
    } catch (error) {
      console.log(error);
    }
  }, [nearByPlace, userLocation]);

  const fetchRestaurants = async () => {
    const {data} = await axios.get(`${BASE_URL}/restaurant/show`);
    console.log('Restaurants', data.restaurants);
    if (data.success) {
      setRestaurants(data.restaurants);
    }
  };

  const calculateDistances = (center, coordinate) => {
    const centerPoint = turf.point(center);
    const point = turf.point(coordinate);
    return turf.distance(centerPoint, point);
  };  

  // const center = [long1, lat1]; // replace with your center longitude and latitude
  // const coordinates = [[long2, lat2], [long3, lat3], [long4, lat4]]; // replace with your coordinates

  // const distances = calculateDistances(center, coordinates);
  // console.log(distances);

  return (
    <View className="p-5 w-[100vw]">
      <FlatList
        data={restaurants}
        keyExtractor={item => item._id}
        horizontal={true}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => navigate(item._id)}>
            <RestaurantItemSearch item={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RestaurantListSearch;
