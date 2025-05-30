import React from 'react';
import {View, Text, Button} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {useRef} from 'react';
import {Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';

const TestScreen = () => {
  const bottomSheetRef = useRef(null);

  const handleOpenSheet = () => {
    console.log(bottomSheetRef.current);
    bottomSheetRef.current.close();
  };

  const handleSheetChanges = index => {
    if (index === -1) {
      console.log('BottomSheetModal has been closed');
    } else {
      console.log('BottomSheetModal has been opened');
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          onChange={handleSheetChanges}
          snapPoints={['25%', '50%', '75%']}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>This is the content of the Bottom Sheet</Text>
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default TestScreen;
