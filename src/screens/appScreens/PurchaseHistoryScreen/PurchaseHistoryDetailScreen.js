import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Modal, Dimensions } from "react-native";
import { Button } from 'react-native-paper'
import { Card, Icon } from "native-base";
import QRCode from "react-native-qrcode-svg";

import styles from './styles'

const width = Dimensions.get("window").width

export class PurchaseHistoryDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: this.props.navigation.state.params.cartItems,
            isLeading: false,
            QRModal: "",
            QRData: this.props.navigation.state.params._id
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => <Icon 
                                    type="FontAwesome" 
                                    name="qrcode" 
                                    style={{ paddingRight: 15 }} 
                                    onPress={navigation.getParam("showQRModal")}
                                />
        };
    };
    _showModal = () => {
        const { QRData } = this.state
        if (QRData.trim().length !== 0){
            this.setState({ QRModal: true });
        } else {
            alert('QR Code not found!')
        }
    };

    componentDidMount = () => {  
        this.props.navigation.setParams({ showQRModal: this._showModal });
    }
    render() {
        const { list, QRModal, QRData } = this.state
        return (
            <View style={[styles.container, { paddingBottom: this.state.viewPadding }]}>
                <FlatList
                    style={styles.list}
                    data={list}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        <Card style={{ paddingHorizontal: 10 }}>
                            <View style={styles.listItemCont}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                <Text>{item.quantity} / {item.price} RS</Text>
                            </View>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScreen}>
                            <Text>Oops! You don't have any item to show</Text>
                        </View>
                    }
                />
                <Text>{list.totalPrice}</Text>
                <Modal
                    visible={QRModal}
                    onDismiss={() => this.setState({ QRModal: false })}
                    onRequestClose={() => this.setState({ QRModal: false })}
                >
                    <View style={styles.modalScreen}>
                        <QRCode value={QRData} color="black" backgroundColor="white" size={width / 2} />
                    </View>
                </Modal>
            </View>
        )
    }
}

export default PurchaseHistoryDetailScreen
