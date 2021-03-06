import React from 'react';
import {
    View,
    StatusBar,
    Text,
    PermissionsAndroid,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import BaseNavigator from '../routes/BaseNavigator';
import { getMedia } from '../redux/actions/data';
import { adRequest } from '../redux/actions/adSettings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import BottomNowPlaying from '../components/BottomNowPlaying';
import { toggleTheme } from '../redux/actions/settings';
import SplashScreen from 'react-native-splash-screen';

const Container = (props) => {
    const [vol] = React.useState(false);
    const dispatch = useDispatch();
    const { songs } = useSelector((state) => state.data);
    const { theme } = useSelector((state) => state.settings);
    const { adResponse } = useSelector((state) => state.adSettings);

    React.useEffect(() => {
        props.getMedia();
        props.adRequest();
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
        if (theme === 'light') {
            dispatch(toggleTheme('light'));
        } else {
            dispatch(toggleTheme('dark'));
        }
    }, []);

    const bc = theme === 'light' ? '#fff' : '#0e0e0e';
    const bar = theme === 'light' ? 'dark-content' : 'light-content';

    return (
        <SafeAreaView style={{
            backgroundColor: bc,
            flex: 1,
        }}>
            <View
                style={{
                    backgroundColor: bc,
                    flex: 1,
                }}>
                <StatusBar backgroundColor={bc} barStyle={bar} />

                {songs
                    ?
                    <>
                        {songs.length > 0 ? (
                            <BaseNavigator />
                        ) : (
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        width: '20%',
                                        height: '8%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <LottieView
                                        source={require('../assets/images/loading.json')}
                                        autoPlay
                                        loop
                                    />
                                </View>
                                <Text style={{ color: '#fff', fontFamily: 'OpenSans' }}>
                                    fetching songs...
                                </Text>
                                {vol && (
                                    <Text
                                        style={{
                                            color: '#999',
                                            fontSize: 10,
                                            marginTop: 3,
                                            fontFamily: 'OpenSans',
                                        }}>
                                        High Volume
                                    </Text>
                                )}
                            </View>
                        )}
                    </>
                    :
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                            }}>
                            <LottieView
                                source={require('../assets/images/no_data.json')}
                                autoPlay
                                loop
                            />
                        </View>
                    </View>
                }

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#121212',
        padding: 10,
        fontSize: 22,
        marginLeft: 10,
        marginBottom: 10,
    },
});

Container.propTypes = {
    getMedia: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
    data: state.data,
    adSettings: state.adSettings,
});

const mapActionsToProps = {
    getMedia,
    adRequest
};
export default connect(mapStateToProps, mapActionsToProps)(Container);