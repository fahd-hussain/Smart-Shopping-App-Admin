import React, { Component } from "react";
import { Text, View, FlatList, Alert, Picker, TextInput, TouchableOpacity, Modal, Dimensions } from "react-native";
import { connect } from "react-redux";
import { Avatar } from "react-native-paper";
import { Card, CardItem, Right, Icon } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";

// Local Imports
import styles from "../StoreScreen/styles";
import { updatePromotion, fetchPromotions } from "../../../redux";

const width = Dimensions.get("window").width;
export class AddPromotionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotion: this.props.promo.promotion,
            showModal: false,
            name: "",
            promo: "",
        };
    }

    _addPromotion = () => {
        const notEmpty = this.state.name.trim().length > 0;
        // console.log(this.state.neighbors)
        if (notEmpty) {
            // const { name, promo } = this.state;

            this.setState(
                (prevState) => {
                    let { promotion, name, promo } = prevState;

                    return {
                        promotion: promotion.concat({
                            name,
                            description: promo,
                        }),
                        name: "",
                        promo: "",
                        showModal: true,
                    };
                },
                () => this.props.updatePromotion(this.state.shelf),
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
    _resetList = () => {
        this.setState(
            {
                name: "",
                promo: "",
                promotion: [],
            },
            () => this.props.updatePromotion(this.state.shelf),
        );
    };

    _pushToDatabase = () => {
        const { promotion, _id } = this.state;
        const userToken = this.props.token.token;
        const { fetchPromotions } = this.props;

        this.setState({ isLoading: true });
        console.log(JSON.stringify(promotion))

        axios(`${baseUrl}promotions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken,
            },
            data: JSON.stringify(promotion),
        })
            .then((res) => {
                fetchPromotions();
                console.log("database pushed");
                this.props.navigation.navigate("Home");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log("error", error);
                this.setState({ isLoading: false });
            });
        this._resetList();
    };

    render() {
        const { promotion, showModal, name, promo } = this.state;
        return (
            <View style={[styles.container, { paddingBottom: 10 }]}>
                <FlatList
                    style={styles.list}
                    data={promotion}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onLongPress={() => this.deleteTask(index)}>
                            <View style={styles.list}>
                                <Card>
                                    <CardItem header>
                                        <Text>{item.name}</Text>
                                    </CardItem>
                                    <CardItem body>
                                        <Text>{item.description}</Text>
                                    </CardItem>
                                </Card>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScreen}>
                            <Text>Oops! You don't have any item</Text>
                        </View>
                    }
                />

                <View style={[styles.listItemCont, { justifyContent: "space-between" }]}>
                    <Button
                        onPress={() => this.setState({ showModal: true })}
                        style={{}}
                        mode="contained"
                        theme={{ colors: { primary: color[3] } }}
                        style={{ backgroundColor: color[3], width: "40%" }}
                    >
                        Add Item
                    </Button>
                    <Button
                        onPress={this._pushToDatabase}
                        style={{}}
                        mode="contained"
                        theme={{ colors: { primary: color[3] } }}
                        style={{ backgroundColor: color[3], width: "40%" }}
                    >
                        Save
                    </Button>
                </View>
                <Modal
                    visible={showModal}
                    onDismiss={() => this.setState({ showModal: false })}
                    onRequestClose={() => this.setState({ showModal: false })}
                >
                    <View style={[styles.container]}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={name}
                            placeholder="Promotion Name"
                            returnKeyType="next"
                            returnKeyLabel="next"
                        />
                        <TextInput
                            style={[styles.textInput, { height: "20%" }]}
                            onChangeText={(promo) => this.setState({ promo })}
                            value={promo}
                            multiline={true}
                            mode="outlined"
                            placeholder="Descriptions"
                            returnKeyType="next"
                            returnKeyLabel="next"
                        />
                    </View>
                    <View style={styles.modalButtonsLeft}>
                        <Button
                            style={{ backgroundColor: color.danger, width: 150 }}
                            color={color[4]}
                            onPress={() => this.setState({ showModal: false })}
                        >
                            Cancel
                        </Button>
                    </View>
                    <View style={styles.modalButtonsRight}>
                        <Button
                            style={{ backgroundColor: color[3], width: 150 }}
                            color={color[4]}
                            onPress={() => {
                                this._addPromotion();
                                this.setState({ showModal: false });
                            }}
                        >
                            Addd
                        </Button>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        promo: state.promo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotions: () => dispatch(fetchPromotions()),
        updatePromotion: (data) => dispatch(updatePromotion(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPromotionScreen);
