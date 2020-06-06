import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { Button, Menu, Provider } from "react-native-paper";
import { Card } from "native-base";
import { connect } from "react-redux";

// Local imports
import { fetchCart } from "../../../redux";
import styles from "./styles";
import color from "../../../constants/color";

const width = Dimensions.get("window").width;

export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartHistory: this.props.cart.carts,
            selectedList1: {},
            selectedList2: {},
            compareButton: true,
        };
    }
    componentDidMount = () => {
        this.props.fetchCart(this.props.token.token);
    };
    componentDidUpdate = () => {
        this.props.fetchCart(this.props.token.token);
    };
    _navigateToList = (item) => {
        this.props.navigation.navigate("PurchaseHistoryDetail", item);
    };

    // Comparing History
    _selectList = (list) => {
        const { selectedList1, selectedList2 } = this.state;
        // console.log(typeof(list));
        if ( this._isEmpty(selectedList1)){
            // console.log("list one selected")
            this.setState({ selectedList1: list })
        } else {
            // console.log("list already one selected")
            if ( selectedList1 !== list ){
                if ( this._isEmpty(selectedList2)){
                    // console.log("list two selected")
                    this.setState({ selectedList2: list })
                } else {
                    // console.log("list two already selected")
                }
            } else {
                // console.log("same list")
            }
        }

        if ( selectedList1 === list ){
            this.setState({ selectedList1: {}})
        }

        if ( selectedList2 === list ){
            this.setState({ selectedList2: {}})
        }

        this._compareBtn()
    };

    _navigateToCompare = (type) => {
        const { selectedList1, selectedList2 } = this.state;
        this.props.navigation.navigate("ComparePurchaseHistory", { selectedList1, selectedList2, type });
        this.setState({ selectedList2: {}, selectedList1: {}})
    }

    _isEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    _compareBtn = () => {
        const { selectedList1, selectedList2, compareButton } = this.state;
        if ( !this._isEmpty(selectedList1) && !this._isEmpty(selectedList2))
            if ( compareButton )
                this.setState({ compareButton: false })

        if ( !compareButton )
            if ( !this._isEmpty(selectedList1) || !this._isEmpty(selectedList2))
                    this.setState({ compareButton: true })

    }
    _isSelected = (list) => {
        const { selectedList1, selectedList2 } = this.state;

        if ( selectedList1 === list || selectedList2 === list ){
            return true
        }
    }

    render() {
        const { cartHistory, compareButton } = this.state;
        return (
            <View style={[styles.container]}>
                <FlatList
                    style={styles.list}
                    data={cartHistory}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => this._navigateToList(item)}
                            onLongPress={() => this._selectList(item)}
                            style={ this._isSelected(item) ? { backgroundColor: color[3] } : null }
                        >
                            <Card style={{ paddingHorizontal: 10 }}>
                                <View style={styles.listItemCont}>
                                    <Text style={styles.listItem}>{item.name}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScreen}>
                            <Text>Oops! You don't have any item to show</Text>
                        </View>
                    }
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}>
                    <Button 
                        mode="contained"
                        style={[styles.TextInput, styles.btn2, { width: width - 20, marginHorizontal: width / 90 }]}
                        theme={{ colors: { primary: color[3] } }}
                        disabled={compareButton} 
                        onPress={() => this._navigateToCompare()} 
                    >Compare</Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        cart: state.cart,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCart: (token) => dispatch(fetchCart(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
