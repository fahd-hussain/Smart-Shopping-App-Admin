import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { Card } from "native-base";
import { connect } from "react-redux";
import axios from 'axios'
// Local Imports
import styles from "./styles";
import { fetchStore } from "../../../redux";

class StoreShowScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: this.props.navigation.state.params.item,
            token: this.props.navigation.state.params.token,
            _id: this.props.navigation.state.params.item._id,
        };
    }

    _editShelf = () => {
        const { store } = this.state;

        this.props.navigation.navigate("EditStore", store);
    };

    _deleteFromDatabase = () => {
        const { _id, token } = this.state;
        const { fetchStore } = this.props;

        this.setState({ isLoading: true });

        axios(`${baseUrl}store/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
            .then((res) => {
                console.log("deleted from database");
                fetchStore();
                this.props.navigation.navigate("Store");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log("error", error);
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { store } = this.state;
        console.log(store);
        return (
            <View style={[styles.container, { paddingBottom: this.state.viewPadding }]}>
                <View style={styles.list}>
                    <Card style={{ paddingHorizontal: 10 }}>
                        <View style={styles.listItemCont}>
                            <Text style={styles.listItem}>{store.name}</Text>
                            <Text>Code: {store.barcode}</Text>
                        </View>
                        <Text style={styles.listItem}>Price: {(store.price / 100).toFixed(2)} RS</Text>
                        <Text style={styles.listItem}>Shelf: {store.shelf.name}</Text>
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
                        onPress={this._editShelf}
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
        store: state.store,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchStore: () => dispatch(fetchStore())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreShowScreen);
