import { Dimensions, StyleSheet } from 'react-native'
var windowSize = Dimensions.get('window');

export default StyleSheet.create({
    rootContainer: {
        flexDirection: "column",
        width: '100%',
    },

    headerContainer: {
        height: 50,
        flexDirection: 'row',
    },

    iconViewContainer: {
        backgroundColor: 'transparent'
    },

    iconView: {
        height: 50,
        width: 50,
        borderRadius: 10,
        backgroundColor: 'grey',
        alignSelf: 'center',
    },

    headercenterBodyContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginLeft: 8,
        flexDirection: 'column'
    },

    headlineContainer: {
        flex: 0.5,
        backgroundColor: 'transparent'
    },

    headlineText: {
        marginRight: 3,
        fontSize: 16,
        fontWeight: 'bold'
    },

    sponsoredTranslationContainer: {
        flex: 0.5,
        backgroundColor: 'transparent'
    },

    sponsoredTranslationText: {
        // fontSize: 11.5,
        lineHeight: 18,
        marginRight: 3,
        fontFamily: "GoogleSans-Regular",
        color: '#515365',
        // marginTop: -1
    },

    mediaViewContainer: {
        width: '100%',
        marginHorizontal: 0,
        alignSelf: 'center',
        height: 50,
        // position: 'absolute'
    },

    mediaViewSection: {
        // flex: 1,
        height: 50,
        width: '100%',
        position: 'absolute'
    },

    advertiserNameText: {
        marginLeft: '5%',
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },

    callToActionContainer: {
        alignItems: 'center'
    },

    callToActionButton: {
        fontSize: 14,
        width: '90%',
        textAlign: 'center',
        fontWeight: '700',
        lineHeight: 36,
        height: 36,
        color: '#fff',
        borderTopWidth: 0,
        borderRadius: 3,
        backgroundColor: '#F2C67B',
        marginVertical: 8
    },

    AdChoicesViewContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#F2C67B'
    },

    translationText: {
        color: 'rgba(0,0,0,0.23)',
        position: 'absolute',
        top: 0,
        right: 30,
        height: 20,
        lineHeight: 20,
        fontSize: 13,
    }
})