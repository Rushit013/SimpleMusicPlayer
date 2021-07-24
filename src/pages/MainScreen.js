import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Button
} from 'react-native';
import { useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import Menu from 'react-native-vector-icons/Feather';
import { withTheme } from 'styled-components/native';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';

import Songs from '../components/Songs';
import Details from '../components/Details';
import { Banner } from 'react-native-paper';
import {
    AdMobBanner,
    AdMobInterstitial,
    AdMobRewarded,
    PublisherBanner,
} from 'react-native-admob';
import BannerAd from '../components/BannerAd';
import { BannerView, InterstitialAdManager, AdSettings } from 'react-native-fbads';
// import { bannerAdPlacementId, InterstitialAdPlacementId, current_advertise_type } from '../util/Adskeys';
import { getAdKey } from '../util/Adsaction';

const MainScreen = (props) => {
    const [info, setInfo] = React.useState(false);
    const { adResponse } = useSelector((state) => state.adSettings);
    const [adConfig, setAdconfig] = React.useState({});

    React.useEffect(async () => {
        EventRegister.emit('shift', false);

        const response = await getAdKey(adResponse);
        setAdconfig(response);
        setupAdmobIntrestrial(response);
        // setupFbAds()
    }, []);

    const setupAdmobIntrestrial = (response) => {
        const { InterstitialAdPlacementId, current_advertise_type } = response;
        if (current_advertise_type === 1) {
            AdMobInterstitial.setAdUnitID(InterstitialAdPlacementId);
            AdMobInterstitial.requestAd().catch(error => console.warn(error));
        }
    }

    const setupFbAds = async () => {
        const DeviceHash = await AdSettings.currentDeviceHash;
        AdSettings.clearTestDevices();
        AdSettings.addTestDevice(DeviceHash);
    }

    const { header, bg, bg2, border, contrastBg } = props.theme;

    const Interstitial_setInfo = () => {
        const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

        if (current_advertise_type === 0) {
            InterstitialAdManager.showAd(InterstitialAdPlacementId)
                .then(() => setInfo(!info))
                .catch(() => setInfo(!info));
        } else if (current_advertise_type === 1) {
            AdMobInterstitial.showAd()
                .then(() => setInfo(!info))
                .catch(error => {
                    setInfo(!info)
                    console.warn(error)
                });
        } else {
            setInfo(!info)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: bg2 }]}>
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: header,
                        borderColor: 'transparent',
                        borderBottomColor: border,
                        borderWidth: 0.5,
                    },
                ]}>
                <TouchableOpacity
                    onPress={() => props.navigation.openDrawer()}
                    style={{
                        width: '10%',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Menu name="menu" size={27} color={bg} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: '80%',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => Interstitial_setInfo()}>
                    <Text
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: 30,
                            color: bg,
                            fontFamily: 'Monoton',
                        }}>
                        MUSIC
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        width: '10%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}></View>
            </View>

            <View
                style={{
                    marginTop: 64,
                    width: '100%',
                    height: '100%',
                }}>
                <Banner
                    visible={info}
                    actions={[]}
                    style={{
                        borderColor: 'transparent',
                        width: Dimensions.get('screen').width,
                        backgroundColor: '#ecf1f7',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Details />
                </Banner>
                <Songs />

            </View>
        </View>
    )
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
    },
    item: {
        height: 60,
        backgroundColor: '#fff',
        borderWidth: 0.7,
        borderColor: 'transparent',
        borderBottomColor: '#ecf1f7',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    cover: {
        width: 45,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    left: {
        width: '20%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        width: '80%',
        height: 60,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});

export default connect('', actions)(withTheme(React.memo(MainScreen)));