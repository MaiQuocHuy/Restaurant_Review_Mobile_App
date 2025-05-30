import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataWithExpiration = async (key, value) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Add one week
    const item = {
      value: value,
      expiration: expirationDate.getTime(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

export const getDataWithExpiration = async key => {
  try {
    const jsonString = await AsyncStorage.getItem(key);
    if (jsonString !== null) {
      const item = JSON.parse(jsonString);
      if (item.expiration === null || item.expiration >= new Date().getTime()) {
        return item.value;
      } else {
        // Remove expired item
        await removeTokenInStorage(key);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const removeTokenInStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
