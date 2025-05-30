import React from 'react';
import {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as turf from '@turf/turf';

export default function RestaurantCard({navigate, ...props}) {
  const calculateDistances = (center, coordinate) => {
    const centerPoint = turf.point(center);
    const point = turf.point(coordinate);
    return turf.distance(centerPoint, point);
  };

  function formatTimeInMinutesAndSeconds(hours) {
    const minutes = Math.floor(hours * 60);
    return minutes + ' minutes';
  }

  const calculateTravelTime = (distance, speed) => {
    return distance / speed;
  };

  const getType = type => {
    switch (type) {
      case 'asianrestaurant':
        return 'Asian';
      case 'europeanrestaurant':
        return 'European';
      case 'americanrestaurant':
        return 'American';
      case 'africanrestaurant':
        return 'African';
      default:
        return '';
    }
  };
  return (
    <View className="flex-1 justify-center bg-DEFAULT_WHITE rounded-xl shadow-lg mb-5">
      <TouchableWithoutFeedback onPress={() => props.handleBookMark(props._id)}>
        <Ionicons
          name="bookmark"
          color={
            props.bookmarks.length > 0 &&
            props.bookmarks.find(id => id == props?.user._id)
              ? '#FBA83C'
              : '#C2C2CB'
          }
          size={30}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 99,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={() => navigate(props._id)}>
        <Image
          source={{
            uri:
              props?.image?.url ||
              'https://t4.ftcdn.net/jpg/03/16/15/47/360_F_316154790_pnHGQkERUumMbzAjkgQuRvDgzjAHkFaQ.jpg',
          }}
          style={{
            width: 1920 * 0.15,
            height: 1080 * 0.15,
            borderRadius: 10,
            margin: 5,
          }}
        />
      </TouchableOpacity>
      <Text className="ml-[8px] text-sm font-POPPINS_SEMI_BOLD text-DEFAULT_BLACK">
        {props.name}
      </Text>
      <Text className="ml-2 text-sm font-POPPINS_MEDIUM text-DEFAULT_GREY mb-1 uppercase">
        {props.country}
      </Text>
      <View className="flex-row items-center mx-2 mb-2 justify-between">
        <View className="flex-row items-center">
          <FontAwesome name="star" size={14} color="#FBA83C" />
          <Text className="ml-[5px] text-sm font-POPPINS_BOLD text-DEFAULT_BLACK">
            {getType(props.type)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="flex-row items-center px-2 py-1 bg-LIGHT_YELLOW rounded-xl mx-1">
            <Ionicons name="timer-outline" color="#FBA83C" size={15} />
            <Text className="text-sm pl-1 font-POPPINS_BOLD text-DEFAULT_YELLOW">
              {props.userLocation &&
                props.coordinates &&
                props.coordinates.longitude &&
                props.coordinates.latitude &&
                formatTimeInMinutesAndSeconds(
                  calculateTravelTime(
                    calculateDistances(
                      [
                        props.userLocation.longitude,
                        props.userLocation.latitude,
                      ],
                      [props.coordinates.longitude, props.coordinates.latitude],
                    ).toFixed(1),
                    40,
                  ).toFixed(2),
                )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
