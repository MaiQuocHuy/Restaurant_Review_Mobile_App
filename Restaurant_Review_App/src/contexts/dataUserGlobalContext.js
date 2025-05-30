import {useContext} from 'react';
import {useEffect, useState} from 'react';
import {createContext} from 'react';
import {UserContext} from './userContext';

export const dataUserGlobalContext = createContext();

export const DataUserGlobalProvider = ({children}) => {
  const [comments, setComments] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [posts, setPosts] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [postsPersonal, setPostsPersonal] = useState(null);
  return (
    <dataUserGlobalContext.Provider
      value={{
        comments,
        setComments,
        restaurants,
        setRestaurants,
        setPosts,
        posts,
        dishes,
        setDishes,
        postsPersonal,
        setPostsPersonal,
      }}>
      {children}
    </dataUserGlobalContext.Provider>
  );
};
