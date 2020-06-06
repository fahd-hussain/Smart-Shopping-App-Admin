import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Card, Icon, Right } from "native-base";
import { Button } from "react-native-paper";
import { withNavigationFocus } from 'react-navigation';
import GestureRecognizer from "react-native-swipe-gestures";

// Local Imports
import styles from "./styles";
import { fetchShelves } from "../../../redux";
import color from "../../../constants/color";

class ShelfScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
            },
            isLoading: false,
            shelves: this.props.shelf.shelves,
        };
    }
    componentDidMount = () => {
        this.props.fetchShelves()
    }

    _fetchShelves = () => {
        const { fetchShelves } = this.props;

        this.setState({ isLoading: true })

        fetchShelves()
            .then((res) => {
                this.setState({ isLoading: false, shelves: res[0] })
            })
            .catch(() => {
                this.setState({ isLoading: false })
                alert("Loading failed, swipe down to refresh")
            })
    }

    render() {
        const shelves = this.props.shelf.shelves
        return (
            <GestureRecognizer
                // onSwipeLeft={this.onSwipeLeft}
                // onSwipeRight={this.onSwipeRight}
                onSwipeDown={() => this.onSwipeDown()}
                config={this.state.config}
                style={[styles.container, { paddingBottom: this.state.viewPadding }]}
            >
                <FlatList
                    style={styles.list}
                    data={shelves}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.navigateToShowShelf(item)}>
                            <Card style={{ paddingHorizontal: 10 }}>
                                <View style={styles.listItemCont}>
                                    <Text style={styles.listItem}>{item.name}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScreen}>
                            <Text>Oops! You don't have any list to show</Text>
                        </View>
                    }
                />
                <View style={styles.createListBtn}>
                    <Button
                        icon={() => (
                            <Icon type="FontAwesome" name="plus-circle" style={{ color: color[3], fontSize: 55 }} />
                        )}
                        onPress={() => this.props.navigation.navigate("CreateShelf")}
                        style={{ position: "absolute", left: "32%", bottom: 0 }}
                        color={color[5]}
                    />
                </View>
            </GestureRecognizer>
        );
    }
    navigateToShowShelf = (item) => {
        const { token } = this.props.token
        this.props.navigation.navigate("ShelfShow", {item, token});
    };
    onSwipeLeft = () => {
        this.props.navigation.navigate("BarcodeScanner");
    };
    onSwipeRight = () => {
        this.props.navigation.navigate("Home");
    };
    onSwipeDown = () => {
        console.log("Down")
        this._fetchShelves()
    };
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        shelf: state.shelf
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchShelves: () => dispatch(fetchShelves()),
    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(ShelfScreen));
