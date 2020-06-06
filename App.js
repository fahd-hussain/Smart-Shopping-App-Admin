import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
// Local Imports
import AppContainer from "./src/navigation";
import ConfigureStore from "./src/redux/configureStore";
import LoadingScreen from "./src/components/Loading";
const { persistor, store } = ConfigureStore();

import Temp from './temp/temp';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen />}
        persistor={persistor}
      >
        <StatusBar hidden={true} />
        <AppContainer />
        {/* <Temp /> */}
      </PersistGate>
    </Provider>
  );
}
