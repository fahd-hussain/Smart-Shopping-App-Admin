import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { Card } from "native-base";
import { connect } from "react-redux";
import axios from "axios";
// Local Imports
import styles from "./styles";
import { fetchShelves } from "../../../redux";

class ShelfShowScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shelf: this.props.navigation.state.params.item,
            token: this.props.navigation.state.params.token,
            _id: this.props.navigation.state.params.item._id,
            shelves: this.props.shelf.shelves,
        };
    }

    _editShelf = () => {
        const { shelf } = this.state;

        this.props.navigation.navigate("EditShelf", shelf);
    };

    _deleteFromDatabase = () => {
        const { _id, token } = this.state;
        const { fetchShelves } = this.props

        this.setState({ isLoading: true });

        axios(`${baseUrl}shelf/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
            .then((res) => {
                console.log("deleted from database");
                fetchShelves()
                this.props.navigation.navigate("Shelf");
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log("error", error);
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { shelf, shelves } = this.state;

        return (
            <View style={[styles.container, { paddingBottom: this.state.viewPadding }]}>
                <View style={styles.list}>
                    <Card style={{ paddingHorizontal: 10 }}>
                        <View style={styles.listItemCont}>
                            <Text style={styles.listItem}>{shelf.name}</Text>
                            <Text>{shelf.isCorner}</Text>
                        </View>
                        <Text>Column: {shelf.column}</Text>
                        <Text>Row: {shelf.row}</Text>
                        <Text style={styles.listItem}>Neighbors</Text>
                        <FlatList
                            style={styles.list}
                            data={shelf.neighbors}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item, index }) => (
                                <Card style={{ paddingHorizontal: 10 }}>
                                    <View style={styles.listItemCont}>
                                        {/* {console.log(shelves.find( element => element._id === item._id))} */}
                                        <Text>{shelves.find((element) => element._id === item._id).name}</Text>
                                    </View>
                                </Card>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyScreen}>
                                    <Text>Oops! You don't have any item to show</Text>
                                </View>
                            }
                        />
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
        // token: state.token,
        shelf: state.shelf,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchShelves: () => dispatch(fetchShelves())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShelfShowScreen);
