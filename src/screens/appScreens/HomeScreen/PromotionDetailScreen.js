import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { Card, CardItem, Right, Icon } from "native-base";
import { Button } from "react-native-paper";
import axios from 'axios'

import { fetchPromotions } from '../../../redux'
export class PromotionDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotion: this.props.navigation.state.params.item,
            token: this.props.navigation.state.params.token,
            _id: this.props.navigation.state.params.item._id
        };
    }

    _editPromotion = () => {
        const { promotion } = this.state;

        this.props.navigation.navigate("EditPromotion", promotion);
    };

    _deleteFromDatabase = () => {
        const { _id, token } = this.state;
        const { fetchPromotions } = this.props;

        this.setState({ isLoading: true });

        axios(`${baseUrl}promotions/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            }
        })
            .then((res) => {
                console.log("deleted from database");
                fetchPromotions()
                this.props.navigation.navigate("Home");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log("error", error);
                this.setState({ isLoading: false });
            });
    };

    render() {
        // console.log(this.props.navigation.state);
        const { promotion } = this.state;

        return (
            <View style={[styles.container, { paddingBottom: this.state.viewPadding }]}>
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
                        onPress={this._deleteFromDatabase}
                        style={{}}
                        mode="contained"
                        theme={{ colors: { primary: color[3] } }}
                        style={{ backgroundColor: color.danger, width: "40%" }}
                    >
                        Delete
                    </Button>
                    <Button
                        onPress={this._editPromotion}
                        style={{}}
                        mode="contained"
                        theme={{ colors: { primary: color[3] } }}
                        style={{ backgroundColor: color[3], width: "40%" }}
                    >
                        Edit
                    </Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotions: () => dispatch(fetchPromotions())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetailScreen);
