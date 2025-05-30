import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StatusBar} from 'react-native';
import {Separator} from '../../components';
import axios from 'axios';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import {useContext} from 'react';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {UserContext} from '../../contexts/userContext';
import {BASE_URL} from '../../helpers';

const PostScreen = ({navigation}) => {
  const {posts, setPosts} = useContext(dataUserGlobalContext);
  // const [user, setUser] = useState(null);
  const {user, setUser} = useContext(UserContext);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchPosts = async () => {
    setLoadingPost(true);
    try {
      const {data} = await axios.get(`${BASE_URL}/posts/show`);
      console.log('Posts', data.posts);

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleToggleLike = async idPost => {
    try {
      const {data} = await axios.put(`${BASE_URL}/like/post/${idPost}`);
      console.log(data);

      if (data.success) {
        console.log('Posts', posts);
        const newPost = posts.map(post => {
          if (String(post._id) === String(idPost)) {
            if (data.check) {
              // If data.check is true, add _id to likes array
              return {
                ...post,
                likes: [...post.likes, user._id],
                countLike: (Number(post.countLike) || 0) + 1,
              };
            } else {
              // If data.check is false, remove _id from likes array
              return {
                ...post,
                likes: post.likes.filter(id => id !== user._id),
                countLike: (Number(post.countLike) || 0) - 1,
              };
            }
          } else return post;
        });
        console.log('New Post', newPost);
        setPosts(newPost);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user') fetchPosts();
  }, [user]);

  return (
    <View className="flex-1 bg-SECONDARY_WHITE">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A8791"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex-row justify-between items-center mx-5 py-5 border-b-2 border-DEFAULT_GREY">
        <Text className="text-xl font-POPPINS_MEDIUM text-DEFAULT_BLACK">
          Post Screen
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
          <AntDesign name="pluscircleo" size={28} color="#0A8791" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {loadingPost ? (
          <Spinner width={'100%'} height={'100%'} />
        ) : (
          posts &&
          user &&
          posts.length > 0 &&
          posts.map((item, index) => {
            console.log('Item', item.image);
            if (item) {
              return (
                <View className="mx-5 pt-5 space-y-4" key={index}>
                  <View className="flex-1 flex-row gap-4 ">
                    <Image
                      source={{
                        uri:
                          item?.postedBy?.image?.url ||
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
                      }}
                      className="w-[15vw] h-[8vh] rounded-lg"
                    />
                    <View className="w-full">
                      <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM ">
                        {item.postedBy.name}
                      </Text>
                      <Text className="text-base text-DEFAULT_GREY font-POPPINS_REGULAR">
                        {moment(item.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-POPPINS_MEDIUM text-DEFAULT_BLACK">
                      {item.title}
                    </Text>
                  </View>
                  <View className="flex-1">
                    {/* <MoreInfo text={item.content} linesToTruncate={3} /> */}
                    <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_BLACK">
                      {item.content}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Image
                      source={{
                        uri:
                          item?.image?.url || 'https://via.placeholder.com/150',
                      }}
                      className="w-full h-[24vh] rounded-lg"
                    />
                  </View>
                  <View className="flex-1 flex-row space-x-8 items-center">
                    <View className="flex-row items-center space-x-2">
                      <TouchableOpacity
                        onPress={() => handleToggleLike(item._id)}>
                        <Ionicons
                          name="heart"
                          size={28}
                          color={
                            item.likes.some(id => id == user._id)
                              ? '#0A8791'
                              : '#C2C2CB'
                          }
                        />
                      </TouchableOpacity>
                      <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_GREEN">
                        {item?.countLike !== undefined &&
                        item?.countLike !== null
                          ? item?.countLike
                          : item?.likes?.length}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('PostComment', {
                          postId: item._id,
                        })
                      }>
                      <View className="flex-row items-center space-x-2">
                        <Ionicons name="chatbubble" size={28} color="#0A8791" />
                        <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_GREEN">
                          {item?.countComment !== undefined &&
                          item?.countComment !== null
                            ? item.countComment
                            : item?.comments?.length}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
            return null;
          })
        )}

        <Separator height={80} />
      </ScrollView>
    </View>
  );
};

export default PostScreen;
