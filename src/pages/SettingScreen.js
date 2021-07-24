import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { withTheme } from 'styled-components/native';
import Toast from '../components/Toast';
import Menu from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-paper';
import * as actions from '../redux/actions';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { AdMobInterstitial } from 'react-native-admob';
import BannerAd from '../components/BannerAd';
import { getAdKey } from '../util/Adsaction';
import { InterstitialAdManager } from 'react-native-fbads';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native'

const clearCache = async () => {
    try {
        const { unlink, dirs } = RNFetchBlob.fs;
        await unlink(dirs.DocumentDir + '/.SimpleMusicPlayer');
        Toast('Cache Cleared');
    } catch (e) {
        console.log(e)
        Toast('Something went wrong!!');
    }
};

function SettingScreen(props) {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const dispatch = useDispatch();

    const Interstitial_onToggleSwitch = () => {
        const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

        if (current_advertise_type === 0) {
            InterstitialAdManager.showAd(InterstitialAdPlacementId)
                .then(() => onToggleSwitch())
                .catch(() => onToggleSwitch());
        } else if (current_advertise_type === 1) {
            AdMobInterstitial.showAd()
                .then(() => onToggleSwitch())
                .catch(error => {
                    onToggleSwitch()
                    console.warn(error)
                });
        } else {
            onToggleSwitch()
        }
    }

    const onToggleSwitch = () => {
        if (!isSwitchOn) {
            dispatch(props.toggleTheme('dark'));
        } else {
            dispatch(props.toggleTheme('light'));
        }
        setIsSwitchOn(!isSwitchOn);
    };

    const { current, background, border, txtColor, contrastBg } = props.theme;

    const { adResponse } = useSelector((state) => state.adSettings);
    const [adConfig, setAdconfig] = React.useState({});

    React.useEffect(async () => {
        setIsSwitchOn(current === 'light' ? false : true);

        const response = await getAdKey(adResponse);
        setAdconfig(response)
        setupAdmobIntrestrial(response)
    }, [])

    const setupAdmobIntrestrial = (response) => {
        const { InterstitialAdPlacementId, current_advertise_type } = response;
        if (current_advertise_type === 1) {
            AdMobInterstitial.setAdUnitID(InterstitialAdPlacementId);
            AdMobInterstitial.requestAd().catch(error => console.warn(error));
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <View
                style={[
                    styles.header,
                    { backgroundColor: background, borderBottomColor: border },
                ]}>
                <TouchableOpacity
                    onPress={() => props.navigation.openDrawer()}
                    style={{
                        width: '10%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Menu name="menu" size={27} color={txtColor} />
                </TouchableOpacity>
                <View
                    style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            textAlign: 'left',
                            width: '100%',
                            marginLeft: 35,
                            fontWeight: '700',
                            fontFamily: 'sans-serif-light',
                            fontSize: 18,
                            color: txtColor,
                        }}>
                        Setting
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 64, width: '100%', height: '100%' }}>
                <View
                    activeOpacity={1}
                    style={[
                        styles.item,
                        { backgroundColor: background, borderBottomColor: border },
                    ]}>
                    <View style={styles.left}>
                        <Text style={styles.txt}>Dark theme</Text>
                    </View>
                    <View style={styles.right}>
                        {/* <Switch
                            value={isSwitchOn}
                            onValueChange={Interstitial_onToggleSwitch}
                            color="#2EC7FC"
                        /> */}
                        <ToggleSwitch
                            isOn={isSwitchOn}
                            onColor="#2EC7FC"
                            size="medium"
                            onToggle={Interstitial_onToggleSwitch}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={clearCache}
                    activeOpacity={1}
                    style={[
                        styles.item,
                        { backgroundColor: background, borderBottomColor: border },
                    ]}>
                    <View style={styles.left}>
                        <Text style={styles.txt}>Clear Cache</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ marginVertical: 40 }}>
                    <BannerAd adSize={'mediumRectangle'} theme={props.theme} adConfig={adConfig} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: 0,
        height: 64,
        borderWidth: 0.5,
        borderColor: 'transparent',
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },

    item: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        overflow: 'hidden',
        borderWidth: 0.7,
        borderColor: 'transparent',
        borderBottomColor: '#ecf1f7',
        backgroundColor: '#fff',
    },

    txt: {
        marginLeft: 20,
        fontSize: 18,
        color: '#6b6b6b',
        borderRadius: 10,
        fontFamily: 'sans-serif-medium',
    },

    left: {
        width: '85%',
        height: 60,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    right: {
        width: '15%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});

export default connect('', actions)(withTheme(SettingScreen));
