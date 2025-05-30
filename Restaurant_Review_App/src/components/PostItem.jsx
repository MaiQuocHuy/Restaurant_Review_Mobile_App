import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import Dialog from 'react-native-dialog';
import {useState} from 'react';
import {dataUserGlobalContext} from '../contexts/dataUserGlobalContext';
import {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PostItem = ({
  item,
  index,
  handleEdit,
  handleDelete,
  user,
  handleToggleLike,
  navigate,
}) => {
  const [visible, setVisible] = useState(false);
  console.log('PostItem', index, item.likes);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
  };

  const handleDeleteModal = id => {
    // handleDelete();
    handleDelete(id);
    setVisible(false);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => handleEdit(item._id)}
      onLongPress={() => showDialog()}>
      <View className="mx-5 pt-5 space-y-4">
        <View className="flex-1 flex-row gap-4 ">
          <Image
            source={{
              uri:
                item.postedBy.image.url ||
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
              uri: item.image.url,
            }}
            className="w-full h-[24vh] rounded-lg"
          />
        </View>
        <View className="flex-1 flex-row space-x-8 items-center">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => handleToggleLike(item._id)}>
              <Ionicons
                name="heart"
                size={28}
                color={
                  item.likes.some(id => id == user._id) ? '#0A8791' : '#C2C2CB'
                }
              />
            </TouchableOpacity>
            <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_GREEN">
              {item.countLike !== undefined && item.countLike !== null
                ? item.countLike
                : item?.likes?.length}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigate(item._id)}>
            <View className="flex-row items-center space-x-2">
              <Ionicons name="chatbubble" size={28} color="#0A8791" />
              <Text className="text-base font-POPPINS_REGULAR text-DEFAULT_GREEN">
                {item.countComment !== undefined && item.countComment !== null
                  ? item.countComment
                  : item?.comments?.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Ionicons />
        <Dialog.Container visible={visible}>
          <Dialog.Title>Notification</Dialog.Title>
          <Dialog.Description>Delete this post?</Dialog.Description>
          <Dialog.Button
            label="Delete"
            onPress={() => handleDeleteModal(item._id)}
          />
          <Dialog.Button label="Cancel" onPress={() => handleCancelModal()} />
        </Dialog.Container>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostItem;
