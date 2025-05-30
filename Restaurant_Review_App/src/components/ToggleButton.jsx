import React, {useState} from 'react';
import {TouchableOpacity, Animated, StyleSheet, Easing} from 'react-native';

const containerStyle = (size, save) => ({
  backgroundColor: save ? '#0A8791' : '#C2C2CB',
  height: 44 * size,
  width: 74 * size,
  borderRadius: 32,
  padding: 4 * size,
});

const toggleStyle = (size, animatedValue) => ({
  height: 34 * size,
  width: 34 * size,
  backgroundColor: '#FFFFFF',
  borderRadius: 32,
  transform: [
    {
      translateX: animatedValue,
    },
  ],
});

const ToggleButton = ({size, setSave, save}) => {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  const toggleHandle = () => {
    Animated.timing(animatedValue, {
      toValue: save ? 0 : 32 * size,
      duration: 250,
      easing: Easing.bounce,
      delay: 0,
      useNativeDriver: true,
    }).start();
    setSave(prev => !prev);
  };

  return (
    <TouchableOpacity
      style={containerStyle(size, save)}
      onPress={() => toggleHandle()}
      activeOpacity={0.8}>
      <Animated.View style={toggleStyle(size, animatedValue)} />
    </TouchableOpacity>
  );
};

export default ToggleButton;
