import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Images} from '../constants';
import {Display} from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import * as turf from '@turf/turf';

export default function RestaurantMediumCard({navigation, ...props}) {
  const [rating, setRating] = useState(0);

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

  const calculateDistances = (center, coordinate) => {
    const centerPoint = turf.point(center);
    const point = turf.point(coordinate);
    return turf.distance(centerPoint, point);
  };

  const calculateTravelTime = (distance, speed) => {
    return distance / speed;
  };

  function formatTimeInMinutesAndSeconds(hours) {
    const minutes = Math.floor(hours * 60);
    return minutes + ' minutes';
  }

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri:
              props?.image?.url ||
              'https://t4.ftcdn.net/jpg/03/16/15/47/360_F_316154790_pnHGQkERUumMbzAjkgQuRvDgzjAHkFaQ.jpg',
          }}
          style={styles.posterStyle}
        />
      </View>
      <View style={styles.labelContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} className="font-POPPINS_BOLD">
            {props.name}
          </Text>
        </View>
        <Text style={styles.tagsText} className="font-POPPINS_MEDIUM">
          {getType(props.type)}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => props.handleBookMark(props._id)}>
          <Ionicons
            name="bookmark"
            color={
              props?.bookmarks?.length > 0 &&
              props?.bookmarks.find(id => id == props?.user._id)
                ? '#FBA83C'
                : '#C2C2CB'
            }
            size={30}
            style={{
              position: 'absolute',
              top: -2,
              right: 10,
              zIndex: 99,
            }}
          />
        </TouchableWithoutFeedback>
        <View style={styles.deliveryDetailsContainer}>
          <View style={styles.rowAndCenter}>
            <Image
              source={Images.DELIVERY_TIME}
              style={styles.deliveryDetailsIcon}
            />
            <Text
              style={styles.deliveryDetailsText}
              className="font-POPPINS_SEMI_BOLD">
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
          <View style={styles.rowAndCenter}>
            <Image style={styles.deliveryDetailsIcon} />
            <Text
              style={styles.deliveryDetailsText}
              className="font-POPPINS_SEMI_BOLD">
              {props.userLocation &&
                props.coordinates &&
                calculateDistances(
                  [props.userLocation.longitude, props.userLocation.latitude],
                  [props.coordinates.longitude, props.coordinates.latitude],
                ).toFixed(1)}{' '}
              km
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  posterStyle: {
    width: Display.setWidth(20),
    height: Display.setWidth(20),
    borderRadius: 10,
    margin: 5,
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    // fontFamily: POPPINS_BOLD,
    color: '#000000',
    marginBottom: 5,
  },
  tagsText: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    // fontFamily: POPPINS_MEDIUM,
    color: '#C2C2CB',
    marginBottom: 7,
  },
  deliveryDetailsText: {
    marginLeft: 3,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    // fontFamily: POPPINS_SEMI_BOLD,
    color: '#000000',
  },
  deliveryDetailsIcon: {
    height: 16,
    width: 16,
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 10,
    lineHeight: 10 * 1.4,
    // fontFamily: POPPINS_BOLD,
    color: '#000000',
  },
  reviewsText: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    // fontFamily: POPPINS_MEDIUM,
    color: '#000000',
  },
});
