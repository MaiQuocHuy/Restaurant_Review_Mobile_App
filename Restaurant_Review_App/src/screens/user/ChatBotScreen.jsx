import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {Separator} from '../../components';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect} from 'react';
import {BASE_URL} from '../../helpers';

const ChatBotScreen = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const getChatbotResponse = async () => {
    try {
      const {data} = await axios.post(`${BASE_URL}/message`, {
        message: inputText,
      });
      if (data.success) return data.response;
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async () => {
    if (inputText.trim().length > 0) {
      setMessages([...messages, {text: inputText, sender: 'user'}]);
      setInputText('');
      Keyboard.dismiss();
      const response = await getChatbotResponse();
      setMessages([
        ...messages,
        {text: inputText, sender: 'user'},
        {text: response, sender: 'chatbot'},
      ]);
    }
  };

  useEffect(() => {
    setMessages([]);
  }, []);

  const renderMessage = ({item}) => {
    console.log(item);
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'user'
            ? styles.userMessageContainer
            : styles.chatbotMessageContainer,
        ]}>
        <View
          style={[
            styles.message,
            item.sender === 'user' ? styles.userMessage : styles.chatbotMessage,
          ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-DEFAULT_WHITE px-4 space-y-3">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#C2C2CB"
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View className="flex h-12 rounded-lg mx-4 mt-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            console.log('Back');
            setInputText('');
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={30} color="#0E122B" />
        </TouchableOpacity>
        <Text className="text-lg w-full ml-36 text-DEFAULT_BLACK font-POPPINS_MEDIUM">
          ChatBot
        </Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={text => setInputText(text)}
          placeholder="Type your message..."
        />
        <Text style={styles.sendButton} onPress={sendMessage}>
          Send
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  chatbotMessageContainer: {
    justifyContent: 'flex-start',
  },
  message: {
    padding: 10,
    maxWidth: '80%',
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    marginLeft: 'auto',
    color: '#000',
  },
  chatbotMessage: {
    backgroundColor: '#E8E8E8',
    color: '#000',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default ChatBotScreen;
