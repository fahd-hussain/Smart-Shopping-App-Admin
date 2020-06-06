import React, { Component } from "react";
import { View, SafeAreaView, ScrollView, Dimensions, Share, Button, Modal, AsyncStorage } from "react-native";
import { Text, List, ListItem, Icon } from "native-base";
import { Avatar } from "react-native-paper";
import { connect } from "react-redux";

// Local Imports
import { removeToken, updateCart } from "../../../redux";
import styles from "./styles";
import { aboutUs } from "./accountSettings";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { images } from "../../constants/images";

const LINKS = [
    {
        link: "PurchaseHistory",
        title: "Purchase History",
        iconName: "history",
    },
    {
        link: "Share",
        title: "Invite friends",
        iconName: "share",
    },
    {
        link: "Help",
        title: "Help",
        iconName: "question-circle",
    },
    {
        link: "AboutUs",
        title: "About",
        iconName: "info-circle",
    },
    {
        link: "Profile",
        title: "Accounts settings",
        iconName: "cog",
    },
    
];

class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            aboutUsModal: false,
            DPModal: false,
        };
    }

    _logout = () => {
        this.props.removeToken();
        this.props.navigation.navigate("Authentication");
        AsyncStorage.clear()
    };

    _share = () => {
        Share.share(
            {
                title: "Smart Shopping App",
                message:
                    "Smart Shopping App, best app to save time during shopping.\n" +
                    "Download Free from here: " +
                    "<URL OF APP>",
            },
            {
                dialogTitle: "Smart Shopping App",
            },
        );
    };

    _about_us = () => {
        this.setState({ aboutUsModal: true });
    };

    render() {
        const isAuth = this.props.user.user;
        const { _id, username, profilePicture, firstname, lastname, gender } = this.props.user.user;
        return (
            <SafeAreaView style={styles.container}>
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

                    {!isAuth ? null : (
                        <Text style={styles.displayPictureText} size="xl" bold>
                            Hi, {firstname} {lastname}
                        </Text>
                    )}
                </View>
                <ScrollView>
                    <List>
                        {LINKS.map((el) => (
                            <ListItem
                                onPress={() => {
                                    switch (el.link) {
                                        case "Share":
                                            this._share();
                                            return;
                                        case "AboutUs":
                                            this._about_us();
                                            return;
                                        default:
                                            // console.log(el.link)
                                            this.props.navigation.navigate(el.link);
                                    }
                                }}
                                key={el.link}
                            >
                                <Icon type="FontAwesome" name={el.iconName} style={{ color: "grey" }} />
                                <Text style={{ paddingLeft: 10 }}>{el.title}</Text>
                            </ListItem>
                        ))}
                    </List>
                </ScrollView>
                <List>
                    <ListItem onPress={() => this._logout()}>
                        <Icon type="FontAwesome" name={"sign-out"} style={{ color: "grey" }} />
                        <Text style={{ paddingLeft: 10 }}>LOGOUT</Text>
                    </ListItem>
                </List>
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
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeToken: () => dispatch(removeToken()),
        updateCart: () => dispatch(updateCart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
