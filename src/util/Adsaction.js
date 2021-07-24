import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios' ? true : false;

export const getAdKey = (adSettings) => {
    return new Promise(async (resolve, reject) => {
        const { current_advertise_type, facebook_keys, google_keys } = adSettings;

        let nativeAdPlacementId, bannerAdPlacementId, InterstitialAdPlacementId;
        if (current_advertise_type === 0) {
            const { android, iOS } = facebook_keys;
            nativeAdPlacementId = isIOS ? iOS.native : android.native
            bannerAdPlacementId = isIOS ? iOS.banner : android.banner
            InterstitialAdPlacementId = isIOS ? iOS.interstitial : android.interstitial
        } else if (current_advertise_type === 1) {
            const { android, iOS } = google_keys;
            nativeAdPlacementId = isIOS ? iOS.native : android.native
            bannerAdPlacementId = isIOS ? iOS.banner : android.banner
            InterstitialAdPlacementId = isIOS ? iOS.interstitial : android.interstitial
        }

        resolve({ nativeAdPlacementId, bannerAdPlacementId, InterstitialAdPlacementId, current_advertise_type });
    })
};
