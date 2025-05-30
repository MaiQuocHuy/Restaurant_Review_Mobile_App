import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  Button,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Dimensions} from 'react-native';
import {useRef} from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import ProgressBar from 'react-native-progress/Bar';
import {BASE_URL, getCoordinatesFromAddress} from '../../helpers';
import {UserLocationContext} from '../../contexts/userLocationContext';
import * as turf from '@turf/turf';
import {LogBox} from 'react-native';

const AccessToken =
  'pk.eyJ1IjoibWFpaHV5bWFwMTIzIiwiYSI6ImNsdmR0ZTloazAybDcyaXBweGp0ZmQ0eDYifQ.Umosc-ZzdKZOI6CKCCs8rA';

const RestaurantScreen = ({
  navigation,
  route: {
    params: {restaurantId},
  },
}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const {userLocation, setUserLocation} = useContext(UserLocationContext);
  //state active
  const [activeSection, setActiveSection] = useState('Menu');
  //ref
  const menuRef = useRef();
  const reviewsRef = useRef();
  const detailsRef = useRef();
  const scrollViewRef = useRef();
  // scrollToPosition
  const [detailsY, setDetailsY] = useState(0);
  const [menuY, setMenuY] = useState(0);
  const [reviewsY, setReviewsY] = useState(0);

  const handleScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (menuRef.current) {
      try {
        menuRef.current.measure((x, y, width, height, pageX, pageY) => {
          if (scrollY >= pageY && scrollY < pageY + height) {
            setActiveSection('Menu');
          }
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (reviewsRef.current) {
      reviewsRef.current.measure((x, y, width, height, pageX, pageY) => {
        if (scrollY >= pageY && scrollY < pageY + height) {
          setActiveSection('Reviews');
        }
      });
    }

    if (detailsRef.current) {
      detailsRef.current.measure((x, y, width, height, pageX, pageY) => {
        if (scrollY >= pageY && scrollY < pageY + height) {
          setActiveSection('Details');
        }
      });
    }
  };

  const handleShare = () => {
    console.log('Share');
    Share.share(
      {
        title: 'Share restaurant',
        message: `Check out ${restaurant.name} at ${restaurant.address}`,
      },
      {dialogTitle: 'Android Title'},
    )
      .then(({action, activityType}) => {
        if (action === Share.sharedAction) console.log('Share was successful');
        else console.log('Share was dismissed');
      })
      .catch(err => console.log(err));
  };

  function formatDate(dateString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `${BASE_URL}/restaurant/show/${restaurantId}`,
      );
      if (data.success) {
        setRestaurant(data.restaurant);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  const getAvarageRating = async () => {
    try {
      const {data} = await axios.post(`${BASE_URL}/restaurant/rating/avg`, {
        id: restaurantId,
      });
      if (data.success) {
        setRating(data.averageRating);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDistances = (center, coordinate) => {
    const centerPoint = turf.point(center);
    const point = turf.point(coordinate);
    return turf.distance(centerPoint, point);
  };

  useEffect(() => {
    fetchRestaurant();
    getAvarageRating();
  }, []);

  useEffect(() => {
    if (restaurant && restaurant?.address) {
      getCoordinatesFromAddress(restaurant.address, AccessToken)
        .then(coords => setCoordinates(coords))
        .catch(err => console.error(err));
    }
  }, [restaurant?.address, AccessToken]);

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
    <SafeAreaView className="flex flex-1 justify-center">
      <StatusBar barStyle="default" translucent backgroundColor="transparent" />
      {loading ? (
        <Spinner width={'100%'} height={'100%'} />
      ) : (
        restaurant != null && (
          <>
            <Image
              source={{
                uri: restaurant.image.url,
              }}
              className="absolute top-0 h-full w-full object-fill"
            />
            <View className="flex flex-row justify-between items-center h-[13%] pt-12 px-4">
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons name="chevron-back-outline" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <View>
                  <Ionicons name="share-outline" size={30} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView onScroll={handleScroll} ref={scrollViewRef}>
              <View className="flex justify-center flex-1">
                <Separator height={200} />
                <View className="bg-DEFAULT_WHITE rounded-t-3xl">
                  <View className="flex flex-row items-center justify-between mx-6 mt-4">
                    <Text className="text-2xl font-POPPINS_SEMI_BOLD text-DEFAULT_BLACK">
                      {restaurant.name}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Text className="ml-6 mr-2 mt-1 text-base font-POPPINS_SEMI_BOLD text-DEFAULT_GREY">
                      {getType(restaurant.type)}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center mx-6 mt-2">
                    <FontAwesome name="star" size={18} color="#FBA83C" />
                    <Text className="ml-1 text-sm font-POPPINS_BOLD text-DEFAULT_BLACK">
                      {rating.toFixed(1)}
                    </Text>
                    <Text className="ml-1 text-sm font-POPPINS_BOLD text-DEFAULT_BLACK">
                      ({restaurant.comments.length} Reviews)
                    </Text>
                  </View>
                  <View className="flex flex-row items-center space-x-5 mx-6 mt-2">
                    <View className="flex flex-row items-center">
                      <Ionicons
                        name={'location-sharp'}
                        color="#000"
                        size={16}
                      />
                      <Text className="ml-1 text-sm font-POPPINS_MEDIUM text-DEFAULT_BLACK">
                        {userLocation &&
                          coordinates &&
                          calculateDistances(
                            [userLocation.longitude, userLocation.latitude],
                            [coordinates.longitude, coordinates.latitude],
                          ).toFixed(1)}
                        km
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-row pl-4 space-x-4 border-b-2 border-b-DEFAULT_GREY my-2">
                    <TouchableOpacity
                      onPress={() => {
                        scrollViewRef.current.scrollTo({
                          x: 0,
                          y: menuY,
                          animated: true,
                        });
                      }}>
                      <View className="p-2">
                        <Text
                          className="text-base font-POPPINS_MEDIUM"
                          style={
                            activeSection === 'Menu'
                              ? styles.activeText
                              : styles.text
                          }>
                          Menu
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        scrollViewRef.current.scrollTo({
                          x: 0,
                          y: reviewsY,
                          animated: true,
                        })
                      }>
                      <View className="p-2">
                        <Text
                          className="text-base font-POPPINS_MEDIUM"
                          style={
                            activeSection === 'Reviews'
                              ? styles.activeText
                              : styles.text
                          }>
                          Reviews
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        scrollViewRef.current.scrollTo({
                          x: 0,
                          y: detailsY,
                          animated: true,
                        })
                      }>
                      <View className="p-2">
                        <Text
                          className="text-base font-POPPINS_MEDIUM"
                          style={
                            activeSection === 'Details'
                              ? styles.activeText
                              : styles.text
                          }>
                          Details
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* Menu */}
                  <View
                    className="flex my-4 gap-2 px-6 pt-2"
                    onLayout={event => {
                      setMenuY(event.nativeEvent.layout.y);
                    }}
                    ref={menuRef}
                    collapsable={false}>
                    <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                      Menu
                    </Text>
                    <TouchableOpacity
                      className="bg-DEFAULT_GREEN border border-SECONDARY_WHITE justify-center items-center py-2"
                      onPress={() =>
                        navigation.navigate('RestaurantMenu', {
                          restaurantId: restaurantId,
                        })
                      }>
                      <Text className="text-lg text-DEFAULT_WHITE font-POPPINS_REGULAR uppercase">
                        See full menu
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Reviews */}
                  <View
                    className="flex flex-col my-4 gap-2 px-6 pt-2 justify-between"
                    onLayout={event => setReviewsY(event.nativeEvent.layout.y)}
                    ref={reviewsRef}
                    collapsable={false}>
                    <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                      Reviews
                    </Text>
                    <View className="flex-row justify-between  pb-2">
                      <View className="gap-1">
                        <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                          Overall rating
                        </Text>
                        <Text className="text-2xl text-DEFAULT_YELLOW font-POPPINS_SEMI_BOLD">
                          {rating.toFixed(1)}
                        </Text>
                        <View className="flex-row">
                          <Ionicons
                            name="star"
                            size={16}
                            color={`${
                              parseFloat(rating.toFixed(1)) >= 1
                                ? '#FBA83C'
                                : '#C2C2CB'
                            }`}
                          />
                          <Ionicons
                            name="star"
                            size={16}
                            color={`${
                              parseFloat(rating.toFixed(1)) >= 2
                                ? '#FBA83C'
                                : '#C2C2CB'
                            }`}
                          />
                          <Ionicons
                            name="star"
                            size={16}
                            color={`${
                              parseFloat(rating.toFixed(1)) >= 3
                                ? '#FBA83C'
                                : '#C2C2CB'
                            }`}
                          />
                          <Ionicons
                            name="star"
                            size={16}
                            color={`${
                              parseFloat(rating.toFixed(1)) >= 4
                                ? '#FBA83C'
                                : '#C2C2CB'
                            }`}
                          />
                          <Ionicons
                            name="star"
                            size={16}
                            color={`${
                              parseFloat(rating.toFixed(1)) >= 5
                                ? '#FBA83C'
                                : '#C2C2CB'
                            }`}
                          />
                        </View>
                      </View>
                      <View className="flex">
                        <View className="flex-row space-x-2 items-center">
                          <Text className="text-sm text-DEFAULT_YELLOW font-POPPINS_REGULAR">
                            5
                          </Text>
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
                          <Text className="text-sm text-DEFAULT_YELLOW font-POPPINS_REGULAR">
                            4
                          </Text>
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
                          <Text className="text-sm text-DEFAULT_YELLOW font-POPPINS_REGULAR">
                            3
                          </Text>
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
                          <Text className="text-sm text-DEFAULT_YELLOW font-POPPINS_REGULAR">
                            2
                          </Text>
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
                          <Text className="text-sm text-DEFAULT_YELLOW font-POPPINS_REGULAR pr-[3px]">
                            1
                          </Text>
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
                    {/* Comment */}
                    {restaurant.comments.map((comment, index) => {
                      if (index <= 3) {
                        return (
                          <View
                            className="w-full pr-2 pt-4 pb-2 border-b-2 border-b-DEFAULT_GREY"
                            key={index}>
                            <View className="flex-row items-center">
                              <Image
                                source={{
                                  uri:
                                    comment?.postedBy?.image?.url ||
                                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
                                }}
                                className="h-14 w-14 rounded-full"
                              />
                              <View className="flex-1 ml-4">
                                <Text className="text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                                  {comment?.postedBy?.name}
                                </Text>
                                <Text className="text-DEFAULT_GREY font-POPPINS_REGULAR">
                                  {formatDate(comment?.created)}
                                </Text>
                              </View>
                              <View className="flex-row">
                                <Ionicons
                                  name="star"
                                  size={20}
                                  color={`${
                                    comment?.rating >= 1 ? '#FBA83C' : '#C2C2CB'
                                  }`}
                                />
                                <Ionicons
                                  name="star"
                                  size={20}
                                  color={`${
                                    comment?.rating >= 2 ? '#FBA83C' : '#C2C2CB'
                                  }`}
                                />
                                <Ionicons
                                  name="star"
                                  size={20}
                                  color={`${
                                    comment?.rating >= 3 ? '#FBA83C' : '#C2C2CB'
                                  }`}
                                />
                                <Ionicons
                                  name="star"
                                  size={20}
                                  color={`${
                                    comment?.rating >= 4 ? '#FBA83C' : '#C2C2CB'
                                  }`}
                                />
                                <Ionicons
                                  name="star"
                                  size={20}
                                  color={`${
                                    comment?.rating >= 5 ? '#FBA83C' : '#C2C2CB'
                                  }`}
                                />
                              </View>
                            </View>
                            <View className="py-2">
                              <Text
                                className="text-base text-DEFAULT_BLACK font-POPPINS_REGULAR"
                                numberOfLines={4}
                                ellipsizeMode="tail">
                                {comment?.text}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    })}

                    <View className="pt-2 w-full">
                      <TouchableOpacity
                        className="bg-DEFAULT_GREEN border border-SECONDARY_WHITE justify-center items-center py-2"
                        onPress={
                          () =>
                            navigation.navigate('RestaurantReview', {
                              restaurantId: restaurantId,
                            })
                          // navigation.navigate('Test')
                        }>
                        <Text className="text-lg text-DEFAULT_WHITE font-POPPINS_REGULAR uppercase">
                          See all reviews
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* Details */}
                  <View
                    className="flex flex-col my-4 gap-2 px-6 pt-2"
                    collapsable={false}
                    onLayout={event => {
                      setDetailsY(event.nativeEvent.layout.y);
                    }}
                    ref={detailsRef}>
                    <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                      Details
                    </Text>
                    <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                      Address
                    </Text>
                    <View className="flex-row space-x-1">
                      <Ionicons name="location" size={20} color={'#0E122B'} />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-base text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                        {restaurant.address}
                      </Text>
                    </View>
                    {coordinates && (
                      <TouchableOpacity activeOpacity={0.8}>
                        <MapView
                          provider={PROVIDER_GOOGLE}
                          style={{
                            width: Dimensions.get('screen').width * 0.89,
                            height: Dimensions.get('screen').height * 0.1,
                          }}
                          className="rounded-xl"
                          region={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0421,
                          }}>
                          <Marker
                            coordinate={coordinates}
                            title={'title'}
                            description={'description'}
                          />
                        </MapView>
                      </TouchableOpacity>
                    )}
                    <Text className="text-base font-POPPINS_MEDIUM">
                      Additional information
                    </Text>
                    <View className="flex-row space-x-1">
                      <MaterialIcons
                        name="description"
                        size={20}
                        color={'#0E122B'}
                      />
                      <View>
                        <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_SEMI_BOLD">
                          Description
                        </Text>
                        <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_BLACK">
                          {restaurant.description}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row space-x-1">
                      <FontAwesome name="phone" size={20} color={'#0E122B'} />
                      <View>
                        <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_SEMI_BOLD">
                          Phone
                        </Text>
                        <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_RED">
                          {restaurant.phone}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row space-x-1">
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={'#0E122B'}
                      />
                      <View>
                        <Text className="text-sm text-DEFAULT_BLACK font-POPPINS_SEMI_BOLD">
                          Hours of operation
                        </Text>
                        {/* Active */}
                        <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_BLACK">
                          {restaurant.timeWork.start}AM-
                          {restaurant.timeWork.end}PM
                        </Text>
                        {/* Off */}
                      </View>
                    </View>
                    <Separator height={60} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activeText: {
    color: '#FBA83C',
    borderBottomColor: '#FBA83C',
    borderBottomWidth: 3,
  },
  text: {
    color: '#C2C2CB',
  },
});

export default RestaurantScreen;
