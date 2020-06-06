import { StyleSheet, Dimensions } from "react-native";
import color from "../../../constants/color";

const dim = Dimensions.get("window");
const width = dim.width;
const height = dim.height;

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color[5],
        padding: viewPadding,
        paddingTop: 20,
    },
    list: {
        width: "100%",
    },
    listItem: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
    },
    hr: {
        height: 1,
        backgroundColor: color[3],
    },
    listItemCont: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textInput: {
        height: 40,
        paddingHorizontal: "3%",
        marginVertical: "3%",
        borderColor: "black",
        borderWidth: 2,
        textAlign: 'justify',
        width: "90%",
        fontSize: 24,
    },
    hideInput: {
        height: 50,
        width: "100%",
        paddingHorizontal: "10%",
        borderColor: "gray",
        borderWidth: isAndroid ? 0 : 1,
        fontSize: 24,
        textAlign: 'center',
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
    rowDir: {
        justifyContent: "space-between",
    },
    emptyScreen: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    modalButtonsRight: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    modalButtonsLeft: {
        position: "absolute",
        bottom: 20,
        left: 20,
    },
    btn1: {
        backgroundColor: color[3]
    }
});
