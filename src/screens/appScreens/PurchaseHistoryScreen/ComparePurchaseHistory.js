import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { Card, Right, Left } from "native-base";

// 
import styles from './styles'

export class ComparePurchaseHistoryScreen extends Component {
    render() {
        const { selectedList1, selectedList2, type } = this.props.navigation.state.params;
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                <View>
                    <FlatList
                        style={styles.list}
                        data={selectedList1.cartItems}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity>
                                <Card style={{ paddingHorizontal: 10 }}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                    <View style={styles.listItemCont2}>
                                        <Text>{item.quantity}</Text>
                                        <Text>{item.price} /RS</Text>
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
                    <View
                        style={{
                            borderBottomColor: color.logo2,
                            borderBottomWidth: 5,
                            borderRadius: 10,
                            marginTop: 4,
                        }}
                    />
                    <Text style={[styles.listItem, {padding: 10}]} >{selectedList1.totalPrice} - RS</Text>
                    <View
                        style={{
                            borderBottomColor: color.logo2,
                            borderBottomWidth: 5,
                            borderRadius: 10,
                            marginTop: 4,
                        }}
                    />
                </View>

                <View>
                    <FlatList
                        style={styles.list}
                        data={selectedList2.cartItems}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity>
                                <Card style={{ paddingHorizontal: 10 }}>
                                    <Text style={styles.listItem}>{item.name}</Text>
                                    <View style={styles.listItemCont2}>
                                        <Text>{item.quantity}</Text>
                                        <Text>{item.price} /RS</Text>
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
                    <View
                        style={{
                            borderBottomColor: color.logo2,
                            borderBottomWidth: 5,
                            borderRadius: 10,
                            marginTop: 4,
                        }}
                    />
                    <Text style={[styles.listItem, {padding: 10}]}>{selectedList2.totalPrice} - RS</Text>
                    <View
                        style={{
                            borderBottomColor: color.logo2,
                            borderBottomWidth: 5,
                            borderRadius: 10,
                            marginTop: 4,
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default ComparePurchaseHistoryScreen;
