import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ForgotPasswordScreen,
  HomeScreen,
  SignInScreen,
  SignUpScreen,
  SplashScreen,
} from '../screens';
import BottomTabs from './user/BottomTabs';
import AdminStackScreen from './ownres/AdminStackScreen';
import OwnresStackScreen from './ownres/AdminStackScreen';
import VerifyResetPasswordScreen from '../screens/VerifyResetPasswordScreen';
import UpdatePassword from '../screens/UpdatePassword';
const Stack = createNativeStackNavigator();
const Navigators = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="VerifyResetPassword"
          component={VerifyResetPasswordScreen}
        />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen name="HomeTabs" component={BottomTabs} />
        <Stack.Screen name="Ownres" component={OwnresStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigators;
