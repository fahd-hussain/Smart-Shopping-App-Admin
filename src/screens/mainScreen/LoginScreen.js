import React, { Component } from "react";
import { View, ImageBackground, KeyboardAvoidingView, Alert, Modal } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { connect } from "react-redux";

// Local Imports
import { getToken, removeToken,  fetchUser, fetchCart, fetchShelves, fetchPromotions, fetchStore } from "../../redux";
import styles from "./styles";
import LoadingScreen from "../../components/Loading";
import color from "../../constants/color";
import { images } from "../../constants/images";

export class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            modalVisible: false,
            isLoading: false,
        };
    }

    _sendCred = async () => {
        const { getToken, removeToken, fetchPromotions, fetchStore, fetchUser, fetchCart, fetchShelves } = this.props;

        // const username = "fadi@gmail.com"
        // const username = "ghazi@gmail.com"
        // const password = "123456";
        const { username, password } = this.state;
        
        this.setState({ isLoading: true });
        
        if (username && password) {
            getToken(username, password)
                .then((token) => {
                    this.setState({ isLoading: false, modalVisible: true });
                    fetchUser(token[0])
                        .then((user) => {
                            if ( user[0].admin ){
                                this.setState({ modalVisible: false });
                                fetchPromotions();
                                fetchStore();
                                fetchShelves();
                                this._navigateTo("Application");
                            } 
                            if ( !user[0].admin ){
                                removeToken();
                                this.setState({ modalVisible: false });
                                alert("You are not authorized for this application")
                                
                            }  
                        })
                        .catch((error) => console.warn(error));
                    // fetchCart(token[0]);
                    // fetchLists(token[0]);
                })
                .catch((error) => console.warn(error));
        }
        if (!username || !password) {
            this.setState({ isLoading: false });
            Alert.alert("Login Failed", "Username and/or Password field should not be empty", [
                {
                    itemName: "Cancel",
                    style: "cancel",
                },
            ]);
        }
    };

    _navigateTo = (path) => {
        this.props.navigation.navigate(path);
    };

    render() {
        const { isLoading, username, password } = this.state
        return (
            <ImageBackground
                source={images.mainScreenImg}
                style={{ width: "100%", height: "100%" }}
            >
                <View style={styles.container}>
                    <KeyboardAvoidingView behavior="position">
                        <Text style={styles.Logo1}>Smart</Text>
                        <Text style={styles.Logo2}>Shopping</Text>
                        <View style={styles.Underline} />
                        <Text style={styles.FormText}> Login with Username </Text>
                        <TextInput
                            value={username}
                            placeholder="email"
                            label="Email"
                            mode="outlined"
                            autoCompleteType="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(username) => this.setState({ username })}
                            style={styles.TextInput}
                            theme={{ colors: { primary: color[3] } }}
                            returnKeyType="next"
                            returnKeyLabel="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.password.focus()}}
                        />
                        <TextInput
                            value={password}
                            placeholder="password"
                            label="Password"
                            secureTextEntry={true}
                            mode="outlined"
                            onChangeText={(password) => this.setState({ password })}
                            style={styles.TextInput}
                            theme={{ colors: { primary: color[3] } }}
                            returnKeyType="next"
                            returnKeyLabel="next"
                            ref={(input) => this.password = input}
                        />
                        <View style={styles.rowButtonFlex}>
                            <Button
                                mode="contained"
                                style={[styles.TextInput, styles.btn1]}
                                onPress={() => this._sendCred()}
                                theme={{ colors: { primary: color[1] } }}
                                loading={isLoading}
                            >
                                LOGIN
                            </Button>
                            <Button
                                mode="contained"
                                style={[styles.TextInput, styles.btn2]}
                                onPress={() => this._navigateTo("Signup")}
                                theme={{ colors: { primary: color[3] } }}
                            >
                                SIGNUP
                            </Button>
                        </View>
                        <View style={{ marginVertical: "2.5%" }} />
                    </KeyboardAvoidingView>
                </View>
                <Modal
                    animationType="fade"
                    visible={this.state.modalVisible}
                >
                    <LoadingScreen />
                </Modal>
            </ImageBackground>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getToken: (username, password) => dispatch(getToken(username, password)),
        removeToken: () => dispatch(removeToken()),
        fetchUser: (token) => dispatch(fetchUser(token)),
        fetchStore: () => dispatch(fetchStore()),
        fetchPromotions: () => dispatch(fetchPromotions()),
        fetchCart: (token) => dispatch(fetchCart(token)),
        fetchShelves: () => dispatch(fetchShelves()),
    };
};

export default connect(null, mapDispatchToProps)(LoginScreen);
