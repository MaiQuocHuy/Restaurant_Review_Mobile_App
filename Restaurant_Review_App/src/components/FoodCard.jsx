import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const FoodCard = () => {
  return (
    <View className="flex flex-row my-2 items-center rounded-lg shadow-md bg-LIGHT_GREY">
      <TouchableOpacity activeOpacity={0.8}>
        <Image
          className="h-24 w-24 m-2 rounded-lg"
          source={{
            uri: 'https://as1.ftcdn.net/v2/jpg/03/24/73/92/1000_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
          }}
        />
      </TouchableOpacity>
      <View className="m-2">
        <TouchableOpacity activeOpacity={0.8}>
          <Text
            className="text-base font-bold text-DEFAULT_BLACK w-48 mb-2"
            numberOfLines={1}>
            ChickenBurgur
          </Text>
          <Text
            className="text-sm text-DEFAULT_GREY w-48 mb-2"
            numberOfLines={2}>
            Sandwich feature twosavery Sandwich feature twosavery
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-DEFAULT_YELLOW font-bold text-lg">$ 100</Text>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
