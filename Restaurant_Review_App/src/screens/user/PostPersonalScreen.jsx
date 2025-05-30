import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext} from 'react';
import {Separator} from '../../components';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {UserContext} from '../../contexts/userContext';
import Spinner from '../../components/Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import moment from 'moment';
import {useEffect} from 'react';
import axios from 'axios';
import PostItem from '../../components/PostItem';
import {BASE_URL} from '../../helpers';

const PostPersonalScreen = ({navigation}) => {
  const [loadingPost, setLoadingPost] = useState(false);
  const {posts, setPosts, postsPersonal, setPostsPersonal} = useContext(
    dataUserGlobalContext,
  );
  const {user, setUser} = useContext(UserContext);

  const fetchPosts = async () => {
    setLoadingPost(true);
    try {
      if (posts && posts.length > 0) {
        console.log('Posts', posts);
        const userPosts = posts.filter(post => post.postedBy._id === user._id);
        setPostsPersonal(userPosts);
      } else {
        const {data} = await axios.get(`${BASE_URL}/posts/show`);
        if (data.success) {
          const userPosts = data.posts.filter(
            post => post.postedBy._id === user._id,
          );
          setPosts(data.posts);
          setPostsPersonal(userPosts);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleEdit = id => {
    console.log('Edit');
    navigation.navigate('PostStack', {
      screen: 'CreatePost',
      params: {idPost: id},
    });
  };

  const handleDelete = async id => {
    try {
      const {data} = await axios.delete(`${BASE_URL}/delete/post/${id}`);
      if (data.success) {
        const newPost = posts.filter(post => post._id !== id);
        const newPostPersonal = postsPersonal.filter(post => post._id !== id);
        console.log('New Post', newPost);
        setPostsPersonal(newPostPersonal);
        setPosts(newPost);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleToggleLike = async idPost => {
    try {
      const {data} = await axios.put(`${BASE_URL}/like/post/${idPost}`);

      if (data.success) {
        const updatePosts = postsArray => {
          return postsArray.map(post => {
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
            } else {
              return post;
            }
          });
        };

        setPostsPersonal(updatePosts(postsPersonal));
        setPosts(updatePosts(posts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-xl w-full ml-32 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Post Personal
        </Text>
      </View>
      <ScrollView>
        {loadingPost ? (
          <Spinner width={'100%'} height={'100%'} />
        ) : (
          postsPersonal &&
          user &&
          postsPersonal?.length > 0 &&
          postsPersonal.map((item, index) => (
            <PostItem
              item={item}
              index={index}
              key={index}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              user={user}
              handleToggleLike={handleToggleLike}
              navigate={idPost =>
                navigation.navigate('PostStack', {
                  screen: 'PostComment',
                  params: {postId: idPost},
                })
              }
            />
          ))
        )}

        <Separator height={60} />
      </ScrollView>
    </View>
  );
};

export default PostPersonalScreen;
