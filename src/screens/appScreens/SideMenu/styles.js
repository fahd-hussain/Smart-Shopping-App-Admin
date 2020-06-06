import { StyleSheet, Dimensions } from "react-native";

import color from "../../../constants/color";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color[4],
    },
    displayPictureContainer: {
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    displayPictureText: { 
        paddingTop: 10 
    },
    avatar: {
        fontSize: ((Dimensions.get("window").width * 1) / 2) - 10,
        marginBottom: "5%",
        color: color[5]
    },
    displayPictureModalContainer: {
        flex: 1, 
        justifyContent: "center",
        alignItems: "center", 
        marginLeft: "30%"
    },
    displayPictureModal: {
        width: Dimensions.get("window").width * 1,
        height: Dimensions.get("window").width * 1,
        fontSize: Dimensions.get("window").width,
        color: color[5]
    }
});
