import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useContext, useRef} from 'react';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommentInput from '../../components/CommentInput';
import {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {UserContext} from '../../contexts/userContext';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {BASE_URL} from '../../helpers';

const PostCommentScreen = ({
  navigation,
  route: {
    params: {postId},
  },
}) => {
  const [isFocusComment, setIsFocusComment] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(null);
  const {posts, setPosts, postsPersonal, setPostsPersonal} = useContext(
    dataUserGlobalContext,
  );
  const {user, setUser} = useContext(UserContext);
  const [loadingComment, setLoadingComment] = useState(false);

  const resetInput = () => {
    console.log('Davao');
    setComment('');
  };

  const handleSubmit = async () => {
    console.log('Comment', comment);
    if (!comment) return alert('Please fill all fields');

    setLoadingComment(true);
    try {
      const {data} = await axios.put(`${BASE_URL}/comment/post/${postId}`, {
        comment,
      });
      console.log('Data', data.post);
      console.log('Posts', posts);
      if (data.success) {
        console.log('Davao');
        resetInput();

        // fetchCommentsInPost();
        setComments(data.post.comments);
        setPosts(
          posts?.map(post =>
            post._id === postId
              ? {...post, countComment: (Number(post.countComment) || 0) + 1}
              : post,
          ),
        );

        // if (user._id === data.post.postedBy._id) {
        setPostsPersonal(
          postsPersonal?.map(post =>
            post._id === postId && user._id === post.postedBy._id
              ? {...post, countComment: (Number(post.countComment) || 0) + 1}
              : post,
          ),
        );
        // }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingComment(false);
    }
  };

  const fetchCommentsInPost = async () => {
    try {
      const {data} = await axios.get(`${BASE_URL}/post/${postId}`);
      console.log('Comments', data.post);
      setComments(data.post.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCommentsInPost();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            resetInput();
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-36 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Comments
        </Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{width: '100%'}}
        extraScrollHeight={190}>
        <CommentInput
          setIsFocusComment={setIsFocusComment}
          isFocusComment={isFocusComment}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleSubmit}
          user={user}
          loadingComment={loadingComment}
          setLoadingComment={setLoadingComment}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {comments &&
            comments.length > 0 &&
            comments.map((item, index) => {
              if (item) {
                return (
                  <View className="mx-5 pt-5" key={index}>
                    <View className="w-full flex-row gap-4 ">
                      <Image
                        source={{
                          uri:
                            item?.postedBy?.image?.url ||
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
                        }}
                        className="w-[12vw] h-[6vh] rounded-full"
                      />
                      <View className="w-[80%]">
                        <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM ">
                          {item.postedBy.name}
                        </Text>
                        <Text className="text-base text-DEFAULT_BLACK font-POPPINS_MEDIUM">
                          {item.text}
                        </Text>
                        <Text className="text-base text-DEFAULT_GREY font-POPPINS_REGULAR">
                          {moment(item.created).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }
              return null;
            })}
        </ScrollView>
        <Separator height={20} />
      </KeyboardAwareScrollView>
      {/* </KeyboardAwareScrollView> */}
    </View>
  );
};

export default PostCommentScreen;
