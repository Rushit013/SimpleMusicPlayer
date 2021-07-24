import { Platform } from 'react-native';  

export const adResponse = {
	"app_id": 1,
	"app_name": "Player",
	"app_package_name": "com.manthanvanani.player",
	"current_advertise_type": 0,
	"package_name": "com.manthanvanani.player1",
	"redirect_url": "https://play.google.com/store/apps/details?id=com.manthanvanani.player1",
	"facebook_keys": {
		"android": {
			"interstitial": "418573849520500_544273330283884",
			"banner": "418573849520500_422870502424168",
			"native": "418573849520500_422852852425933"
		},
		"iOS": {
			"interstitial": "418573849520500_544274400283777",
			"banner": "418573849520500_544274033617147",
			"native": "418573849520500_544274516950432"
		}
	},
	"google_keys":  {
		"android": {
      "app_id" : "ca-app-pub-2867037774906335~9711492734",
			"interstitial": "ca-app-pub-3276678334967119/1935253146",
			"banner": "ca-app-pub-2867037774906335/9276378463",
			"native": "ca-app-pub-3276678334967119/3072224935"
		},
		"iOS": {
			"interstitial": "418573849520500_544274400283777",
			"banner": "418573849520500_544274033617147",
			"native": "418573849520500_544274516950432"
		}
	}
}

const current_advertise_type = 0;
const nativeAdPlacementId = Platform.OS === 'android' ? '5693223194028944_5693231514028112': '1474031309595484_1474031796262102';
const bannerAdPlacementId = Platform.OS === 'android' ? '5693223194028944_5693224587362138' : '1474031309595484_1474031542928794';
const InterstitialAdPlacementId = Platform.OS === 'android' ? '5693223194028944_5693229747361622' : '1474031309595484_1474031689595446';

export { nativeAdPlacementId, bannerAdPlacementId, InterstitialAdPlacementId, current_advertise_type };