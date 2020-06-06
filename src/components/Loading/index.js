import React, { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ColorPropType,
} from "react-native";
// import { images } from '../../constants/images';
import color from "../../constants/color";

import styles from "./styles";

export class LoadingScreen extends Component {
  render() {
    return (
      // <View style={this.props.style ? this.props.style : styles.loadingView}>
      <View style={styles.loadingView}>
        <ActivityIndicator size="large" color={color[3]} />
        <Text style={styles.loadingText}>Loading...... </Text>
      </View>
    );
  }
}

export default LoadingScreen;
