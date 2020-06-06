import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { List, ListItem, Icon, Right } from "native-base";
import { Avatar, Text, TextInput } from "react-native-paper";
import { connect } from "react-redux";

import styles from "./styles";
import { removeToken } from "../../../redux";
class ProfileScreen extends Component {
    state = {
        modalVisible: false,
        text: "",
        label: "",
        DPModal: false,
    };
    _logout = () => {
        this.props.removeToken();
        this.props.navigation.navigate("Authentication");
    };
    render() {
        const { _id, username, profilePicture, firstname, lastname, gender } = this.props.user.user;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.displayPictureContainer}>
                        <TouchableOpacity onPress={() => this.setState({ DPModal: true })}>
                            {profilePicture ? (
                                <Avatar.Image size={(Dimensions.get("window").width * 1) / 2} source={profilePicture} />
                            ) : (
                                <Avatar.Icon
                                    size={(Dimensions.get("window").width * 1) / 2}
                                    icon={() => <Icon type="FontAwesome" name="user" style={styles.avatar} />}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <List>
                        <ListItem onPress={() => this.setState({ modalVisible: true, label: "First Name" })}>
                            <View>
                                <Text style={styles.textHeader}>First Name</Text>
                                <Text mode style={styles.text}>
                                    {firstname}
                                </Text>
                            </View>
                        </ListItem>
                        <ListItem onPress={() => this.setState({ modalVisible: true, label: "Last Name" })}>
                            <View>
                                <Text style={styles.textHeader}>Last Name</Text>
                                <Text mode style={styles.text}>
                                    {lastname}
                                </Text>
                            </View>
                        </ListItem>
                        <ListItem onPress={() => this.setState({ modalVisible: true, label: "Username" })}>
                            <View>
                                <Text style={styles.textHeader}>Username</Text>
                                <Text mode style={styles.text}>
                                    {username}
                                </Text>
                            </View>
                        </ListItem>
                        <ListItem onPress={() => this.setState({ modalVisible: true, label: "Gender" })}>
                            <View>
                                <Text style={styles.textHeader}>Gender</Text>
                                <Text mode style={styles.text}>
                                    {gender}
                                </Text>
                            </View>
                        </ListItem>
                    </List>
                </ScrollView>
                <List>
                    <ListItem onPress={() => this._logout()}>
                        <Icon type="FontAwesome" name={"sign-out"} style={{ color: "grey" }} />
                        <Text style={{ paddingLeft: 10 }}>LOGOUT</Text>
                    </ListItem>
                </List>
                <Modal
                    visible={this.state.modalVisible}
                    onDismiss={() => this.setState({ modalVisible: false })}
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    animationType="fade"
                >
                    <View style={styles.ModalContainer}>
                        <TextInput
                            label={this.state.label}
                            mode="outlined"
                            // autoCompleteType="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => this.setState({ text })}
                            style={styles.TextInput}
                            theme={{ colors: { primary: color[3] } }}
                        />
                    </View>
                </Modal>
                <Modal
                    visible={this.state.DPModal}
                    onDismiss={() => this.setState({ DPModal: false })}
                    onRequestClose={() => this.setState({ DPModal: false })}
                    animationType="fade"
                >
                    <View style={styles.displayPictureModalContainer}>
                        {profilePicture ? (
                            <Image source={profilePicture} style={styles.displayPictureModal} />
                        ) : (
                            <Icon type="FontAwesome" name="user" style={styles.displayPictureModal} />
                        )}
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeToken: () => dispatch(removeToken()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
