import React, { Component } from "react";
import { Text, Animated, View, ImageBackground, Image, Dimensions, AsyncStorage } from "react-native";
import { Button } from "react-native-paper";
import { connect } from "react-redux";

// Local imports
import { removeToken } from "../../redux";
import { images } from "../../constants/images";
import styles from "./styles";

// Global Variables
const BoxAnimated = Animated.createAnimatedComponent(View);

export class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            position: new Animated.Value(0),
        };
    }

    componentDidMount() {
        Animated.parallel([this._positionAnimation(), this._opacityAnimation()]).start();
    }

    _opacityAnimation = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 200,
            delay: 100,
        }).start();
    };

    _positionAnimation = () => {
        Animated.timing(this.state.position, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    _navigateTo = (path) => {
        this.props.navigation.navigate(path);
    };

    render() {
        const { opacity } = this.state;

        const logoTranslate = this.state.position.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 0],
        });

        return (
            <ImageBackground source={images.mainScreenImg} style={{ width: "100%", height: "100%" }}>
                <View style={styles.container}>
                    <BoxAnimated
                        style={[
                        {
                            flex: 1,
                            justifyContent: 'center'
                        },
                        {
                            transform: [
                                {
                                    translateY: logoTranslate,
                                },
                            ],
                        }]}
                    >
                        <View>
                            <Text style={styles.Logo1}>Smart</Text>
                            <Text style={styles.Logo2}>Shopping</Text>
                            <View style={styles.Underline} />
                        </View>
                    </BoxAnimated>
                        
                    <BoxAnimated 
                        style={[{ flex: 0.9, width: "100%" }, { opacity }]}
                    >
                    <View>
                        <View>
                            <Button
                                mode="contained"
                                style={[styles.TextInput, styles.btn2]}
                                theme={{ colors: { primary: color[5] } }}
                                onPress={() => this._navigateTo("Login")}
                            >Login</Button>
                        </View>
                        </View>
                    </BoxAnimated>
                </View>
            </ImageBackground>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeToken: () => dispatch(removeToken()),
    };
};

export default connect(null, mapDispatchToProps)(MainScreen);