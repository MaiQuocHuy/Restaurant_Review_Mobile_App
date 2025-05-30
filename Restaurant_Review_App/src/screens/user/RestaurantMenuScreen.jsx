import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useContext} from 'react';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import DishItem from '../../components/DishItem';
import CategoryListItem from '../../components/CategoryListItem';
import {dataTypeDish} from '../../utils/data';
import axios from 'axios';
import {useEffect} from 'react';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import Spinner from '../../components/Spinner';
import {useCallback} from 'react';
import {debounce, set} from 'lodash';
import {BASE_URL} from '../../helpers';

const RestaurantMenuScreen = ({
  navigation,
  route: {
    params: {restaurantId},
  },
}) => {
  const [textSearch, setTextSearch] = useState('');
  const {dishes, setDishes} = useContext(dataUserGlobalContext);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState('all');
  const [originalDishes, setOriginalDishes] = useState([]);
  const fetchDishes = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `${BASE_URL}/menu/restaurant/${restaurantId}/dishes/${activeItem}`,
      );
      if (data.success) {
        console.log('data', data);
        setDishes(data.dishes);
        setOriginalDishes(data.dishes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDishes();
  }, []);

  const searchByNameDish = async text => {
    setLoading(true);
    try {
      const newData = originalDishes.filter(dish => {
        const itemData = dish.nameDish
          ? dish.nameDish.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDishes(newData);
      // console.log('Text search', text);
      // const {data} = await axios.get(
      //   `http://10.0.2.2:8080/api/menu/search/dish/${text}`,
      // );
      // console.log('Log Data', data);
      // setDishes(data.dishes[0].items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textSearch.length > 0) {
      searchByNameDish(textSearch);
    } else {
      setDishes(originalDishes);
    }
  }, [textSearch]);

  const handleChooseType = async value => {
    console.log('Choose', value);
    setLoading(true);
    try {
      const {data} = await axios.get(
        `${BASE_URL}/menu/restaurant/${restaurantId}/dishes/${value}`,
      );
      if (data.success) {
        console.log('ChooseType', data.dishes);
        setDishes(data.dishes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetInput = () => {
    setTextSearch('');
  };
  return (
    <View classname="flex-1 bg-SECONDARY_WHITE">
      <StatusBar
        barStyle="light-content"
        className="bg-DEFAULT_GREY"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            resetInput();
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-40 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Menu
        </Text>
      </View>
      <View className="h-12 rounded-lg mx-4 mt-5 justify-center items-center bg-LIGHT_GREY2">
        <View className="flex-row items-center gap-2 ml-2">
          <Ionicons name="search-outline" size={25} color="#C2C2CB" />
          <TextInput
            className="text-xl text-DEFAULT_BLACK flex-1"
            placeholderTextColor="#0E122B"
            placeholder="Search..."
            underlineColorAndroid="transparent"
            selectionColor="#0E122B"
            value={textSearch}
            onChangeText={text => setTextSearch(text)}
          />
        </View>
      </View>
      <View className="m-1">
        <FlatList
          data={dataTypeDish}
          keyExtractor={item => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Separator width={15} />}
          ListFooterComponent={() => <Separator width={20} />}
          ItemSeparatorComponent={() => <Separator width={10} />}
          renderItem={({item}) => {
            return (
              <CategoryListItem
                {...item}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                handleChooseType={handleChooseType}
              />
            );
          }}
        />
      </View>
      {loading ? (
        <Spinner width={'100%'} height={'40%'} />
      ) : (
        <ScrollView>
          {/* <View className="flex-row flex-wrap"> */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
              alignItems: 'flex-start',
            }}>
            {dishes &&
              dishes.map((item, index) => {
                return <DishItem key={index} {...item} />;
              })}
          </View>

          {/* </View> */}
          <Separator height={320} />
          {/* </View> */}
        </ScrollView>
      )}
    </View>
  );
};

export default RestaurantMenuScreen;
