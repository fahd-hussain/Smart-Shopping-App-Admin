import React, { Component } from "react";
import { Text, View, FlatList, Alert, Picker, TextInput, TouchableOpacity, Modal } from "react-native";
import { connect } from "react-redux";
import { Card, Left, Right, Fab } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";
// local imports
import { updateShelf, fetchStore, fetchLists, fetchShelves } from "../../../redux";
import styles from "./styles";
import baseUrl from "../../../constants/baseUrl";
import color from "../../../constants/color";
import LoadingScreen from "../../../components/Loading";

class CreateShelfScreen extends Component {
    state = {
        shelves: this.props.shelf.shelves,
        shelf: this.props.shelf.shelf,
        shelfName: "",
        shelfRow: 0,
        shelfColumn: 0,
        isCorner: 0,
        neighbors: [],
        neighbor: "",
        addItemModal: true,
        isLoading: false,
    };

    addTask = () => {
        const notEmpty = this.state.shelfName.trim().length > 0;

        if (notEmpty) {
            this.setState(
                (prevState) => {
                    let { shelf, shelfName, shelfRow, shelfColumn, isCorner, neighbors } = prevState;
                    // console.log(prevState);
                    return {
                        shelf: shelf.concat({
                            name: shelfName,
                            row: shelfRow,
                            column: shelfColumn,
                            isCorner,
                            neighbors,
                        }),
                        shelfName: "",
                        shelfRow: 0,
                        shelfColumn: 0,
                        isCorner: 0,
                        neighbors: [],
                    };
                },
                () => this.props.updateShelf(this.state.shelf),
            );
        }
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
                            let shelf = prevState.shelf.slice();

                            return {
                                shelfName: shelf[i].name,
                                shelfRow: shelf[i].row,
                                shelfColumn: shelf[i].column,
                                isCorner: shelf[i].isCorner,
                                neighbors: shelf[i].neighbors,
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
                                let shelf = prevState.shelf.slice();

                                shelf.splice(i, 1);

                                return { shelf: shelf };
                            },
                            () => this.props.updateShelf(this.state.shelf),
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
                pushDatabaseModal: false,
            },
            () => this.props.updateShelf(this.state.shelf),
        );
    };

    _pushToDatabase = () => {
        const { shelf } = this.state;
        const userToken = this.props.token.token;
        const { fetchShelves } = this.props;

        this.setState({ isLoading: true });

        // console.log(shelf[0])
        console.log(JSON.stringify(shelf[0]));

        axios(`${baseUrl}shelf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
            },
            data: JSON.stringify(shelf[0]),
        })
            .then((res) => {
                fetchShelves();
                this.props.navigation.navigate("Shelf");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                alert(error)
                this.setState({ isLoading: false });
            });
        this.resetList();
    };

    _addNeighbor = (value) => {
        let temp = this.state.neighbors;
        temp.push({ neighbor: value._id });
        this.setState({ neighbors: temp });
    };

    _deleteNeighbor = (i) => {
        Alert.alert(
            "Delete neighbor",
            "Are you sure you want to delete this neighbor from the list?",
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
                                let neighbor = prevState.neighbors.slice();
                
                                neighbor.splice(i, 1);
                
                                return { neighbors: neighbor };
                            },
                            () => this.props.updateShelf(this.state.shelf),
                        );
                    },
                },
            ],
            { cancelable: true },
        );
    };

    render() {
        const { shelf, shelves, neighbors, shelfColumn, shelfRow, isLoading } = this.state;

        if (isLoading) {
            return <LoadingScreen />;
        }

        return (
            <View style={[styles.container, { paddingBottom: 10 }]}>
                <FlatList
                    style={styles.list}
                    data={shelf}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onLongPress={() => this.deleteTask(index)}>
                            <Card style={{ paddingHorizontal: 10 }}>
                                <View style={styles.listItemCont}>
                                    <Text style={styles.listItem}>{item.name}</Text>
                                    <Text>{shelf.isCorner}</Text>
                                </View>
                                <Text>Row: {item.row}</Text>
                                <Text>Column: {item.column}</Text>
                                <Text style={styles.listItem}>Neighbors</Text>
                                <FlatList
                                    style={styles.list}
                                    data={item.neighbors}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity >
                                            <Card style={{ paddingHorizontal: 10 }}>
                                                <View style={styles.listItemCont}>
                                                    <Text>
                                                        {shelves.find((element) => element._id === item.neighbor).name}
                                                    </Text>
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
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScreen}>
                            <Text>Oops! You don't have any item</Text>
                        </View>
                    }
                />
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
                                keyboardType="number-pad"
                                placeholder="Row"
                                returnKeyType="next"
                                returnKeyLabel="next"
                            />
                            <TextInput
                                style={styles.TextInput2}
                                onChangeText={(text) => this.setState({ shelfColumn: parseInt(text, 10) })}
                                value={shelfColumn ? String(shelfColumn) : ""}
                                keyboardType="number-pad"
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
                                    return (<Picker.Item key={item.name} label={item.name} value={item} />);
                                })}
                            </Picker>
                        </View>
                        <FlatList
                            style={styles.list}
                            data={neighbors}
                            keyExtractor={(item, index) => String(index)}
                            scrollEnabled={true}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onLongPress={() => this._deleteNeighbor(index)}>
                                    <Card style={{ paddingHorizontal: 10 }}>
                                        <View style={styles.listItemCont}>
                                            <Text style={styles.listItem}>
                                                {shelves.find((element) => element._id === item.neighbor).name}
                                            </Text>
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
                            onPress={() => this._hideModel("addItem")}
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
                                this._hideModel("addItem");
                            }}
                        >
                            Add
                        </Button>
                    </View>
                </Modal>
            </View>
        );
    }
    _hideModel = (modal) => {
        switch (modal) {
            case "addItem":
                this.setState({ addItemModal: false });
            case "pushDatabase":
                this.setState({ pushDatabaseModal: false });
            default:
                return;
        }
    };
}
const mapStateToProps = (state) => {
    return {
        shelf: state.shelf,
        token: state.token,
        // shelf: state.shelf.shelves,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateShelf: (data) => dispatch(updateShelf(data)),
        fetchShelves: () => dispatch(fetchShelves()),
        // fetchLists: (token) => dispatch(fetchLists(token))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateShelfScreen);
