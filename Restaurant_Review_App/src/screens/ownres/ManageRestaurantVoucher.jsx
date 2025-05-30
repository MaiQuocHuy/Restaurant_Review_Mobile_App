import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Separator} from '../../components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import VoucherItem from '../../components/VoucherItem';
import Spinner from '../../components/Spinner';
import {dataOwnresGlobalContext} from '../../contexts/dataOwnresGlobalContext';
import {UserContext} from '../../contexts/userContext';
import {BASE_URL} from '../../helpers';
const ManageRestaurantVoucher = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {vouchers, setVouchers} = useContext(dataOwnresGlobalContext);
  const {user, setUser} = useContext(UserContext);

  const handleEdit = id => {
    console.log(id);
    navigation.navigate('AddVoucher', {idVoucher: id});
  };

  const handleDelete = async id => {
    try {
      const {data} = await axios.delete(`${BASE_URL}/vouncher/delete/${id}`);
      if (data.success) {
        setVouchers(vouchers.filter(voucher => voucher._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get(`${BASE_URL}/restaurant/vouncher/show`);
      if (data.success) {
        console.log('Data', data.data);
        setVouchers(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && user.role === 'ownrestaurant') fetchVouchers();
  }, [user]);
  return (
    <View className="flex-1  bg-DEFAULT_WHITE px-5">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.headerText}>Vouchers</Text>
          {/* create a button plus at the right screen on the top */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddVoucher');
            }}
            activeOpacity={0.4}>
            <View
              style={{
                position: 'absolute',
                right: -120,
                top: 0,
              }}>
              <AntDesign name="pluscircleo" size={32} color="#0E122B" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <Spinner width="100%" height="80%" />
      ) : (
        <ScrollView>
          {vouchers &&
            vouchers.length > 0 &&
            vouchers.map((item, index) => (
              <VoucherItem
                index={index}
                item={item}
                handleEdit={handleEdit}
                key={item._id}
                handleDelete={handleDelete}
              />
            ))}
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
    paddingVertical: 16,
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
  inputFile: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#0E122B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C2C2CB',
    padding: 10,
  },
  scrollcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  itemContainer: {
    width: '50%', // 50% -> 2 columns | 33% -> 3 columns | 25% -> 4 columns
    height: '100px',
  },
  item: {
    padding: '8px',
    margin: '8px',
    backgroundColor: '#EEEEEE',
    height: 'calc(100% - 8px)',
  },
});

export default ManageRestaurantVoucher;
