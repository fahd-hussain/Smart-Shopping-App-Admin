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
import color from '../../../constants/color'

const width = Dimensions.get("window").width;
export class EditPromotionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotion: this.props.navigation.state.params,
            showModal: true,
            name: this.props.navigation.state.params.name,
            promo: this.props.navigation.state.params.description,
            _id: this.props.navigation.state.params._id,
        };
    }

    _addPromotion = () => {
        const notEmpty = this.state.name.trim().length > 0;
        // console.log(this.state.neighbors)
        if (notEmpty) {
            const { promotion, name, promo } = this.state;

            this.setState((prevState) => {
                let promotion = {
                    name,
                    description: promo,
                };
                return {
                    promotion: promotion,
                    showModal: true,
                };
            });
        }
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

        axios(`${baseUrl}promotions/${_id}`, {
            method: "PUT",
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
                <View style={styles.list}>
                    <Card>
                        <CardItem header>
                            <Text>{promotion.name}</Text>
                        </CardItem>
                        <CardItem body>
                            <Text>{promotion.description}</Text>
                        </CardItem>
                    </Card>
                </View>

                <View style={styles.listItemCont}>
                    <Button
                        onPress={this._pushToDatabase}
                        style={{}}
                        mode="contained"
                        theme={{ colors: { primary: color[3] } }}
                        style={{ backgroundColor: color[3], width: "100%" }}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPromotionScreen);
