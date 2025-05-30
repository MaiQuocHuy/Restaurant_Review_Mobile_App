import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {Separator} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import {useContext} from 'react';
import {dataUserGlobalContext} from '../../contexts/dataUserGlobalContext';
import {useEffect} from 'react';
import {BASE_URL} from '../../helpers';

const CreatePostScreen = ({navigation, route}) => {
  const idPost = route.params ? route.params.idPost : null;
  const [textButton, setTextButton] = useState('Create');

  const {posts, setPosts, postsPersonal, setPostsPersonal} = useContext(
    dataUserGlobalContext,
  );

  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
  };

  const handleDeleteModal = () => {
    setVisible(false);
    setPhoto(null);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!photo || !title || !comment) return alert('Please fill all fields');
    try {
      if (textButton === 'Create') {
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('content', comment);
        formdata.append('image', {
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
        });
        const {data} = await axios.post(`${BASE_URL}/post/create`, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('data', data);
        if (data) {
          setPhoto(null);
          setTitle('');
          setComment('');
          setPosts(prevPost => [data, ...prevPost]);
          navigation.goBack();
        }
      } else {
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('content', comment);
        formdata.append('image', {
          uri: photo.uri,
          type: 'image/*',
          name: Math.random().toString(36).substring(2, 8),
        });
        const {data} = await axios.put(
          `${BASE_URL}/update/post/${idPost}`,
          formdata,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (data) {
          setPhoto(null);
          setTitle('');
          setComment('');
          setPostsPersonal(prevPost =>
            prevPost.map(post => (post._id === idPost ? data : post)),
          );
          setPosts(prevPost =>
            prevPost.map(post => (post._id === idPost ? data : post)),
          );
          navigation.navigate('ProfileStack', {screen: 'PostPersonal'});
        }
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      console.log('uri', res[0]); // res.uri is the URI of the selected file
      const image = res[0];
      setPhoto(image);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return;
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    console.log('idPost', idPost, posts);
    if (idPost && posts && posts.length > 0) {
      setTextButton('Edit');
      console.log('idPost', idPost);
      console.log('posts', posts);
      const post = posts?.find(post => post._id === idPost);
      console.log('post', post);
      setTitle(post.title);
      setComment(post.content);
      setPhoto({uri: post.image.url});
    }
  }, []);

  return (
    <View className="flex-1 bg-DEFAULT_WHITE">
      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent />
      <Separator height={StatusBar.currentHeight} />
      <View className="px-5 flex-row items-center justify-between py-3 border-b-2 border-b-LIGHT_GREY">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl pl-5 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          Post
        </Text>
        {loading ? (
          <Spinner width={40} height={40} />
        ) : (
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              className={`text-lg ${
                comment != '' && title != '' && photo
                  ? 'text-DEFAULT_GREEN'
                  : 'text-DEFAULT_GREY'
              } font-POPPINS_MEDIUM`}>
              {textButton}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* <ScrollView> */}
      <View className="flex-row w-full px-5 pt-2 pb-3">
        <TouchableOpacity onPress={handleChoosePhoto}>
          <FontAwesome name="image" size={34} color="#0A8791" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View className="w-full px-2 ">
          <View className="w-full">
            <TextInput
              multiline={true}
              placeholder="Add title"
              className="text-xl  font-POPPINS_REGULAR text-DEFAULT_BLACK px-2 py-4"
              placeholderTextColor={'#C2C2CB'}
              onChangeText={text => setTitle(text)}
              value={title}
            />
          </View>
          <View className="w-full h-auto">
            <TextInput
              multiline={true}
              placeholder="What's on your mind?"
              className="text-lg  font-POPPINS_REGULAR text-DEFAULT_BLACK px-2 py-4"
              placeholderTextColor={'#C2C2CB'}
              onChangeText={text => setComment(text)}
              value={comment}
            />
          </View>
          {photo && (
            <TouchableOpacity onLongPress={() => showDialog()}>
              <View className="w-full items-center justify-center">
                <Image
                  source={{
                    uri: photo?.uri,
                  }}
                  className="w-[96%] h-[40vh] rounded-lg "
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Separator height={20} />
      </ScrollView>
      {/* </ScrollView> */}
      <Dialog.Container visible={visible}>
        <Dialog.Title>Delete photo</Dialog.Title>

        <Dialog.Button label="Cancel" onPress={() => handleCancelModal()} />
        <Dialog.Button label="Delete" onPress={() => handleDeleteModal()} />
      </Dialog.Container>
    </View>
  );
};

export default CreatePostScreen;
