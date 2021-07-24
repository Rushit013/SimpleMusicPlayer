import React from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { AdMobBanner } from 'react-native-admob';
import { NativeAdsManager } from 'react-native-fbads';
import NativeAdView from './NativeAdView';
import MediumNativeAdView from './MediumNativeAdView';
import { getAdKey } from '../util/Adsaction';
import { useSelector } from 'react-redux';

const win = Dimensions.get('window');
const BannerAd = ({ adSize, theme }) => {
    const onFailToRecieveAd = (error) => console.log(error);

    const { adResponse } = useSelector((state) => state.adSettings);
    const [adConfig, setAdconfig] = React.useState({});

    React.useEffect(async () => {
        const response = await getAdKey(adResponse);
        setAdconfig(response)
    }, [])

    const { current } = theme;
    const { nativeAdPlacementId, bannerAdPlacementId, InterstitialAdPlacementId, current_advertise_type } = adConfig;

    const adsManager = new NativeAdsManager(nativeAdPlacementId, 30);

    const bg = current === 'dark' ? '#F9F6F0' : '#F6FCFF';

    const renderAdComponent = (current_advertise_type) => {
        switch (current_advertise_type) {
            case 0:
                return (
                    <View style={{ height: 'auto', width: adSize === 'banner' ? '100%' : win.width, backgroundColor: bg }}>
                        {adSize === 'banner'
                            ?
                            <NativeAdView adsManager={adsManager} theme={current} />
                            :
                            <MediumNativeAdView adsManager={adsManager} theme={current} />
                        }
                    </View>
                );
            case 1:
                return (
                    <AdMobBanner
                        adSize={adSize}
                        adUnitID={bannerAdPlacementId}
                        // testDevices={[AdMobBanner.simulatorId]}
                        didFailToReceiveAdWithError={onFailToRecieveAd}
                    />
                );
        }
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {renderAdComponent(current_advertise_type)}
        </View>
    );
};

BannerAd.defaultProps = {
    adSize: "banner"
}

export default BannerAd;
