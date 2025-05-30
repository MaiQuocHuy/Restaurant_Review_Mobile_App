import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostScreen from '../../screens/user/PostScreen';
import PostCommentScreen from '../../screens/user/PostCommentScreen';
import {useLayoutEffect} from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Display} from '../../utils';
import CreatePostScreen from '../../screens/user/CreatePostScreen';

const PostStack = createNativeStackNavigator();
const originalTabBarStyle = {
  position: 'absolute',
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: Display.setHeight(8),
  backgroundColor: '#fff',
  borderTopWidth: 0,
};
const PostStackScreen = ({navigation, route}) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'PostComment') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else if (routeName === 'CreatePost') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({
        tabBarStyle: originalTabBarStyle,
      });
    }
  }, [navigation, route]);
  return (
    <PostStack.Navigator screenOptions={{headerShown: false}}>
      <PostStack.Screen name="Post" component={PostScreen} />
      <PostStack.Screen name="PostComment" component={PostCommentScreen} />
      <PostStack.Screen name="CreatePost" component={CreatePostScreen} />
    </PostStack.Navigator>
  );
};

export default PostStackScreen;
