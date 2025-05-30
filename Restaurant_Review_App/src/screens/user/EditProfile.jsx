import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import {UserContext} from '../../contexts/userContext';
import {useContext} from 'react';
import {BASE_URL} from '../../helpers';

const EditProfile = ({navigation}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [isFocusName, setIsFocusName] = useState(false);
  const [isFocusPhone, setIsFocusPhone] = useState(false);
  const [isFocusImage, setIsFocusImage] = useState(false);
  const [loading, setLoading] = useState(false);

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
    try {
      if (!name || !phone || !photo) {
        return alert('Please fill all required fields');
      }
      if (!phone.match(/^[0-9]+$/) || phone.length !== 10) {
        return alert('Phone must be a number and exactly 10 digits');
      }

      setLoading(true);
      console.log('Full data', name, phone, photo);
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('phone', phone);
      formdata.append('image', {
        uri: photo.url || photo.uri,
        type: 'image/*',
        name: Math.random().toString(36).substring(2, 8),
      });
      formdata.append('email', email);
      console.log('Form data', formdata);
      const {data} = await axios.post(`${BASE_URL}/user/update`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(data);
      if (data.success) {
        alert('Update successfully');
        const {userUpdate} = data;
        setUser({...user, ...userUpdate});
        setName(userUpdate.name);
        setPhone(userUpdate.phone);
        setImageSource({uri: userUpdate.image.url});
        setPhoto(userUpdate.image);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    console.log('Fetch user profile');
    try {
      setName(user.name);
      setPhone(user.phone);
      setImageSource({uri: user.image.url});
      setPhoto(user.image);
      setEmail(user.email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user') fetchUserProfile();
  }, [user]);

  return (
    <View className="flex-1 bg-DEFAULT_WHITE">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-[26vh] pt-5 bg-DEFAULT_GREEN px-5">
        <View className="w-full flex-row">
          <TouchableOpacity
            onPress={() => {
              console.log('Back');
              navigation.goBack();
            }}>
            <Ionicons name="chevron-back-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg w-full ml-36 text-DEFAULT_WHITE font-POPPINS_MEDIUM">
            Edit Profile
          </Text>
        </View>
        <View className="items-center justify-center my-2 space-y-1">
          <TouchableOpacity onPress={handleChoosePhoto}>
            {imageSource?.uri ? (
              <Image
                source={{
                  uri: imageSource.uri,
                }}
                className="w-[20vw] h-[10vh] rounded-full"
              />
            ) : (
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
                }}
                className="w-[20vw] h-[10vh] rounded-full"
              />
            )}
          </TouchableOpacity>
          <MaterialIcons
            name="photo-camera"
            size={30}
            color="#ffffff"
            style={styles.iconPhoto}
          />
          <Text className="text-DEFAULT_WHITE text-xl font-POPPINS_REGULAR">
            {name}
          </Text>
          <Text className="text-DEFAULT_GREY text-base font-POPPINS_REGULAR">
            {email}
          </Text>
        </View>
      </View>
      <Text className="text-2xl font-POPPINS_MEDIUM text-DEFAULT_GREEN py-5 px-3">
        Personal Details
      </Text>
      {/* Form */}
      <KeyboardAwareScrollView enableOnAndroid={true} style={{flex: 1}}>
        <View className="rounded-lg p-2 m-1">
          {isFocusName && renderLabel('Name (*)')}
          <TextInput
            className={`text-base font-POPPINS_REGULAR text-DEFAULT_BLACK rounded-lg border ${
              isFocusName ? 'border-DEFAULT_GREEN' : 'border-DEFAULT_GREY'
            }  p-2`}
            // stisFocusPhone && {borderColor: '#0A8791'}
            placeholder="Name..."
            placeholderTextColor="#C2C2CB"
            autoCapitalize="none"
            onChangeText={text => setName(text)}
            onBlur={() => setIsFocusName(false)}
            onFocus={() => setIsFocusName(true)}
            value={name}
            required={true}
          />
        </View>

        <View className="rounded-lg p-2 m-1">
          {isFocusPhone && renderLabel('Phone (*)')}
          <TextInput
            className={`text-base font-POPPINS_REGULAR text-DEFAULT_BLACK rounded-lg border ${
              isFocusPhone ? 'border-DEFAULT_GREEN' : 'border-DEFAULT_GREY'
            }  p-2`}
            placeholder="Phone..."
            placeholderTextColor="#C2C2CB"
            autoCapitalize="none"
            keyboardType="number-pad"
            onChangeText={text => setPhone(text)}
            onBlur={() => setIsFocusPhone(false)}
            onFocus={() => setIsFocusPhone(true)}
            value={phone}
          />
        </View>
        {loading ? (
          <Spinner width={'100%'} height={50} />
        ) : (
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#0A8791',
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginHorizontal: 12,
              }}>
              <Text style={styles.button}>Update</Text>
            </View>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#0A8791',
  },
  iconPhoto: {
    position: 'absolute',
    right: 140,
    zIndex: 999,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#0A8791',
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    margin: 2,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

export default EditProfile;
