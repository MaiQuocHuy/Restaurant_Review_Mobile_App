import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';

const Spinner = ({width, height}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
      }}>
      <ActivityIndicator
        size="large"
        style={{
          flex: 1,
          transform: [{scale: 1}],
          justifyContent: 'center',
          alignItems: 'center',
        }}
        color="#0A8791"
      />
    </View>
  );
};

export default Spinner;
