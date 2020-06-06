import React, { Component } from "react";
import { Text, View, FlatList, Alert, Picker, TextInput, TouchableOpacity, Modal } from "react-native";
import { connect } from "react-redux";
import { Card, Left, Right, Fab } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";
// local imports
import { updateStore, fetchShelves, fetchStore } from "../../../redux";
import styles from "./styles";
import baseUrl from "../../../constants/baseUrl";
import color from "../../../constants/color";
import LoadingScreen from "../../../components/Loading";

class CreateStoreScreen extends Component {
    state = {
        shelves: this.props.shelf.shelves,
        store: this.props.store.store,
        name: "",
        price: 0,
        barcode: "",
        shelf: {},
        addItemModal: false,
        isLoading: false,
    };

    addTask = () => {
        const promiseArray = [];

        promiseArray.push(
            new Promise((resolve, reject) => {
                const notEmpty = this.state.name.trim().length > 0;

                if (notEmpty) {
                    this.setState(
                        (prevState) => {
                            let { store, name, price, barcode, shelf } = prevState;

                            return {
                                store: store.concat({
                                    name,
                                    price: price * 100,
                                    barcode,
                                    shelf,
                                }),
                                name: "",
                                price: 0.0,
                                barcode: "",
                                shelf: {},
                            };
                        },
                        () => {
                            this.props.updateStore(this.state.store);
                            resolve();
                        },
                    );
                } else {
                    reject();
                }
            }),
        );

        return Promise.all(promiseArray);
    };

    deleteTask = (i) => {
        Alert.alert(
            "Delete item",
            "Are you sure you want to delete this item from the list?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Edit",
                    onPress: () => {
                        this.setState((prevState) => {
                            let store = prevState.store.slice();

                            return {
                                name: store[i].name,
                                price: store[i].price,
                                barcode: store[i].barcode,
                                shelf: store[i].shelf,
                                addItemModal: true,
                            };
                        });
                    },
                },
                {
                    text: "Delete",
                    onPress: () => {
                        this.setState(
                            (prevState) => {
                                let store = prevState.store.slice();

                                store.splice(i, 1);

                                return { store: store };
                            },
                            () => this.props.updateStore(this.state.store),
                        );
                    },
                },
            ],
            { cancelable: true },
        );
    };

    resetList = () => {
        this.setState(
            {
                name: "",
                price: 0,
                barcode: "",
                store: [],
                shelf: {},
                pushDatabaseModal: false,
            },
            () => this.props.updateStore(this.state.store),
        );
    };

    _pushToDatabase = () => {
        const { store } = this.state;
        const userToken = this.props.token.token;
        const { fetchShelves } = this.props;

        this.setState({ isLoading: true });

        console.log(store);
        // console.log(JSON.stringify(store[0]));

        axios(`${baseUrl}store`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
            },
            data: JSON.stringify(store),
            // data: store
        })
            .then((res) => {
                fetchStore();
                this.props.navigation.navigate("Store");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                alert(error);
                this.setState({ isLoading: false });
            });
        this.resetList();
    };

    _addShelf = (element) => {
        // console.log(element);
        this.setState({ shelf: new Object({ name: element.name, _id: element._id }) });
    };

    render() {
        const { store, shelves, name, price, shelf, barcode, isLoading } = this.state;

        // console.log(store, typeof store);
        if (isLoading) {
            return <LoadingScreen />;
        }

        return (
            <View style={[styles.container, { paddingBottom: 10 }]}>
                <Card style={{ paddingHorizontal: 10 }}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={name}
                            placeholder="Item Name"
                            returnKeyType="next"
                            returnKeyLabel="next"
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ price: text })}
                                value={price ? price : ""}
                                keyboardType="number-pad"
                                placeholder="Price"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                            <Picker
                                selectedValue={shelf.name}
                                style={styles.TextInput2}
                                onValueChange={(itemValue, itemIndex) => this._addShelf(itemValue)}
                            >
                                {shelves.map((item) => {
                                    return <Picker.Item key={item.name} label={item.name} value={item} />;
                                })}
                            </Picker>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ barcode: text })}
                                value={barcode ? barcode : ""}
                                keyboardType="number-pad"
                                placeholder="Barcode"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                        </View>
                </Card>
                <View style={styles.listItemCont}>
                    <Button
                        style={{ backgroundColor: color[3], width: "50%" }}
                        color={color[4]}
                        onPress={() => this.addTask().then(() => this._pushToDatabase())}
                    >
                        Done
                    </Button>
                    <Button onPress={() => this.props.updateStore([])}>clear</Button>
                </View>
            </View>
        );
    }
    _hideModel = () => {
        this.setState({ addItemModal: false });
    };
}
const mapStateToProps = (state) => {
    return {
        store: state.store,
        token: state.token,
        shelf: state.shelf,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateStore: (data) => dispatch(updateStore(data)),
        fetchShelves: () => dispatch(fetchShelves()),
        fetchStore: () => dispatch(fetchStore()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateStoreScreen);
