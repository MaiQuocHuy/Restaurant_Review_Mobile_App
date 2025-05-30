import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const activeCategoryText =
  'text-base font-POPPINS_BOLD text-DEFAULT_GREEN border-b-4 border-b-DEFAULT_GREEN';
const inActiveCategoryText = 'text-base font-POPPINS_SEMI_BOLD text-[#A3A3A3] ';

const CategoryListItem = ({
  label,
  value,
  activeItem,
  setActiveItem,
  handleChooseType,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Value', value);
        setActiveItem(value);
        handleChooseType(value);
      }}>
      <View className="px-3 py-2  flex  justify-center items-center">
        <Text
          className={
            activeItem == value ? activeCategoryText : inActiveCategoryText
          }>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryListItem;
