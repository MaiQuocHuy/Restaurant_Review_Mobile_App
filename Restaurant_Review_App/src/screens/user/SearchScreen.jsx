import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  PermissionsAndroid,
  StatusBar,
  Image,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../../components/SearchBar';
import Mapbox from '@rnmapbox/maps';
import {BASE_URL, getCoordinatesFromAddress} from '../../helpers';
import RestaurantListSearch from '../../components/RestaurantListSearch';
import {Separator} from '../../components';
import axios from 'axios';
import {useContext} from 'react';
import {UserLocationContext} from '../../contexts/userLocationContext';
import {debounce} from 'lodash';
import {useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const AccessToken =
  'pk.eyJ1IjoibWFpaHV5bWFwMTIzIiwiYSI6ImNsdmR0ZTloazAybDcyaXBweGp0ZmQ0eDYifQ.Umosc-ZzdKZOI6CKCCs8rA';

Mapbox.setAccessToken(AccessToken);

export default function SearchScreen({navigation}) {
  // const [userLocation, setUserLocation] = useState(null);
  const [visible, setVisible] = useState(false);
  const [nearByPlace, setNearByPlace] = useState(false);
  const [mapRegion, setMapRegion] = useState([]);
  const [originalRestaurants, setOriginalRestaurants] = useState([]);
  //Restaurant in search
  const [restaurants, setRestaurants] = useState([]);
  const {userLocation, setUserLocation} = useContext(UserLocationContext);
  const [routeDirections, setRouteDirections] = useState();
  const [textSearch, setTextSearch] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (userLocation != null) {
      console.log('User-Location', userLocation);
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0421,
      });
    }
  }, [userLocation]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const searchByNameRestaurant = async text => {
    console.log('Text search', text);
    try {
      const newData = originalRestaurants.filter(item => {
        console.log(item);
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setRestaurants(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (textSearch.length > 0) searchByNameRestaurant(textSearch);
    else setRestaurants(originalRestaurants);
  }, [textSearch]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const createMultipleRouteline = async () => {
    const routeFeatures = [];
    for (let item of restaurants) {
      if (item?.coordinates?.latitude && item?.coordinates?.longitude) {
        const routeFeature = await createRouterLine(
          [userLocation.longitude, userLocation.latitude],
          [item?.coordinates?.longitude, item?.coordinates?.latitude],
        );
        if (routeFeature) {
          routeFeatures.push(routeFeature);
        }
      }
    }
    console.log(routeFeatures.length);
    setRouteDirections(routeFeatures);
  };

  useEffect(() => {
    if (restaurants.length > 0 && userLocation != null) {
      createMultipleRouteline();
    }
  }, [restaurants, userLocation]);

  const fetchRestaurants = async () => {
    const {data} = await axios.get(`${BASE_URL}/restaurant/show`);
    console.log('Restaurants', data.restaurants);
    if (data.success) {
      setRestaurants(data.restaurants);
      setOriginalRestaurants(data.restaurants);
    }
  };

  const makeRouterFeature = coordinates => {
    const routerFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  };

  const createRouterLine = async (start, end) => {
    // console.log('Davao');
    console.log(start, end);
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${AccessToken}`;
    console.log(url);
    const {data} = await axios.get(url);
    console.log('Data', data);
    const coordinates = data.routes[0].geometry.coordinates;
    if (coordinates.length > 0) {
      const routerFeature = makeRouterFeature([...coordinates]);
      return routerFeature;
      // setRouteDirections(routerFeature);
    }
  };
  // Example usage
  // const address =
  //   '470 Đ. Trần Đại Nghĩa, Khu đô thị, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam';
  // getCoordinatesFromAddress(address, AccessToken).then(coordinates => {
  //   if (coordinates) {
  //     console.log('Coordinates:', coordinates);
  //     // Do something with the coordinates
  //   } else {
  //     console.log('No coordinates found.');
  //   }
  // });

  return (
    <View className="justify-center items-center flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={'#C2C2CB'}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="absolute z-20 top-10">
        <SearchBar
          visible={visible}
          nearByPlace={nearByPlace}
          setNearByPlace={setNearByPlace}
          setVisible={setVisible}
          setTextSearch={setTextSearch}
          textSearch={textSearch}
        />
      </View>

      <View
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}>
        {userLocation != null && (
          <Mapbox.MapView
            style={{flex: 1}}
            zoomEnabled={true}
            rotateEnabled={true}>
            <Mapbox.Camera
              zoomLevel={16}
              centerCoordinate={[
                userLocation?.longitude,
                userLocation?.latitude,
              ]}
            />
            {routeDirections &&
              routeDirections.map((item, index) => (
                <Mapbox.ShapeSource
                  id={`line${index}`}
                  shape={item}
                  key={index}>
                  <Mapbox.LineLayer
                    id={`routeLine${index}`}
                    style={{
                      lineColor: '#FA9E14',
                      lineWidth: 4,
                    }}
                  />
                </Mapbox.ShapeSource>
              ))}
            {console.log(
              'Location',
              userLocation?.longitude,
              userLocation?.latitude,
            )}
            <Mapbox.PointAnnotation
              coordinate={[userLocation?.longitude, userLocation?.latitude]}
              id="1">
              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: 'green',
                  borderColor: 'black',
                  borderWidth: 2,
                  borderRadius: 50,
                }}></View>

              <Mapbox.Callout
                title="My Position"
                contentStyle={{borderRadius: 5}}></Mapbox.Callout>
            </Mapbox.PointAnnotation>
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((item, index) => {
                if (
                  item?.coordinates?.latitude &&
                  item?.coordinates?.longitude
                ) {
                  return (
                    <Mapbox.PointAnnotation
                      key={item._id}
                      id={String(item._id)}
                      coordinate={[
                        item?.coordinates?.longitude,
                        item?.coordinates?.latitude,
                      ]}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: 'red',
                          borderColor: 'black',
                          borderWidth: 2,
                          borderRadius: 50,
                        }}
                      />
                      <Mapbox.Callout
                        title={item.name}
                        contentStyle={{borderRadius: 5}}
                      />
                    </Mapbox.PointAnnotation>
                  );
                }
                return null; // Return null when no valid coordinates
              })
            ) : (
              <Text>No restaurants found or invalid coordinates.</Text>
            )}
          </Mapbox.MapView>
        )}
        <View
          className={`absolute z-20 ${
            keyboardVisible ? 'bottom-52' : 'bottom-28'
          }`}>
          <RestaurantListSearch
            restaurants={restaurants}
            nearByPlace={nearByPlace}
            userLocation={userLocation}
            setRestaurants={setRestaurants}
            navigate={restaurantId => {
              navigation.navigate('Restaurant', {restaurantId});
            }}
          />
        </View>
      </View>
    </View>
  );
}
