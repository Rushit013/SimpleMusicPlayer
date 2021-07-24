import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { PublisherBanner } from 'react-native-admob';

const BannerAd = () => {
    const onFailToRecieveAd = (error) => console.log(error);

    return (
        <>
            <PublisherBanner
                adSize="fullBanner"
                adUnitID="ca-app-pub-3940256099942544/6300978111"
                testDevices={[PublisherBanner.simulatorId]}
                onAdFailedToLoad={onFailToRecieveAd}
            />
        </>
    );
};

export default BannerAd;
