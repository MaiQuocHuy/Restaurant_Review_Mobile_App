import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useRef} from 'react';
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {useMemo} from 'react';
import {useCallback} from 'react';

const BottomSheetModel = ({handleModal, handleSubmit, ...rest}) => {
  const bottomSheetRef = useRef(null);
  const [starRating, setStarRating] = useState(0);
  const [contentReview, setContenteReview] = useState('');

  const handleSheetChanges = index => {
    if (index === -1) {
      console.log('BottomSheetModal has been closed');
    } else {
      console.log('BottomSheetModal has been opened');
    }
  };
  const handleSheetDismiss = () => {
    handleModal();
  };

  // const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['30%'], []);

  return (
    <GestureHandlerRootView className=" h-[100%] absolute bottom-0 left-0 right-0 z-10">
      <BottomSheetModalProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            onChange={handleSheetChanges}
            onClose={handleSheetDismiss}
            enablePanDownToClose={true}
            keyboardBehavior="interactive"
            snapPoints={snapPoints}>
            <View
              style={{
                width: '100%',
                height: '30',
                paddingHorizontal: 10,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text className="text-left text-lg font-POPPINS_MEDIUM text-DEFAULT_YELLOW">
                  {starRating ? `${starRating}*` : 'Tap to rate'}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => setStarRating(1)}>
                    <Entypo
                      name={starRating >= 1 ? 'star' : 'star-outlined'}
                      size={32}
                      color="#FBA83C"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStarRating(2)}>
                    <Entypo
                      name={starRating >= 2 ? 'star' : 'star-outlined'}
                      size={32}
                      color="#FBA83C"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStarRating(3)}>
                    <Entypo
                      name={starRating >= 3 ? 'star' : 'star-outlined'}
                      size={32}
                      color="#FBA83C"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStarRating(4)}>
                    <Entypo
                      name={starRating >= 4 ? 'star' : 'star-outlined'}
                      size={32}
                      color="#FBA83C"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStarRating(5)}>
                    <Entypo
                      name={starRating >= 5 ? 'star' : 'star-outlined'}
                      size={32}
                      color="#FBA83C"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (starRating != 0 && contentReview != '') {
                    handleSubmit(starRating, contentReview);
                    setContenteReview('');
                    setStarRating(null);
                    handleModal();
                  }
                }}>
                <View className="mr-6">
                  <Ionicons
                    name="send-outline"
                    size={30}
                    color={
                      starRating && contentReview != '' ? '#FBA83C' : '#C2C2CB'
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <BottomSheetTextInput
              style={{
                fontSize: 18,
                paddingHorizontal: 10,
                paddingVertical: 6,
                minHeight: 50,
                color: '#000',
              }}
              placeholder="Comment"
              placeholderTextColor="#C2C2CB"
              autoCompleteType="off"
              onChangeText={text => setContenteReview(text)}
              inputMode="text"
              keyboardType="default"
              multiline={true}
            />
          </BottomSheet>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
export default BottomSheetModel;
