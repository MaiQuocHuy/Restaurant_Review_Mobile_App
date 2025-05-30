import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const MoreLessComponent = ({truncatedText, fullText}) => {
  const [more, setMore] = React.useState(false);
  return (
    <Text className="text-DEFAULT_BLACK font-POPPINS_REGULAR text-base">
      {!more ? `${truncatedText}...` : fullText}
      <TouchableOpacity onPress={() => setMore(!more)}>
        <Text className="text-sm text-DEFAULT_GREEN font-POPPINS_REGULAR">
          {more ? 'less' : 'more'}
        </Text>
      </TouchableOpacity>
    </Text>
  );
};

export default MoreLessComponent;
