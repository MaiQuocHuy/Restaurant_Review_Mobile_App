import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Separator from './Separator';
import Dialog from 'react-native-dialog';
import {useState} from 'react';

const VoucherItem = ({
  index,
  item,
  handleEdit = () => {},
  handleDelete = () => {},
}) => {
  console.log('VoucherItem', index, item);
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

  const isDateRangeOverlapping = (newStart, newEnd) => {
    try {
      const startDate = new Date(newStart);
      const endDate = new Date(newEnd);
      const now = new Date();
      console.log('Start Date', startDate);
      console.log('End Date', endDate);
      console.log('Now', now);
      if (now >= startDate && now <= endDate) {
        return true; // Thời gian hiện tại nằm trong khoảng thời gian từ startDate đến endDate
      } else {
        return false; // Thời gian hiện tại không nằm trong khoảng thời gian từ startDate đến endDate
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formattedDate = date => {
    const format = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1,
    ).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    return format;
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => handleEdit(item._id)}
      onLongPress={() => showDialog()}>
      <View
        className="w-full bg-SECONDARY_WHITE p-2 rounded-lg mb-5"
        key={index}>
        <View className="flex-row justify-between items-center">
          <Text className="text-xl text-DEFAULT_BLACK font-POPPINS_BOLD">
            {item.code}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
            {item.discount}% Discount
          </Text>
          <View className="flex-row">
            <MaterialIcons
              size={24}
              color={
                isDateRangeOverlapping(item.startDate, item.endDate)
                  ? '#0A8791'
                  : '#F53920'
              }
              name="verified-user"
            />
            <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
              {isDateRangeOverlapping(item.startDate, item.endDate)
                ? 'In Time'
                : 'Out Time'}
            </Text>
          </View>
        </View>
        {item?.restaurant?.name && (
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
              {item?.restaurant?.name}
            </Text>
          </View>
        )}
        <View className="flex-row items-center space-x-3">
          <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
            Start Date:
          </Text>
          <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
            {formattedDate(new Date(item.startDate))}
          </Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
            End Date:
          </Text>
          <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
            {formattedDate(new Date(item.endDate))}
          </Text>
        </View>
        <View className="flex-row mx-5 gap-2">
          <Image
            source={{
              uri: item?.restaurant?.image?.url,
            }}
            className="w-[24vw] h-[10vh] rounded-lg"
          />
          <View className="w-[70%]">
            <Text className="text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
              {item.content}
            </Text>
          </View>
        </View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Notification</Dialog.Title>
          <Dialog.Description>Delete this voucher?</Dialog.Description>
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

export default VoucherItem;
