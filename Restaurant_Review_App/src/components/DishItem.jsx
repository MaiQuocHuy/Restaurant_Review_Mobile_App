import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

const DishItem = props => {
  return (
    <View style={{width: '50%', flexDirection: 'row'}}>
      <View className="flex-1 flex-col m-2 rounded-lg">
        <View className="w-full p-2">
          <Image
            source={{
              uri: props?.image?.url,
            }}
            className="w-full h-32 rounded-lg "
          />
        </View>
        <View className="px-4 flex-col">
          {/* Title */}
          <Text className="text-base text-DEFAULT_BLACK font-POPPINS_SEMI_BOLD">
            {props?.nameDish}
          </Text>
          {/* Tags */}
          <Text className="text-sm text-DEFAULT_GREY text-DEFAULT_GRAY font-POPPINS_REGULAR">
            {props?.typeDish}
          </Text>
          {/* Price */}
          <Text className="text-lg text-DEFAULT_YELLOW font-POPPINS_SEMI_BOLD">
            $ {props?.priceDish}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DishItem;
