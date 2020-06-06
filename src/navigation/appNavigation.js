import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "native-base";

//Local Imports
import color from "../constants/color";
//Screens
import HomeScreen from "../screens/appScreens/HomeScreen";
import PromotionDetailScreen from '../screens/appScreens/HomeScreen/PromotionDetailScreen';
import AddPromotionScreen from '../screens/appScreens/HomeScreen/AddPromotionScreen';
import EditPromotionScreen from '../screens/appScreens/HomeScreen/EditPromotionScreen'

import ShelfScreen from "../screens/appScreens/ShelfScreen";
import ShelfShowScreen from "../screens/appScreens/ShelfScreen/ShelfDetailScreen";
import CreateShelfScreen from "../screens/appScreens/ShelfScreen/CreateShelfScreen";
import EditShelfScreen from "../screens/appScreens/ShelfScreen/EditShelfScreen";

import StoreScreen from "../screens/appScreens/StoreScreen";
import StoreDetailScreen from "../screens/appScreens/StoreScreen/StoreDetailScreen";
import CreateStoreScreen from "../screens/appScreens/StoreScreen/CreateStoreScreen";
import EditStoreScreen from "../screens/appScreens/StoreScreen/EditStoreScreen";

import SideMenu from "../screens/appScreens/SideMenu";
import BarCodeScannerScreen from "../screens/appScreens/ScannerScreen";
import ProfileScreen from "../screens/appScreens/ProfileScreen";
import PurchaseHistoryScreen from "../screens/appScreens/PurchaseHistoryScreen";
import PurchaseHistoryDetailScreen from "../screens/appScreens/PurchaseHistoryScreen/PurchaseHistoryDetailScreen";
import ComparePurchaseHistoryScreen from "../screens/appScreens/PurchaseHistoryScreen/ComparePurchaseHistory";

const optionsTabs = {
    headerShown: false,
};

// Stack Navigators
const HomeStackNavigator = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                headerTitle: "Home"
            }
        },
        AddPromotion: {
            screen: AddPromotionScreen,
            navigationOptions: {
                headerTitle: "Add Promotion",
            },
        },
        PromotionDetail: {
            screen: PromotionDetailScreen,
            navigationOptions: {
                headerTitle: "Promotion Detail",
            },
        },
        EditPromotion: {
            screen: EditPromotionScreen,
            navigationOptions: {
                headerTitle: "Edit Promotion",
            },
        },
    },
    {
        initialRouteName: "Home",
    },
);
const ShelfStackNavigator = createStackNavigator(
    {
        Shelf: {
            screen: ShelfScreen,
            navigationOptions: {
                headerTitle: "Shelves"
            }
        },
        CreateShelf: {
            screen: CreateShelfScreen,
            navigationOptions: {
                headerTitle: "Add Shelf",
            },
        },
        ShelfShow: {
            screen: ShelfShowScreen,
            navigationOptions: {
                headerTitle: "Shelf Details",
            },
        },
        EditShelf: {
            screen: EditShelfScreen,
            navigationOptions: {
                headerTitle: "Edit Shelf",
            },
        },
    },
    {
        initialRouteName: "Shelf",
    },
);
const StoreStackNavigator = createStackNavigator(
    {
        Store: {
            screen: StoreScreen,
            navigationOptions: {
                headerTitle: "Products"
            }
        },
        CreateStore: {
            screen: CreateStoreScreen,
            navigationOptions: {
                headerTitle: "Add To Product",
            },
        },
        StoreDetail: {
            screen: StoreDetailScreen,
            navigationOptions: {
                headerTitle: "Product Details",
            },
        },
        EditStore: {
            screen: EditStoreScreen,
            navigationOptions: {
                headerTitle: "Edit Product",
            },
        },
    },
    {
        initialRouteName: "Store",
    },
);
const BarcodeScannerStackNavigator = createStackNavigator(
    {
        BarcodeScanner: {
            screen: BarCodeScannerScreen,
            navigationOptions: {
                headerTitle: "Scanner"
            }
        },
    },
    {
        initialRouteName: "BarcodeScanner",
    },
);
const ProfileStackNavigator = createStackNavigator(
    {
        Profile: {
            screen: ProfileScreen,
            navigationOptions: optionsTabs,
        },
    },
    {
        initialRouteName: "Profile",
    },
);
const PurchaseHistoryStackNavigator = createStackNavigator(
    {
        PurchaseHistory: {
            screen: PurchaseHistoryScreen,
            navigationOptions: ({ navigation }) => ({
                headerRight: () => (
                    <Icon
                        style={{ paddingRight: 15 }}
                        type="FontAwesome"
                        name="home"
                        onPress={() => navigation.navigate("Home")}
                    />
                ),
            }),
        },
        PurchaseHistoryDetail: {
            screen: PurchaseHistoryDetailScreen,
            navigationOptions: {
                headerTitle: "Purchase History Details",
            },
        },
        ComparePurchaseHistory: {
            screen: ComparePurchaseHistoryScreen,
            navigationOptions: {
                headerTitle: "Compare Purchase History",
            },
        },
    },
    {
        initialRouteName: "PurchaseHistory",
    },
);

// Tab Navigator
const AppTabNavigator = createBottomTabNavigator(
    {
        HomeTab: {
            screen: HomeStackNavigator,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: () => <Icon type="FontAwesome" name="home" style={{ color: color[5] }} />,
            },
        },
        ShelfTab: {
            screen: ShelfStackNavigator,
            navigationOptions: {
                tabBarLabel: "Shelf",
                tabBarIcon: () => <Icon type="FontAwesome" name="edit" style={{ color: color[5] }} />,
            },
        },
        StoreTab: {
            screen: StoreStackNavigator,
            navigationOptions: {
                tabBarLabel: "Store",
                tabBarIcon: () => <Icon type="FontAwesome" name="home" style={{ color: color[5] }} />,
            },
        },
        BarcodeScanner: {
            screen: BarcodeScannerStackNavigator,
            navigationOptions: {
                tabBarLabel: "Barcode",
                tabBarIcon: () => <Icon type="FontAwesome" name="barcode" style={{ color: color[5] }} />,
            },
        },
    },
    {
        initialRouteName: "HomeTab",
        activeColor: color[3],
        inactiveColor: color[1],
        shifting: true,
        barStyle: {
            backgroundColor: color[5],
        },
    },
);

// App Stack Navigator
const MainStackNavigator = createStackNavigator(
    {
        Home: {
            screen: AppTabNavigator,
            navigationOptions: optionsTabs,
        },
        Profile: {
            screen: ProfileStackNavigator,
            navigationOptions: {
                headerTitle: "Profile",
            },
        },
        PurchaseHistory: {
            screen: PurchaseHistoryStackNavigator,
            navigationOptions: optionsTabs,
        },
    },
    {
        initialRouteName: "Home",
    },
);

// App Drawer
const AppDrawer = createDrawerNavigator(
    {
        Drawer: MainStackNavigator,
    },
    {
        contentComponent: SideMenu,
        drawerWidth: (Dimensions.get("window").width * 3) / 4,
    },
);

export default AppDrawer;
