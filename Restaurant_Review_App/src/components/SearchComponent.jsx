import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SearchComponent = ({
  textSearch,
  setTextSearch,
  voucherSearchStyle = null,
}) => {
  return (
    <View style={voucherSearchStyle ? voucherSearchStyle : styles.container}>
      <Ionicons name="search-outline" size={20} color="#000" />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#C2C2CB"
        underlineColorAndroid={'transparent'}
        selectionColor="#0E122B"
        value={textSearch}
        onChangeText={text => setTextSearch(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    borderWidth: 1,
    borderColor: '#C2C2CB',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%',
  },
});

export default SearchComponent;
