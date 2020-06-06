import React from 'react'
import { createStackNavigator } from "react-navigation-stack";
// import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from 'native-base'

// Local Import
import LoginScreen from "../screens/mainScreen/LoginScreen";
// import SignupScreen from "../screens/mainScreen/SignupScreen";
import MainScreen from "../screens/mainScreen/MainScreen";
import color from '../constants/color';

const headerOption = {
    headerShown: false,
};

// const Login_Signup = createBottomTabNavigator({
//     Login: {
//         screen: LoginScreen,
//         navigationOptions: {
//             tabBarLabel: "Login",
//             tabBarIcon: () => <Icon type="FontAwesome" name="sign-in" style={{ color: color[3] }} />,
//         },
//         tabBarOptions: {
//           activeTintColor: color[3],
//           labelStyle: {
//             fontSize: 12,
//           },
//         }
//     },
//     Signup: {
//         screen: SignupScreen,
//         navigationOptions: {
//             tabBarLabel: "Register",
//             tabBarIcon: () => <Icon type="FontAwesome" name="user-plus" style={{ color: color[3] }} />,
//         },
//     },
// });

const options = {
    headerTitle: "",
};

const Authentication = createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: options,
        },
        Main: {
            screen: MainScreen,
            navigationOptions: headerOption,
        },
    },
    {
        initialRouteName: "Main",
    },
);

export default Authentication;
