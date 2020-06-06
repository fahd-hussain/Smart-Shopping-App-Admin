import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";

import LoadingScreen from "../components/Loading";

export class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      error: "",
    };
  }

  componentDidMount() {
    if (!this.props.token.token) {
      this.props.navigation.navigate("Authentication");
    } else {
      this.props.navigation.navigate("Application");
    }
  }

  render() {
    return <LoadingScreen />;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      fetchPromotions: () => dispatch(fetchPromotions()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
