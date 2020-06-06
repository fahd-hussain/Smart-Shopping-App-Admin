import { StyleSheet, Dimensions } from "react-native";
import color from "../../constants/color";

const width = Dimensions.get("window").width;
const scale = Dimensions.get("window").scale

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
    },
    Logo1: {
        fontSize: width/ (scale*2),
        fontWeight: "bold",
        marginHorizontal: "5%",
        // marginTop: 10,
        color: color[4],
    },
    Logo2: {
        fontSize: width/ (scale*2.5),
        fontWeight: "bold",
        marginHorizontal: "5%",
        // paddingTop: ,
        color: color[3],
    },
    Underline: {
        borderBottomColor: color.logo2,
        borderBottomWidth: 5,
        borderRadius: 10,
        marginHorizontal: "5%",
        marginTop: 4,
    },
    FormText: {
        fontSize: width/ (scale*6),
        marginLeft: "5%",
        marginTop: 20,
        color: color[4],
    },
    TextInput: {
        marginHorizontal: "5%",
        marginTop: 18,
    },
    TextInput2: {
        width: "40%",
        marginHorizontal: "5%",
        marginTop: 18,
    },
    rowFlex: {
        flexDirection: "row",
    },
    radioButton: {
        marginTop: 8,
        color: "black",
        flexDirection: "row",
        marginHorizontal: "5%",
    },
    rowButtonFlex: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
    },
    btn1: {
        backgroundColor: color[4]
    },
    btn2: {
        backgroundColor: color[3]
    }
});
