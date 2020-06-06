import { StyleSheet } from 'react-native'
import color from '../../constants/color'

export default styles = StyleSheet.create({
    loadingView : {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    loadingText: {
        color: color[3],
        fontSize: 14,
        fontWeight: 'bold'
    }
})