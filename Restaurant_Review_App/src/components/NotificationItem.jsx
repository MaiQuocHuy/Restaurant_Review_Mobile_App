import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import moment from 'moment';

const NotificationItem = props => {
  console.log('NotificationItem', props);
  return (
    <View className="flex-1 mx-4 mt-6">
      <TouchableOpacity onPress={() => props.navigate(props.restaurant._id)}>
        <View
          className={`flex-row items-center ${
            props.isLastItem ? '' : 'border-b-2 border-b-DEFAULT_GREY'
          } w-full pb-4`}>
          <Image
            source={{
              uri:
                props?.restaurant?.image?.url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
            }}
            className="w-16 h-16 rounded-full"
          />
          <View className="flex-col flex-1 pl-4">
            <Text className="w-[80%] text-lg text-DEFAULT_BLACK font-POPPINS_MEDIUM">
              {props?.message}
            </Text>
            <Text className="text-base text-DEFAULT_GREY font-POPPINS_REGULAR">
              {moment(props?.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationItem;
