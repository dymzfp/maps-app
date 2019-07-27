import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

// screen
import HomeScreen from '../screens/Home';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp'; 
import ChatScreen from '../screens/Chat';
import ChatListScreen from '../screens/ChatList';

const Auth = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      header: null
    },
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null
    },
  }
});

const LogScreen = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  ChatList: {
    screen: ChatListScreen
  },
  Chat: {
    screen: ChatScreen
  },
}, {headerMode: 'none'} );

const AppNavigator = createStackNavigator({
  Auth: {
    screen: Auth
  },
  LogScreen: {
    screen: LogScreen
  },
}, {headerMode: 'none'});

export default createAppContainer(AppNavigator);
