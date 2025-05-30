import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {Separator} from '../../components';
import DropdownComponent from '../../components/DropdownComponent';
import {dataTypeRestaurant} from '../../utils';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import Spinner from '../../components/Spinner';
import {dataOwnresGlobalContext} from '../../contexts/dataOwnresGlobalContext';
import {set} from 'lodash';
import {useContext} from 'react';
import {UserContext} from '../../contexts/userContext';
import {BASE_URL} from '../../helpers';

const ManageRestaurantProfileScreen = ({navigation}) => {
  console.log('ManageRestaurantProfileScreen');
  const [textButton, setTextButtom] = useState('Submit');
  const [loadingProfileRestaurant, setLoadingProfileRestaurant] =
    useState(false);
  // State
  const [nameRes, setNameRes] = useState('');
  const [descriptionRes, setDescriptionRes] = useState('');
  const [typeRes, setTypeRes] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [phone, setPhone] = useState('');
  const {restaurant, setRestaurant} = useContext(dataOwnresGlobalContext);
  const {user, setUser} = useContext(UserContext);
  // Focus
  const [isFocusName, setIsFocusName] = useState(false);
  const [isFocusDescription, setIsFocusDescription] = useState(false);
  const [isFocusPhone, setIsFocusPhone] = useState(false);
  const [isFocusType, setIsFocusType] = useState(false);
  const [isFocusStreetAddress, setIsFocusStreetAddress] = useState(false);

  const fetchData = async () => {
    setLoadingProfileRestaurant(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/admin/restaurant/show`);
      console.log('Data fetch: ', data);
      if (data.success) {
        updateValue(data);
        setTextButtom('Update');
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.success == false) {
        setLoadingProfileRestaurant(false);
        console.log('Data is empty');
        setTextButtom('Submit');
      }
    } finally {
      setLoadingProfileRestaurant(false);
    }
  };
  // Effect
  useEffect(() => {
    if (user && user.role === 'ownrestaurant') fetchData();
  }, [user]);

  const updateValue = data => {
    const dataRes = data.restaurant;
    setRestaurant(dataRes);
    const startTime = dataRes.timeWork.start.trim();
    const endTime = dataRes.timeWork.end.trim();
    const newTime = `${startTime}-${endTime}`;
    // Image
    // console.log('Data Image', dataRes);
    setNameRes(dataRes.name);
    setDescriptionRes(dataRes.description);
    setPhone(dataRes.phone);
    setTypeRes(dataRes.type);
    setStreetAddress(dataRes.address);
    setTime(newTime);
    setImageSource({uri: dataRes.image.url});
    setPhoto(dataRes.image);
    console.log('Data is not empty');
  };

  const renderLabel = title => {
    console.log('Label', title);
    return <Text style={styles.label}>{title}</Text>;
  };

  const handleChoosePhoto = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      console.log('uri', res[0].uri); // res.uri is the URI of the selected file
      const image = res[0];
      setImageSource({uri: image.uri});
      setPhoto(image);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return;
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = async () => {
    console.log('Submit');

    if (
      !nameRes ||
      !descriptionRes ||
      !typeRes ||
      !streetAddress ||
      !time ||
      !photo ||
      !phone ||
      !time.includes('-') ||
      !time.split('-')[0] ||
      !time.split('-')[1]
    ) {
      console.log('Please fill all the fields');
      return;
    }
    if (!phone.match(/^[0-9]+$/) || phone.length !== 10) {
      console.log('Phone must be a number and exactly 10 digits');
      return;
    }
    try {
      console.log('Time', time);
      console.log('TextButotm', textButton);
      if (textButton === 'Update') {
        console.log('Update');
        const formData = new FormData();
        formData.append('name', nameRes);
        formData.append('description', descriptionRes);
        formData.append('type', typeRes);
        formData.append('address', streetAddress);
        formData.append('timeWork', time);
        formData.append('phone', phone);
        formData.append('image', {
          uri: photo.url || photo.uri,
          type: 'image/*',
          name: Math.random().toString(36).substring(2, 8),
        });
        setLoadingProfileRestaurant(true);
        const {data} = await axios.put(
          `${BASE_URL}/restaurant/update`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        setLoadingProfileRestaurant(false);
        console.log('Update', data);
        setRestaurant(data.restaurantUpdate);
        alert('Update Success');
      } else {
        const formData = new FormData();
        console.log('Submit');
        console.log(
          'Data Full',
          nameRes,
          descriptionRes,
          typeRes,
          streetAddress,
          time,
          photo,
          phone,
        );
        formData.append('name', nameRes);
        formData.append('description', descriptionRes);
        formData.append('type', typeRes);
        formData.append('address', streetAddress);
        formData.append('timeWork', time);
        formData.append('phone', phone);
        formData.append('image', {
          uri: photo.uri,
          type: photo.type,
          name: photo.name,
        });
        setLoadingProfileRestaurant(true);
        const {data} = await axios.post(
          `${BASE_URL}/restaurant/create`,
          formData, // send formData directly, not wrapped in an object
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('Create', data);
        if (data) {
          setTextButtom('Update');
        }
        setRestaurant(data.restaurant);
        setLoadingProfileRestaurant(false);
        alert('Update Success');
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoadingProfileRestaurant(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Restaurant</Text>
      </View>
      {loadingProfileRestaurant ? (
        <Spinner width="100%" height="80%" />
      ) : (
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.input}>
            <Text style={styles.inputTitle}>Name Restaurant (*)</Text>
            {isFocusName && renderLabel('Name (*)')}
            <TextInput
              style={[
                styles.inputText,
                isFocusName && {borderColor: '#0A8791'},
              ]}
              placeholder="Name Restaurant..."
              placeholderTextColor="#C2C2CB"
              autoCapitalize="none"
              value={nameRes}
              onFocus={() => setIsFocusName(true)}
              onBlur={() => setIsFocusName(false)}
              onChangeText={text => {
                setNameRes(text);
              }}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputTitle}>Description Restaurant (*)</Text>
            {isFocusDescription && renderLabel('Description (*)')}
            <TextInput
              style={[
                styles.inputText,
                isFocusDescription && {borderColor: '#0A8791'},
              ]}
              placeholder="Description Restaurant..."
              placeholderTextColor="#C2C2CB"
              autoCapitalize="none"
              multiline={true}
              value={descriptionRes}
              onFocus={() => setIsFocusDescription(true)}
              onBlur={() => setIsFocusDescription(false)}
              onChangeText={text => {
                setDescriptionRes(text);
              }}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputTitle}>Phone Restaurant (*)</Text>
            {isFocusPhone && renderLabel('Phone (*)')}
            <TextInput
              style={[
                styles.inputText,
                isFocusPhone && {borderColor: '#0A8791'},
              ]}
              placeholder="Phone Restaurant..."
              placeholderTextColor="#C2C2CB"
              autoCapitalize="none"
              value={phone}
              keyboardType="number-pad"
              onFocus={() => setIsFocusPhone(true)}
              onBlur={() => setIsFocusPhone(false)}
              onChangeText={text => {
                setPhone(text);
              }}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputTitle}>Type Restaurant (*)</Text>
            {isFocusType && renderLabel('Type (*)')}
            <DropdownComponent
              data={dataTypeRestaurant}
              title={'Type Restaurant'}
              value={typeRes}
              isFocus={isFocusType}
              setIsFocus={setIsFocusType}
              setValue={setTypeRes}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputTitle}>Address Restaurant (*)</Text>
            {isFocusStreetAddress && renderLabel('Address (*)')}
            <GooglePlacesInput
              setStreetAddress={setStreetAddress}
              isFocusStreetAddress={isFocusStreetAddress}
              value={streetAddress}
              setIsFocusStreetAddress={setIsFocusDescription}
            />
          </View>
          <View style={styles.input}>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={styles.inputTitle}>Time working Restaurant (*)</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {time != '' && (
                <Text style={styles.timeText}>
                  {/* {time.split('-')[0]} AM -{time.split('-')[1]} PM */}
                  {time.split('-')[0] && `${time.split('-')[0]}AM`}
                  {time.split('-')[1] && ` -${time.split('-')[1]}PM`}
                </Text>
              )}
            </View>
            {open && (
              <DatePicker
                modal
                open={open}
                date={date}
                mode="time"
                onConfirm={date => {
                  console.log(date);
                  const dateObj = new Date(date);
                  const options = {hour: '2-digit', minute: '2-digit'};
                  const timeStr = dateObj.toLocaleTimeString('en-US', options);
                  console.log('Time End: ', timeStr);
                  console.log('Time: ', time);
                  if (time.includes('-')) {
                    setTime(timeStr.replace(/ AM| PM/, ''));
                  } else if (time) {
                    // If time contains a start time but no end time, add the end time
                    setTime(
                      prev => prev + '-' + timeStr.replace(/ AM| PM/, ''),
                    );
                  } else {
                    // If time is empty, set the start time
                    setTime(timeStr.replace(/ AM| PM/, ''));
                  }
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            )}
          </View>
          <View style={styles.input}>
            <Text style={styles.inputTitle}>Photo Restaurant</Text>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Text style={styles.inputFile}>
                {photo ? photo.public_id || photo.name : 'Choose Photo'}
              </Text>
            </TouchableOpacity>
            {imageSource && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Image source={imageSource} style={{width: 100, height: 100}} />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#8200d6',
                padding: 4,
                margin: 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text style={styles.button}>{textButton}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#0E122B',
  },
  input: {
    borderRadius: 10,
    padding: 10,
    margin: 6,
  },
  inputTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#0E122B',
  },
  inputText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#0E122B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C2C2CB',
    padding: 10,
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#0A8791',
    borderRadius: 6,
    borderBottomWidth: 4,
    borderBottomColor: '#0A8791',
    padding: 10,
  },
  inputFile: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#0E122B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C2C2CB',
    padding: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 34,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#0A8791',
  },
  buttonTime: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#0E122B',
    paddingVertical: 5,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#8200d6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 6,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

export default ManageRestaurantProfileScreen;
