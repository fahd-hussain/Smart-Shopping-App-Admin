import React, { Component } from "react";
import { Text, View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { Card, CardItem, Right, Icon } from "native-base";
import { Button } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";

// Local Imports
import styles from "./styles";
import { fetchPromotions, fetchCart } from "../../../redux";
import LoadingScreen from "../../../components/Loading";
import { TouchableOpacity } from "react-native-gesture-handler";

export class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
            },
            isLoading: false,
        };
    }

    componentDidMount = () => {
        this.props.fetchCart(this.props.token.token);
        // AsyncStorage.clear()
    };

    _fetchPromotions = () => {
        this.setState({ isLoading: true });
        this.props
            .fetchPromotions()
            .then((res) => this.setState({ isLoading: false }))
            .catch((error) => this.setState({ isLoading: false }));
    };

    navigateToShowPromotion = (item) => {
        const { token } = this.props.token
        this.props.navigation.navigate("PromotionDetail", {item, token});
    };

    render() {
        const promo = this.props.promo.promotions;
        const { isLoading } = this.state;

        if (isLoading) {
            return <LoadingScreen />;
        }

        return (
            <GestureRecognizer
                onSwipeLeft={this._onSwipeLeft}
                onSwipeRight={this._onSwipeRight}
                onSwipeDown={this._onSwipeDown}
                config={this.state.config}
                style={styles.container}
            >
                <Card
                    dataArray={promo}
                    transparent
                    renderRow={({ item }) => (
                        <View>
                            <TouchableOpacity onPress={() => this.navigateToShowPromotion(item)}>
                                <Card>
                                    <CardItem header>
                                        <Text>{item.name}</Text>
                                    </CardItem>
                                    <CardItem body>
                                        <Text>{item.description}</Text>
                                    </CardItem>
                                    <CardItem footer>
                                        <Right>
                                            {/* <Icon
                                            raised
                                            reverse
                                            name={this._isFavorite(item._id) ? "heart" : "heart-o"}
                                            // name="heart"
                                            type="FontAwesome"
                                            color="#f50"
                                            onPress={() =>
                                                this._isFavorite(item._id)
                                                    ? this._favoriteButtonAction(item, "delete")
                                                    : this._favoriteButtonAction(item, "post")
                                            }
                                        /> */}
                                        </Right>
                                    </CardItem>
                                </Card>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={styles.createListBtn}>
                    <Button
                        icon={() => (
                            <Icon type="FontAwesome" name="plus-circle" style={{ color: color[3], fontSize: 55 }} />
                        )}
                        onPress={() => this.props.navigation.navigate("AddPromotion")}
                        style={{ position: "absolute", left: "32%", bottom: 0 }}
                        color={color[5]}
                    />
                </View>
            </GestureRecognizer>
        );
    }
    _onSwipeLeft = () => {
        this.props.navigation.navigate("List");
    };
    _onSwipeRight = () => {
        this.props.navigation.openDrawer();
    };
    _onSwipeDown = () => {
        this._fetchPromotions();
    };
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
        fetchCart: (token) => dispatch(fetchCart(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
