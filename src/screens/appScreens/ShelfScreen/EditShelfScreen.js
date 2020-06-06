import React, { Component } from "react";
import { Text, View, FlatList, Alert, Picker, TextInput, TouchableOpacity, Modal } from "react-native";
import { connect } from "react-redux";
import { Card, Left, Right, Fab } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";
// local imports
import { updateShelf, fetchShelves } from "../../../redux";
import styles from "./styles";
import baseUrl from "../../../constants/baseUrl";
import color from "../../../constants/color";
import LoadingScreen from "../../../components/Loading";

class EditShelfScreen extends Component {
    state = {
        shelves: this.props.shelf.shelves,
        shelf: this.props.navigation.state.params,
        _id: this.props.navigation.state.params._id,
        shelfName: this.props.navigation.state.params.name,
        shelfRow: this.props.navigation.state.params.row,
        shelfColumn: this.props.navigation.state.params.column,
        isCorner: this.props.navigation.state.params.isCorner,
        neighbors: this.props.navigation.state.params.neighbors,
        neighbor: [],
        addItemModal: true,
        isLoading: false,
    };

    addTask = () => {
        const notEmpty = this.state.shelfName.trim().length > 0;
        // console.log(this.state.neighbors)
        if (notEmpty) {
            const { shelf, shelfName, shelfRow, shelfColumn, isCorner, neighbors } = this.state;

            this.setState((prevState) => {
                let shelf = {
                    name: shelfName,
                    row: shelfRow,
                    column: shelfColumn,
                    isCorner,
                    neighbors,
                };
                return {
                    shelf: shelf,
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
                        this.setState(
                            (prevState) => {
                                let neighbors = prevState.neighbors.slice();

                                neighbors.splice(i, 1);

                                return { neighbors: neighbors };
                            },
                            // () => this.props.updateShelf(this.state.shelf),
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
                shelfName: "",
                shelfRow: 0,
                shelfColumn: 0,
                isCorner: 0,
                neighbors: [],
                neighbor: "",
                shelf: [],
            },
            () => this.props.updateShelf(this.state.shelf),
        );
    };

    _pushToDatabase = () => {
        const { shelf, _id, neighbor } = this.state;
        const userToken = this.props.token.token;
        const { fetchShelves } = this.props;

        this.setState({ isLoading: true });

        // console.log(`${baseUrl}shelf/${_id}`);
        let temp = JSON.stringify(shelf);
        let data = temp.split("_id").join("neighbor")

        axios(`${baseUrl}shelf/${_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
            },
            data,
        })
            .then((res) => {
                fetchShelves();
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

    _addNeighbor = (value) => {
        this.setState(
            (prevState) => {
                let { neighbors } = prevState;
                return {
                    neighbors: neighbors.concat({
                        neighbor: value._id,
                        name: value.name,
                    }),
                };
            },
            () => this.props.updateShelf(this.state.shelf),
        );
        console.log(this.state.neighbors);
    };

    render() {
        const { shelf, shelves, neighbors, shelfColumn, shelfRow, isLoading, shelfName, isCorner } = this.state;

        // console.log(shelf);
        if (isLoading) {
            return <LoadingScreen />;
        }

        return (
            <View style={[styles.container, { paddingBottom: 10 }]}>
                <View style={styles.list}>
                    <TouchableOpacity onPress={() => this.setState({ addItemModal: true })}>
                        <Card style={{ paddingHorizontal: 10 }}>
                            <View style={styles.listItemCont}>
                                <Text style={styles.listItem}>{shelf.name}</Text>
                                <Text>{shelf.isCorner}</Text>
                            </View>
                            <Text>Row: {shelf.row}</Text>
                            <Text>Column: {shelf.column}</Text>
                            <Text style={styles.listItem}>Neighbors</Text>
                            <FlatList
                                style={styles.list}
                                data={shelf.neighbors}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity>
                                        <Card style={{ paddingHorizontal: 10 }}>
                                            <View style={styles.listItemCont}>
                                                <Text>{item.name}</Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyScreen}>
                                        <Text>Oops! You don't have any neighbor to show</Text>
                                    </View>
                                }
                            />
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
                            onChangeText={(shelfName) => this.setState({ shelfName })}
                            value={this.state.shelfName}
                            placeholder="Shelf Name"
                            returnKeyType="next"
                            returnKeyLabel="next"
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ shelfRow: parseInt(text, 10) })}
                                value={shelfRow ? String(shelfRow) : ""}
                                placeholder="Row"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ shelfColumn: parseInt(text, 10) })}
                                value={shelfColumn ? String(shelfColumn) : ""}
                                placeholder="Column"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Picker
                                style={styles.TextInput2}
                                onValueChange={(isCorner) => this.setState({ isCorner })}
                                selectedValue={this.state.isCorner}
                            >
                                <Picker.Item key={"1"} label="Start" value={1} />
                                <Picker.Item key={"0"} label="Middle" value={0} />
                                <Picker.Item key={"2"} label="End" value={2} />
                            </Picker>
                            <Picker
                                selectedValue={this.state.neighbor}
                                style={styles.TextInput2}
                                onValueChange={(itemValue, itemIndex) => this._addNeighbor(itemValue)}
                            >
                                {shelves.map((item) => {
                                    return <Picker.Item key={item.name} label={item.name} value={item} />;
                                })}
                            </Picker>
                        </View>
                        <FlatList
                            style={styles.list}
                            data={neighbors}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onLongPress={() => this._deleteItem(index)}>
                                    <Card style={{ paddingHorizontal: 10 }}>
                                        <View style={styles.listItemCont}>
                                            <Text>{item.name}</Text>
                                        </View>
                                        <View style={styles.hr} />
                                    </Card>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyScreen}>
                                    <Text>Type something for Suggestion</Text>
                                </View>
                            }
                        />
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
        shelf: state.shelf,
        token: state.token,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateShelf: (data) => dispatch(updateShelf(data)),
        fetchShelves: () => dispatch(fetchShelves()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditShelfScreen);
