import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from './Spinner';

const CommentInput = ({
  isFocusComment,
  setIsFocusComment,
  comment,
  setComment,
  handleSubmit,
  user,
  loadingComment,
  setLoadingComment,
}) => {
  return (
    <View className="w-[90%] mx-5 my-6">
      <View className="w-full flex-row space-x-2 items-center">
        <Image
          source={{
            uri:
              user?.image?.url ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/480px-User-avatar.svg.png',
          }}
          className="w-[12vw] h-[6vh] rounded-full"
        />
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#C2C2CB"
          className={`flex-1 text-base text-DEFAULT_BLACK font-POPPINS_REGULAR border ${
            isFocusComment ? 'border-DEFAULT_GREEN' : 'border-DEFAULT_GREY'
          } rounded-xl pl-2 pr-10`}
          multiline={true}
          onBlur={() => setIsFocusComment(false)}
          onFocus={() => setIsFocusComment(true)}
          onChangeText={text => {
            setComment(text);
          }}
          value={comment}
        />
        {loadingComment ? (
          <View style={{height: 30, width: 30}}>
            <Spinner width={40} height={40} />
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.7} onPress={handleSubmit}>
            <FontAwesome
              name="send-o"
              size={30}
              color={comment != '' ? '#0A8791' : '#C2C2CB'}
              className={styles.sendIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sendIcon: {
    height: 30,
    width: 30,
  },
});
export default CommentInput;
