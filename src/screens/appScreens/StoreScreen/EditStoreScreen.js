import React, { Component } from "react";
import { Text, View, FlatList, Alert, Picker, TextInput, TouchableOpacity, Modal } from "react-native";
import { connect } from "react-redux";
import { Card, Left, Right, Fab } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";
// local imports
import { updateShelf, fetchStore } from "../../../redux";
import styles from "./styles";
import baseUrl from "../../../constants/baseUrl";
import color from "../../../constants/color";
import LoadingScreen from "../../../components/Loading";

class EditStoreScreen extends Component {
    state = {
        shelves: this.props.shelf.shelves,
        store: this.props.navigation.state.params,
        _id: this.props.navigation.state.params._id,
        name: this.props.navigation.state.params.name,
        price: this.props.navigation.state.params.row,
        barcode: this.props.navigation.state.params.column,
        shelf: this.props.navigation.state.params.shelf,
        addItemModal: true,
        isLoading: false,
    };

    addTask = () => {
        const notEmpty = this.state.name.trim().length > 0;
        if (notEmpty) {
            const { store, name, price, barcode, shelf } = this.state;

            this.setState((prevState) => {
                let store = {
                    name,
                    price: price*100,
                    barcode,
                    shelf,
                };
                return {
                    store: store,
                    addItemModal: true,
                };
            }, this.resetList());
        }
    };

    _deleteItem = (i) => {
        Alert.alert(
            "Delete item",
            "Are you sure you want to delete this item from the list?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        // this.setState(
                        //     (prevState) => {
                        //         let neighbors = prevState.neighbors.slice();
                        //         neighbors.splice(i, 1);
                        //         return { neighbors: neighbors };
                        //     },
                        //     // () => this.props.updateShelf(this.state.store),
                        // );
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
                shelf: {},
                store: [],
            },
            () => this.props.updateShelf(this.state.store),
        );
    };

    _pushToDatabase = () => {
        const { store, _id } = this.state;
        const userToken = this.props.token.token;
        const { fetchStore } = this.props;

        this.setState({ isLoading: true });

        // console.log(`${baseUrl}store/${_id}`);
        let temp = JSON.stringify(store);
        let data = temp.split("_id").join("neighbor");

        axios(`${baseUrl}store/${_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
            },
            data,
        })
            .then((res) => {
                fetchStore();
                console.log("database pushed");
                this.props.navigation.navigate("Shelf");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log("error", error);
                this.setState({ isLoading: false });
            });
        this.resetList();
    };

    _changeShelf = ( element ) => {
        this.setState({ shelf: new Object({ name: element.name, _id: element._id })})
    }

    render() {
        const { store, shelves, barcode, price, isLoading, shelf, name } = this.state;

        if (isLoading) {
            return <LoadingScreen />;
        }
        return (
            <View style={[styles.container, { paddingBottom: 10 }]}>
                <View style={styles.list}>
                    <TouchableOpacity onPress={() => this.setState({ addItemModal: true })}>
                        <Card style={{ paddingHorizontal: 10 }}>
                            <View style={styles.listItemCont}>
                                <Text style={styles.listItem}>{store.name}</Text>
                                <Text>Code: {store.barcode}</Text>
                            </View>
                            <Text style={styles.listItem}>Price: {(store.price / 100).toFixed(2)} RS</Text>
                            <Text style={styles.listItem}>Shelf: {store.shelf.name}</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={styles.listItemCont}>
                    <Button
                        style={{ backgroundColor: color[3], width: "100%" }}
                        color={color[4]}
                        onPress={() => this._pushToDatabase()}
                    >
                        Done
                    </Button>
                </View>
                {/* Add item modal */}
                <Modal
                    visible={this.state.addItemModal}
                    onDismiss={() => this._hideModel("addItem")}
                    onRequestClose={() => this._hideModel("addItem")}
                    animationType={"fade"}
                >
                    <View style={(styles.container, { paddingBottom: 10 })}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={name}
                            placeholder="Product Name"
                            returnKeyType="next"
                            returnKeyLabel="next"
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ price: text })}
                                value={price ? String(price) : ""}
                                placeholder="Price"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                            <Picker
                                selectedValue={shelf.name}
                                style={styles.TextInput2}
                                onValueChange={(itemValue, itemIndex) => this._changeShelf(itemValue)}
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
                                placeholder="Barcode"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                        </View>
                    </View>
                    <View style={styles.modalButtonsLeft}>
                        <Button
                            style={{ backgroundColor: color.danger, width: 150 }}
                            color={color[4]}
                            onPress={() => this._hideModel()}
                        >
                            Cancel
                        </Button>
                    </View>
                    <View style={styles.modalButtonsRight}>
                        <Button
                            style={{ backgroundColor: color[3], width: 150 }}
                            color={color[4]}
                            onPress={() => {
                                this.addTask();
                                this._hideModel();
                            }}
                        >
                            Addd
                        </Button>
                    </View>
                </Modal>
            </View>
        );
    }
    _hideModel = (modal) => {
        this.setState({ addItemModal: false });
    };
}
const mapStateToProps = (state) => {
    return {
        store: state.store,
        token: state.token,
        shelf: state.shelf
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateShelf: (data) => dispatch(updateShelf(data)),
        fetchStore: () => dispatch(fetchStore()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditStoreScreen);
