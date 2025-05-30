import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Separator} from '../../components';
import {useState} from 'react';
import {useContext} from 'react';
import {useEffect} from 'react';
import {useCallback} from 'react';
import {UserContext} from '../../contexts/userContext';
import axios from 'axios';
import SearchComponent from '../../components/SearchComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../../components/Spinner';
import VoucherItem from '../../components/VoucherItem';
import {BASE_URL} from '../../helpers';

const voucherSearchStyle = {
  marginHorizontal: 8,
  marginVertical: 15,
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row',
  width: '94%',
  borderWidth: 1,
  borderColor: '#C2C2CB',
  borderRadius: 10,
  paddingHorizontal: 10,
};

const VoucherScreen = ({navigation}) => {
  const [textSearch, setTextSearch] = useState('');
  const [originalVouchers, setOriginalVouchers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const {user, setUser} = useContext(UserContext);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const fetchVouchers = useCallback(async () => {
    setLoadingVouchers(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/me/vouncher/show`);
      console.log('data', data);
      if (data.success) {
        setVouchers(data.vouchers);
        setOriginalVouchers(data.vouchers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingVouchers(false);
    }
  }, [vouchers, user, user._id]);

  const searchByNameRestaurant = async text => {
    console.log('Text search', text);
    try {
      const newData = originalVouchers.filter(item => {
        console.log(item);
        const itemData = item?.restaurant?.name
          ? item?.restaurant?.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setVouchers(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (textSearch.length > 0) searchByNameRestaurant(textSearch);
    else setVouchers(originalVouchers);
  }, [textSearch]);
  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <View className="flex-1 bg-SECONDARY_WHITE px-5">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="w-full flex-row pt-5">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#000000" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-32 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Vouchers
        </Text>
      </View>
      <SearchComponent
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        voucherSearchStyle={voucherSearchStyle}
      />
      {loadingVouchers ? (
        <Spinner width={'100%'} height={50} />
      ) : (
        <ScrollView>
          {vouchers &&
            vouchers.length > 0 &&
            vouchers.map((voucher, index) => {
              if (voucher.restaurant) {
                return <VoucherItem key={index} item={voucher} index={index} />;
              }
            })}
        </ScrollView>
      )}
    </View>
  );
};

export default VoucherScreen;
