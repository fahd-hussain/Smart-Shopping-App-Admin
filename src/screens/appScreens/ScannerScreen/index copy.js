import React, { Component } from "react";
import { StyleSheet, Alert, Modal, TextInput } from "react-native";
import { View, Text, Card, CardItem, Right, Left, Icon } from "native-base";
import { Button } from "react-native-paper";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import GestureRecognizer from "react-native-swipe-gestures";
import { connect } from "react-redux";
import axios from "axios";

// Local Imports
import styles from "./styles";
import { updateCart } from "../../../redux";
import baseUrl from "../../../constants/baseUrl";
import LoadingScreen from "../../../components/Loading";
import { not } from "react-native-reanimated";

class BarCodeScannerScreen extends Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
        Cart: this.props.cart.cart,
        config: {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
        },
        detailModal: false,
        isLoading: false,
        data: {},
    };

    componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" });
    };

    incrementCount = () => {
        const temp = this.state.data;
        temp.quantity += 1;
        temp.totalPrice = temp.price * temp.quantity;
        this.setState(
            (prevState) => {
                let data = prevState.data;
                return { data: data };
            },
            () => this.props.updateCart(this.state.data),
        );
    };

    decrementCount = () => {
        const temp = this.state.data;
        if (temp.quantity > 1) {
            temp.quantity -= 1;
            temp.totalPrice = temp.price * temp.quantity;

            this.setState(
                (prevState) => {
                    let data = prevState.data;
                    return { data: data };
                },
                () => this.props.updateCart(this.state.data),
            );
        }
    };

    _setCount = (value) => {
        const newValue = parseInt(value, 10);
        const temp = this.state.data;

        if (newValue <= 0) return;

        temp.quantity = value;
        temp.totalPrice = temp.price * temp.quantity;
        this.setState(
            (prevState) => {
                let data = prevState.data;
                return { data: data };
            },
            () => this.props.updateCart(this.state.data),
        );
    };

    onSwipeRight = () => {
        this.props.navigation.navigate("List");
    };

    onSwipeLeft = () => {
        this.props.navigation.navigate("Map");
    };

    render() {
        const { hasCameraPermission, scanned, detailModal, data, isLoading } = this.state;
        if (hasCameraPermission === null) {
            return (
                <View style={styles.container}>
                    <Text>Requesting for camera permission</Text>
                </View>
            );
        }
        if (hasCameraPermission === false) {
            return (
                <View style={styles.container}>
                    <Text>No access to camera</Text>
                </View>
            );
        }
        return (
            <GestureRecognizer
                onSwipeLeft={this.onSwipeLeft}
                onSwipeRight={this.onSwipeRight}
                config={this.state.config}
                style={styles.container}
            >
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFill}
                />
                {!isLoading ? (
                    <Modal
                        visible={detailModal}
                        onDismiss={() => this.setState({ detailModal: false })}
                        onRequestClose={() => this.setState({ detailModal: false })}
                        animationType={"fade"}
                    >
                        {!this._isEmpty(data) ? (
                            <View style={[{ paddingBottom: 10, justifyContent: 'center', flex: 1 }]}>
                                <Card style={{ paddingHorizontal: 10 }}>
                                    <CardItem header>
                                        <Left>
                                            <Text style={styles.listItem}>{data.name}</Text>
                                        </Left>
                                        <Right>
                                            <Text>{data.price}</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem bordered>
                                        <Left>
                                            <Text style={styles.listItem}>{data.totalPrice}</Text>
                                        </Left>
                                        <Right>
                                            <View style={{ flexDirection: "row" }}>
                                                <Button
                                                    style={{ backgroundColor: color[3], width: 10 }}
                                                    color={color[5]}
                                                    onPress={() => this.decrementCount()}
                                                >
                                                    -
                                                </Button>
                                                <TextInput
                                                    value={String(data.quantity)}
                                                    onChangeText={(text) => this._setCount(text)}
                                                    style={{ width: 20, marginLeft: 10 }}
                                                    keyboardType="number-pad"
                                                    returnKeyType="done"
                                                    returnKeyLabel="done"
                                                />
                                                <Button
                                                    style={{ backgroundColor: color[3], width: 10 }}
                                                    color={color[5]}
                                                    onPress={() => this.incrementCount()}
                                                >
                                                    +
                                                </Button>
                                            </View>
                                        </Right>
                                    </CardItem>
                                </Card>
                            </View>
                        ) : (
                            <View style={styles.container}>
                                <Text>Couldn't Found anything on store</Text>
                            </View>
                        )}

                        <View style={styles.modalButtonsLeft}>
                            <Button
                                style={{ backgroundColor: color.danger, width: 150 }}
                                color={color[4]}
                                onPress={() => this.setState({ detailModal: false, scanned: false })}
                            >
                                Cancel
                            </Button>
                        </View>
                        <View style={styles.modalButtonsRight}>
                            <Button
                                style={{ backgroundColor: color[3], width: 150 }}
                                color={color[4]}
                                onPress={() => {
                                    this.setState({ detailModal: false, scanned: false });
                                    this._addToCart();
                                }}
                            >
                                Add
                            </Button>
                        </View>
                    </Modal>
                ) : (
                    <LoadingScreen />
                )}
            </GestureRecognizer>
        );
    }

    handleBarCodeScanned = ({ data }) => {
        this.fetchData(data);
        this.setState({ scanned: true });
        this.showAlert(data);
    };

    showAlert(data) {
        Alert.alert("Alert", data, [
            {
                text: "Cancel",
                onPress: () => this.setState({ scanned: false }),
                style: "cancel",
            },
            {
                text: "More Details",
                onPress: () => {
                    if (this._isEmpty()) this.setState({ detailModal: true });
                },
            },
        ]);
    }

    fetchData = (bar) => {
        const notEmpty = bar.trim().length > 0;
        const { token } = this.props.token;

        this.setState({ isLoading: true });

        if (notEmpty) {
            const url = `${baseUrl}store/${bar}`;
            axios(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
                .then((res) => {
                    this.setState({ isLoading: false });
                    if (res.data.length === 0) {
                        this.setState({ detailModal: false, data: {} });
                    }
                    // console.log(res.data.length !== 0)
                    if (res.data.length !== 0) {
                        this._showDetails(res.data);
                    }
                })
                .catch((error) => {
                    this.setState({ scanned: false, isLoading: false });
                    console.log(error);
                });
        }
    };

    _showDetails = (data) => {
        this.setState({ data: data[0] });
        this.setState({ data: Object.assign({ quantity: 1, totalPrice: data[0].price }, this.state.data) });
    };

    _addToCart = () => {
        const { data } = this.state;

        console.log(this._isEmpty(data));

        if (!this._isEmpty(data)) {
            const { name, barcode, _id, price, totalPrice, quantity } = data;
            this.setState(
                (prevState) => {
                    let { Cart } = prevState;
                    return {
                        Cart: Cart.concat({
                            _id: _id,
                            name: name,
                            barcode: barcode,
                            price: price,
                            quantity: quantity,
                            totalPrice: totalPrice,
                        }),
                    };
                },
                () => this.props.updateCart(this.state.Cart),
            );
        }
    };
    _isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        cart: state.cart,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateCart: (data) => dispatch(updateCart(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScannerScreen);
