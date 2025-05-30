import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import {Separator} from '../../components';
import DatePicker from 'react-native-date-picker';
import {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../../components/Spinner';
import {useContext} from 'react';
import {dataOwnresGlobalContext} from '../../contexts/dataOwnresGlobalContext';
import {useEffect} from 'react';
import {BASE_URL} from '../../helpers';
import axios from 'axios';

const AddVoucherScreen = ({navigation, route}) => {
  const idVoucher = route.params ? route.params.idVoucher : null;

  const [textButton, setTextButton] = useState('Create');

  const [startTime, setStartTime] = useState(false);

  const [endTime, setEndTime] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFocusName, setIsFocusName] = useState(false);
  const [isFocusDiscount, setIsFocusDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  // value
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [content, setContent] = useState('');
  const [discount, setDiscount] = useState('');
  const {vouchers, setVouchers} = useContext(dataOwnresGlobalContext);

  const resetInput = () => {
    setContent('');
    setDiscount('');
    setStartValue('');
    setEndValue('');
  };

  const isDateRangeOverlap = (newStart, newEnd) => {
    const filteredVouchers = vouchers.filter(
      voucher => voucher._id !== idVoucher,
    );

    if (filteredVouchers.length === 0) return false;

    return filteredVouchers.some(voucher => {
      const start = new Date(voucher.startDate);
      const end = new Date(voucher.endDate);

      return (
        (newStart >= start && newStart <= end) ||
        (newEnd >= start && newEnd <= end) ||
        (newStart <= start && newEnd >= end)
      );
    });
  };

  const handleSubmit = async () => {
    if (!content || !discount || !startValue || !endValue) {
      alert('Please fill all the fields');
      return;
    }
    if (new Date(startValue) >= new Date(endValue)) {
      alert('Start date must be before end date ');
      return;
    }

    if (isDateRangeOverlap(new Date(startValue), new Date(endValue))) {
      alert('Date range is overlap');
      return;
    }
    console.log('Submit');
    console.log('Content', content);
    console.log('Discount', discount);
    console.log('Start', startValue);
    console.log('End', endValue);
    setLoading(true);
    try {
      if (textButton === 'Create') {
        const {data} = await axios.post(`${BASE_URL}/vouncher/create`, {
          content,
          discount,
          startDate: startValue,
          endDate: endValue,
        });
        console.log('Data', data);
        if (data.success) {
          resetInput();
          setVouchers(prevVoucher => [...prevVoucher, data.data]);
          navigation.navigate('Vouchers');
        }
      } else {
        const {data} = await axios.put(
          `${BASE_URL}/vouncher/update/${idVoucher}`,
          {
            content,
            discount,
            startDate: startValue,
            endDate: endValue,
          },
        );
        console.log('Voucher', data.data);
        if (data.success) {
          resetInput();
          setVouchers(prevVoucher =>
            prevVoucher.map(voucher =>
              voucher._id === idVoucher ? data.data : voucher,
            ),
          );
          navigation.navigate('Vouchers');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLabel = title => {
    console.log('Label', title);
    return <Text style={styles.label}>{title}</Text>;
  };

  useEffect(() => {
    if (idVoucher) {
      setTextButton('Edit');
      const voucher = vouchers.find(voucher => voucher._id === idVoucher);
      console.log('Voucher', voucher);
      setContent(voucher.content);
      setDiscount(voucher.discount.toString());
      setStartValue(parseDate(voucher.startDate));
      setEndValue(parseDate(voucher.endDate));
    }
  }, []);

  const parseDate = params => {
    const date = new Date(params);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };
  return (
    <View className="flex-1 bg-DEFAULT_WHITE px-5">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />

      <View className="w-full flex-row py-5">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-28 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Vouchers
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
        }}>
        <Text style={styles.inputTitle}>Content (*)</Text>
        {isFocusName && renderLabel('Content (*)')}
        <TextInput
          style={[styles.inputText, isFocusName && {borderColor: '#0A8791'}]}
          placeholder="Content..."
          placeholderTextColor="#C2C2CB"
          autoCapitalize="none"
          value={content}
          onFocus={() => setIsFocusName(true)}
          onBlur={() => setIsFocusName(false)}
          onChangeText={text => {
            setContent(text);
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
        }}>
        <Text style={styles.inputTitle}>Discount (*)</Text>
        {isFocusDiscount && renderLabel('Discount (*)')}
        <TextInput
          style={[styles.inputText, isFocusName && {borderColor: '#0A8791'}]}
          placeholder="Discount..."
          placeholderTextColor="#C2C2CB"
          autoCapitalize="none"
          value={discount}
          onFocus={() => setIsFocusDiscount(true)}
          onBlur={() => setIsFocusDiscount(false)}
          onChangeText={text => {
            setDiscount(text);
          }}
          keyboardType="number-pad"
        />
      </View>
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
        }}>
        <TouchableOpacity onPress={() => setStartTime(true)}>
          <Text style={{fontSize: 18, color: '#000', fontWeight: '600'}}>
            Start date active voucher
          </Text>
        </TouchableOpacity>
        {startValue && (
          <View className="items-center justify-center ">
            <Text style={styles.timeText}>{startValue}</Text>
          </View>
        )}
      </View>
      <View style={{width: '100%', paddingBottom: 20}}>
        <TouchableOpacity onPress={() => setEndTime(true)}>
          <Text style={{fontSize: 18, color: '#000', fontWeight: '600'}}>
            End date active voucher
          </Text>
        </TouchableOpacity>
        {endValue && (
          <View className="items-center justify-center ">
            <Text style={styles.timeText}>{endValue}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => handleSubmit()}>
        <View
          className={`items-center justify-center ${
            loading ? 'bg-DEFAULT_WHITE' : 'bg-DEFAULT_GREEN'
          }  p-4 rounded-lg`}>
          {loading ? (
            <Spinner width={'100%'} height={50} />
          ) : (
            <Text className="text-lg font-POPPINS_MEDIUM text-DEFAULT_WHITE">
              {textButton}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {startTime && (
        <DatePicker
          modal
          mode="date"
          open={startTime}
          date={startDate}
          onConfirm={date => {
            setStartTime(false);
            const formattedDate = `${date.getFullYear()}-${String(
              date.getMonth() + 1,
            ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            setStartValue(formattedDate);
          }}
          onCancel={() => {
            setStartTime(false);
          }}
        />
      )}
      {endTime && (
        <DatePicker
          modal
          mode="date"
          open={endTime}
          date={endDate}
          onConfirm={date => {
            setEndTime(false);
            const formattedDate = `${date.getFullYear()}-${String(
              date.getMonth() + 1,
            ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            setEndValue(formattedDate);
            console.log('EndDate', date);
          }}
          onCancel={() => {
            setEndTime(false);
          }}
        />
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
    flexDirection: 'row',
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
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 26,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#0A8791',
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
  timeText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#0A8791',
    borderRadius: 6,
    borderBottomWidth: 4,
    borderBottomColor: '#0A8791',
    padding: 10,
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

export default AddVoucherScreen;
