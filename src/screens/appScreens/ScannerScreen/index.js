import React, { Component } from "react";
import { StyleSheet, Alert, Modal, TextInput, FlatList } from "react-native";
import { View, Text, Card, CardItem, Right, Left, Icon } from "native-base";
import { Button } from "react-native-paper";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import GestureRecognizer from "react-native-swipe-gestures";
import { connect } from "react-redux";
import axios from "axios";

// Local Imports
import styles from "./styles";
import baseUrl from "../../../constants/baseUrl";
import LoadingScreen from "../../../components/Loading";

class BarCodeScannerScreen extends Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
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

    // onSwipeRight = () => {
    //     this.props.navigation.navigate("List");
    // };

    // onSwipeLeft = () => {
    //     this.props.navigation.navigate("Map");
    // };

    render() {
        const { hasCameraPermission, scanned, detailModal, data, isLoading } = this.state;
        console.log(data);
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
                // onSwipeLeft={this.onSwipeLeft}
                // onSwipeRight={this.onSwipeRight}
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
                        <View style={[ styles.container]}>
                            <View style={{ justifyContent: 'center', marginTop: 20 }}>
                                {data.author === undefined ? null : (
                                    <Text style={styles.listItem}>
                                        {data.author.firstname} {data.author.lastname}
                                    </Text>
                                )}
                            </View>
                            <FlatList
                                style={styles.list}
                                data={data.cartItems}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, index }) => (
                                    <Card style={{ paddingHorizontal: 10 }}>
                                        <CardItem header>
                                            <Left>
                                                <Text style={styles.listItem}>{item.name}</Text>
                                            </Left>
                                            <Right>
                                                <Text>{item.price} RS</Text>
                                            </Right>
                                        </CardItem>
                                        <CardItem bordered>
                                            <Left>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text>{item.quantity}</Text>
                                                </View>
                                            </Left>
                                        </CardItem>
                                    </Card>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyScreen}>
                                        <Text>Oops! You don't have any item to show</Text>
                                    </View>
                                }
                            />
                        </View>

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
                                Paid
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
            const url = `${baseUrl}cart/${bar}`;
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
        this.setState({ data: data });
        console.log(data, typeof data);

        // this.setState({ data: Object.assign({ quantity: 1, totalPrice: data[0].price }, this.state.data) });
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
