import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {createContext} from 'react';
import {useState} from 'react';
import {PermissionsAndroid} from 'react-native';

export const UserLocationContext = createContext();

export const UserLocationProvider = ({children}) => {
  const [userLocation, setUserLocation] = useState(null);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Your app needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        Geolocation.watchPosition(
          info => {
            console.log('Info', info);
            setUserLocation({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
            });
          },
          error => {
            console.error(error);
          },
          {enableHighAccuracy: true},
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    // if () {
    requestLocationPermission();
    // }
  }, []);
  return (
    <UserLocationContext.Provider value={{userLocation, setUserLocation}}>
      {children}
    </UserLocationContext.Provider>
  );
};
