import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import DropdownComponent from '../../components/DropdownComponent';
import {SearchBar, Separator} from '../../components';
import SearchComponent from '../../components/SearchComponent';
import DishItem from '../../components/DishItem';
import {dataTypeDish} from '../../utils/data';
import CategoryListItem from '../../components/CategoryListItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import DishItemAdmin from '../../components/DishItemAdmin';
import {dataOwnresGlobalContext} from '../../contexts/dataOwnresGlobalContext';
import {debounce, set} from 'lodash';
import {useCallback} from 'react';
import {UserContext} from '../../contexts/userContext';
import Spinner from '../../components/Spinner';
import { BASE_URL } from '../../helpers';

const ManageMenuDishScreen = ({navigation}) => {
  const [nameDish, setNameDish] = useState();
  const [typeDish, setTypeDish] = useState();
  const [priceDish, setPriceDish] = useState();
  const {dishes, setDishes, originalDishes, setOriginalDishes} = useContext(
    dataOwnresGlobalContext,
  );
  const [activeItem, setActiveItem] = useState('all');
  const [textSearch, setTextSearch] = useState('');
  const {user, setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  // Get dishes
  const fetchDishes = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `${BASE_URL}/dishes/${activeItem}`,
      );
      if (data.success) {
        console.log('Dishes', data.dishes);
        setDishes(data.dishes);
        setOriginalDishes(data.dishes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Get dish
  useEffect(() => {
    if (user && user.role === 'ownrestaurant') fetchDishes();
  }, [user]);

  const handleEdit = idDish => {
    navigation.navigate('AddDish', {idDish});
  };

  const handleDelete = async idDish => {
    setLoading(true);
    try {
      const {data} = await axios.delete(
        `${BASE_URL}/menu/delete/dish/${idDish}`,
      );
      if (data.success) {
        console.log('Delete', idDish);
        // fetchDishes();
        setDishes(dishes.filter(dish => dish._id !== idDish));
        setOriginalDishes(originalDishes.filter(dish => dish._id !== idDish));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseType = async value => {
    setLoading(true);
    try {
      console.log('Choose', value);
      if (value === 'all') {
        setDishes(originalDishes);
      } else {
        const newData = originalDishes.filter(dish => dish.typeDish === value);
        setDishes(newData);
      }
      // const {data} = await axios.get(
      //   `http://10.0.2.2:8080/api/dishes/${value}`,
      // );
      // if (data.success) {
      //   console.log(data.dishes);
      //   setDishes(data.dishes);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchByNameDish = async text => {
    setLoading(true);
    try {
      console.log('Text search', text);
      // const {data} = await axios.get(
      //   `http://10.0.2.2:8080/api/menu/search/dish/${text}`,
      // );
      // console.log('Log Data', data);
      const newData = originalDishes.filter(dish => {
        const itemData = dish.nameDish
          ? dish.nameDish.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDishes(newData);
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

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerText}>Menu Dish</Text>
          {/* create a button plus at the right screen on the top */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddDish');
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
      <SearchComponent textSearch={textSearch} setTextSearch={setTextSearch} />
      <View>
        <FlatList
          data={dataTypeDish}
          keyExtractor={item => item.label}
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
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}>
          <View className="flex-1 flex flex-row flex-wrap">
            {dishes &&
              dishes.length > 0 &&
              dishes.map((item, index) => {
                if (item) {
                  return (
                    <DishItemAdmin
                      item={item}
                      index={index}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      key={item._id}
                    />
                  );
                }
                return null;
              })}
          </View>
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
    paddingVertical: 12,
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

export default ManageMenuDishScreen;
