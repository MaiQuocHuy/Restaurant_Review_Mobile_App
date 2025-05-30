import {useState} from 'react';
import {createContext} from 'react';

export const dataOwnresGlobalContext = createContext();
export const DataOwnresGlobalProvider = ({children}) => {
  const [comments, setComments] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [vouchers, setVouchers] = useState(null);
  const [originalDishes, setOriginalDishes] = useState([]);
  return (
    <dataOwnresGlobalContext.Provider
      value={{
        comments,
        setComments,
        restaurant,
        setRestaurant,
        dishes,
        setDishes,
        vouchers,
        setVouchers,
        originalDishes,
        setOriginalDishes,
      }}>
      {children}
    </dataOwnresGlobalContext.Provider>
  );
};
