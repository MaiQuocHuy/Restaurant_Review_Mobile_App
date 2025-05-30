import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {Images} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';
import {useState} from 'react';

const DishItemAdmin = ({item, index, handleEdit, handleDelete}) => {
  const [visible, setVisible] = useState(false);
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
    <View style={{width: '50%', flexDirection: 'row'}} key={index}>
      <TouchableWithoutFeedback
        onPress={() => handleEdit(item._id)}
        onLongPress={() => showDialog()}>
        <View className="flex-1 flex-col m-2 rounded-lg">
          <View className="w-full p-2">
            <Image
              source={{
                uri: item.image?.url,
              }}
              className="w-full h-32 rounded-lg "
            />
          </View>
          <View className="px-4 flex-col">
            {/* Title */}
            <Text className="text-base text-DEFAULT_BLACK font-POPPINS_SEMI_BOLD">
              {item.nameDish}
            </Text>
            {/* Tags */}
            <Text className="text-sm text-DEFAULT_GRAY font-POPPINS_REGULAR">
              {item.typeDish}
            </Text>
            {/* Price */}
            <Text className="text-lg text-DEFAULT_YELLOW font-POPPINS_SEMI_BOLD">
              $ {item.priceDish}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Notification</Dialog.Title>
        <Dialog.Description>Delete this dish?</Dialog.Description>
        <Dialog.Button
          label="Delete"
          onPress={() => handleDeleteModal(item._id)}
        />
        <Dialog.Button label="Cancel" onPress={() => handleCancelModal()} />
      </Dialog.Container>
    </View>
  );
};

export default DishItemAdmin;
