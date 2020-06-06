import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Card, Icon, Right } from "native-base";
import { Button } from "react-native-paper";
import { withNavigationFocus } from 'react-navigation';
import GestureRecognizer from "react-native-swipe-gestures";

// Local Imports
import styles from "./styles";
import { fetchStore } from "../../../redux";
import color from "../../../constants/color";

class StoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
            },
            isLoading: false,
            stores: this.props.store.stores,
        };
    }
    componentDidMount = () => {
        this.props.fetchStore()
    }

    _fetchStores = () => {
        // console.log(this.props)
        const { fetchStore } = this.props;

        this.setState({ isLoading: true })

        fetchStore()
            .then((res) => {
                this.setState({ isLoading: false, stores: res[0] })
            })
            .catch(() => {
                this.setState({ isLoading: false })
                alert("Loading failed, swipe down to refresh")
            })
    }
    render() {
        // const { lists } = this.state;
        const stores = this.props.store.stores;
        // console.log(this.props.store.stores)
        // const stores = this.props.store.stores
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
                    data={stores}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.navigateToShowStore(item)}>
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
                        onPress={() => this.props.navigation.navigate("CreateStore")}
                        style={{ position: "absolute", left: "32%", bottom: 0 }}
                        color={color[5]}
                    />
                </View>
            </GestureRecognizer>
        );
    }
    navigateToShowStore = (item) => {
        const { token } = this.props.token
        this.props.navigation.navigate("StoreDetail", {item, token});
    };
    onSwipeLeft = () => {
        this.props.navigation.navigate("BarcodeScanner");
    };
    onSwipeRight = () => {
        this.props.navigation.navigate("Home");
    };
    onSwipeDown = () => {
        console.log("Down")
        this._fetchStores()
    };
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        store: state.store
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchStore: () => dispatch(fetchStore()),
    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(StoreScreen));
