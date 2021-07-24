/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/MaterialIcons';

import { addFavorite } from '../redux/actions/favorite';
import Toast from './Toast';
import Share from 'react-native-share';
import TrackPlayer from 'react-native-track-player';

import { useSelector, useDispatch } from 'react-redux';
import { addPlaylistSong } from '../redux/actions/playlist';
import { AdMobInterstitial } from 'react-native-admob';
// import { bannerAdPlacementId, InterstitialAdPlacementId, nativeAdPlacementId } from '../../../constants/Adskeys';
import { BannerView, InterstitialAdManager, NativeAdsManager, AdSettings } from 'react-native-fbads';
import { getAdKey } from '../util/Adsaction';

export default function BottomMenu(props) {
  const dispatch = useDispatch();

  const [visible, setVisible] = React.useState(false);
  const [visiblePlaylist, setVisiblePlaylist] = React.useState(false);
  const { playlist, playlistSongs } = useSelector((state) => state.playlist);
  const { favorite } = useSelector((state) => state.favorite);
  const { theme } = useSelector((state) => state.settings);

  const { adResponse } = useSelector((state) => state.adSettings);
  const [adConfig, setAdconfig] = React.useState({});

  React.useEffect(async () => {
    const response = await getAdKey(adResponse);
    setAdconfig(response);
    setupAdmobIntrestrial(response)
  }, [])

  const setupAdmobIntrestrial = (response) => {
    const { InterstitialAdPlacementId, current_advertise_type } = response;
    if (current_advertise_type === 1) {
      AdMobInterstitial.setAdUnitID(InterstitialAdPlacementId);
      AdMobInterstitial.requestAd().catch(error => console.warn(error));
    }
  }

  function onShare() {
    Share.open({
      url: `file://${props.song.url}`,
      type: 'audio/mp3',
      failOnCancel: false,
    });
  }

  const onAddPress = () => {
    setVisible(false);
    setVisiblePlaylist(true);
  };

  const Interstitial_AddFavorite = () => {
    const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

    if (current_advertise_type === 0) {
      InterstitialAdManager.showAd(InterstitialAdPlacementId)
        .then(() => _AddFavorite())
        .catch(() => _AddFavorite());
    } else if (current_advertise_type === 1) {
      AdMobInterstitial.showAd()
        .then(() => _AddFavorite())
        .catch(error => {
          _AddFavorite()
          console.warn(error)
        });
    } else {
      _AddFavorite()
    }
  }

  const _AddFavorite = () => {
    setVisible(false);
    if (
      favorite.some(
        (data) => data.id === props.song.id || data.index === props.song.index,
      )
    ) {
      Toast(`Already added to favorite`);
    } else {
      dispatch(addFavorite(props.song));
      Toast(`Added to favorite`);
    }
  };

  const Interstitial_onAdd = (db) => {
    const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

    if (current_advertise_type === 0) {
      InterstitialAdManager.showAd(InterstitialAdPlacementId)
        .then(() => onAdd(db))
        .catch(() => onAdd(db));
    } else if (current_advertise_type === 1) {
      AdMobInterstitial.showAd()
        .then(() => onAdd(db))
        .catch(error => {
          onAdd(db)
          console.warn(error)
        });
    } else {
      onAdd(db)
    }
  }

  const onAdd = (db) => {
    setVisiblePlaylist(false);

    if (playlistSongs.some((data) => data.id === props.song.id + db)) {
      Toast(`Already added to Playlist`);
    } else {
      const track = {
        id: props.song.id + db,
        title: props.song.title,
        artist: props.song.artist,
        url: props.song.url,
        artwork: props.song.artwork,
        album: props.song.album,
        duration: props.song.duration,
        fileName: props.song.fileName,
        db: db,
        index: props.song.index,
      };
      dispatch(addPlaylistSong(track));
      Toast(`Added to playlist`);
    }
  };

  const Interstitial_AddToQueue = () => {
    const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

    if (current_advertise_type === 0) {
      InterstitialAdManager.showAd(InterstitialAdPlacementId)
        .then(() => _AddToQueue())
        .catch(() => _AddToQueue());
    } else if (current_advertise_type === 1) {
      AdMobInterstitial.showAd()
        .then(() => _AddToQueue())
        .catch(error => {
          _AddToQueue()
          console.warn(error)
        });
    } else {
      _AddToQueue()
    }
  }

  const _AddToQueue = () => {
    setVisible(false);
    TrackPlayer.add(props.song);
    Toast(`Added to queue`);
  };

  const bg = theme === 'light' ? '#ffffff' : '#191818';
  const title = theme === 'light' ? '#121212' : '#6b6b6b';
  const album = theme === 'light' ? '#6b6b6b' : '#323738';
  const contrastBg = theme === 'light' ? '#2EC7FC' : '#EAC135';

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}>
        <Icon name="dots-three-vertical" size={15} color="#999" />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        backdropOpacity={0.5}
        backdropColor={bg}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}>
        <View style={{ flex: 1 }}>
          <View style={[styles.modal, { backgroundColor: bg }]}>
            {props.song.artwork && (
              <View style={[styles.artwork, { elevation: 18 }]}>
                <Image
                  source={{ uri: props.song.artwork }}
                  style={{ width: '100%', height: '100%', borderRadius: 5 }}
                  resizeMode="contain"
                />
              </View>
            )}
            <Text
              style={{
                marginTop: props.song.artwork ? '21%' : 20,
                fontWeight: '700',
                textAlign: 'center',
                width: '80%',
                color: title,
              }}
              numberOfLines={1}>
              {props.song.title}
            </Text>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 12,
                color: album,
              }}>
              {props.song.album || 'unknown'}
            </Text>
            <TouchableOpacity onPress={onAddPress} style={styles.item}>
              <Icon3
                name="playlist-plus"
                size={25}
                style={{ marginLeft: 10, color: '#5b5b5b' }}
              />
              <Text style={styles.txt}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={Interstitial_AddToQueue}
              style={[styles.item, { marginTop: 2 }]}>
              <Icon4
                name="queue-music"
                size={25}
                style={{ marginLeft: 10, color: '#5b5b5b' }}
              />
              <Text style={styles.txt}>Add to Queue</Text>
            </TouchableOpacity>
            {!props.favoriteHide && (
              <TouchableOpacity
                onPress={Interstitial_AddFavorite}
                style={[styles.item, { marginTop: 2 }]}>
                <Icon2
                  name="heart-outline"
                  size={25}
                  style={{ marginLeft: 10, color: '#5b5b5b' }}
                />
                <Text style={styles.txt}>Add to Favorite</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onShare}
              style={[styles.item, { marginTop: 2 }]}>
              <Icon2
                name="share-social-outline"
                size={25}
                style={{ marginLeft: 10, color: '#5b5b5b' }}
              />
              <Text style={styles.txt}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visiblePlaylist}
        backdropOpacity={0.5}
        backdropColor={bg}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => setVisiblePlaylist(false)}
        onBackdropPress={() => setVisiblePlaylist(false)}>
        <View style={{ flex: 1 }}>
          <View style={[styles.modal, { backgroundColor: bg }]}>
            {props.song.artwork && (
              <View style={[styles.artwork, { elevation: 18 }]}>
                <Image
                  source={{ uri: props.song.artwork }}
                  style={{ width: '100%', height: '100%', borderRadius: 5 }}
                />
              </View>
            )}
            <Text
              style={{
                marginTop: props.song.artwork ? '21%' : 20,
                fontWeight: '700',
                textAlign: 'center',
                width: '80%',
                color: title,
              }}
              numberOfLines={1}>
              {props.song.title}
            </Text>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 12,
                color: album,
              }}>
              {props.song.album || 'unknown'}
            </Text>
            {playlist.length > 0 ? (
              <FlatList
                data={playlist}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.item,
                      {
                        marginBottom: playlist.length - 1 === index ? 50 : 0,
                        marginTop: index === 0 ? 20 : 2,
                      },
                    ]}
                    key={index}>
                    <Text style={[styles.txt, { fontSize: 14 }]}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => Interstitial_onAdd(item)}
                      style={{
                        padding: 25,
                        paddingBottom: 4,
                        paddingTop: 4,
                        borderRadius: 20,
                        backgroundColor: contrastBg,
                        position: 'absolute',
                        right: 20,
                      }}
                      activeOpacity={0.7}>
                      <Text style={{ color: '#fff' }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item}
              />
            ) : (
              <Text style={{ color: '#999', marginTop: '10%' }}>
                No Playlist found !!!
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  modal: {
    height: '50%',
    width: '100%',
    borderRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 18,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    width: Dimensions.get('window').width,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  txt: {
    padding: 15,
    fontSize: 12,
    fontWeight: '700',
    color: '#5b5b5b',
    textTransform: 'capitalize',
  },
  artwork: {
    width: '50%',
    height: 200,

    position: 'absolute',
    top: '-30%',
    borderRadius: 5,
  },
});
