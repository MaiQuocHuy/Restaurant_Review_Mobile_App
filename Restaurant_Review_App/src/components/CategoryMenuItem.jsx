import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, View} from 'react-native';
import {Images} from '../constants';

export default function CategoryMenuItem({
  name,
  // logo,
  activeCategory,
  setActiveCategory,
}) {
  console.log('Name', name);
  return (
    <TouchableOpacity
      onPress={() => setActiveCategory(name)}
      className="items-center mt-3">
      <Image
        source={Images[name.toUpperCase()]}
        className={`h-7 w-7 ${
          activeCategory === name ? 'opacity-100' : 'opacity-50'
        }`}
      />
      <Text
        className={`text-sm font-POPPINS_MEDIUM text-DEFAULT_WHITE mt-1 ${
          activeCategory === name ? 'opacity-100' : 'opacity-50'
        }`}>
        {name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}
