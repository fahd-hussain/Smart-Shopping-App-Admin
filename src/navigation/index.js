import { createSwitchNavigator, createAppContainer } from "react-navigation";

import Authentication from './authNavigation'
import AuthLoading from './authLoading'
import AppDrawer from './appNavigation'

const SwitchNavigator = createSwitchNavigator(
    {
        AuthLoading,
        Authentication,
        Application: AppDrawer,
    },
    {
      initialRouteName: "AuthLoading",
    }
  );
  
  const AppContainer = createAppContainer(SwitchNavigator);
  
  export default AppContainer;