import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
} from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import * as themes from '../themes';
import BottomMenu from './BottomMenu';
import { addFavorite, deleteFavorite } from '../redux/actions/favorite';
import {
  setPlayback,
  setCurrentTrack,
  setLoop,
  setShuffle,
  setQueueTrack,
} from '../redux/actions/playback';

import Ion from 'react-native-vector-icons/Ionicons';
import Toast from './Toast';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrackPlayer from 'react-native-track-player';
import { withTheme } from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import ProgressSlider from './ProgressSlider';
import BannerAd from './BannerAd';
import { AdMobInterstitial } from 'react-native-admob';
import { getAdKey } from '../util/Adsaction';
import { InterstitialAdManager } from 'react-native-fbads';

TrackPlayer.setupPlayer();

function Item2({ data, index, bc, border, txtColor, un }) {
  return (
    <View
      key={index}
      style={[styles.item, { backgroundColor: bc, borderBottomColor: border }]}>
      <View style={styles.left}>
        {data.artwork ? (
          <Image source={{ uri: data.artwork }} style={styles.cover} />
        ) : (
          <View style={[styles.cover]}>
            <Icon name="ios-musical-notes-outline" size={30} color={un} />
          </View>
        )}
      </View>
      <View style={styles.mid}>
        <Text style={[styles.itemTxt, { color: txtColor }]} numberOfLines={1}>
          {data.title ? data.title : data.title.replace('.mp3', '')}
        </Text>
        <Text style={[styles.item2, { width: '90%' }]}>
          {data.album ? data.album.trim() : 'unknown'}
        </Text>
        <Text style={styles.item2} numberOfLines={1}>
          {data.artist}
        </Text>
      </View>
      <View style={styles.right}>
        <BottomMenu song={data} />
      </View>
    </View>
  );
}

function NowPlaying(props) {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.settings);
  const { songs } = useSelector((state) => state.data);
  const { favorite } = useSelector((state) => state.favorite);

  const {
    currentTrack,
    loop,
    shuffle,
    isPlaying,
    queue,
    queueSong,
  } = useSelector((state) => state.playback);

  const scrollA = React.useRef(new Animated.Value(0)).current;

  const { adResponse } = useSelector((state) => state.adSettings);
  const [adConfig, setAdconfig] = React.useState({});

  React.useEffect(async () => {
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

  const { current, txt, txt2, bc, bg2, border, contrastBg } = props.theme;
  const unRecognized = current !== 'light' ? '#ccc' : '#121212';

  const currentPlay = (data) => {
    dispatch(setCurrentTrack(data));
  };

  function skipToNext() {
    if (queue) {
      const index = queueSong.findIndex(
        (data) => data.index === currentTrack.index,
      );

      let nextTrack = shuffle
        ? queueSong[getRandomNumber(0, queueSong.length)]
        : index === queueSong.length - 1
          ? queueSong[0]
          : queueSong[index + 1];
      dispatch(setQueueTrack(nextTrack));
    } else {
      let nextTrack = shuffle
        ? songs[getRandomNumber(0, songs.length)]
        : currentTrack.index === songs.length - 1
          ? songs[0]
          : songs[currentTrack.index + 1];
      dispatch(setCurrentTrack(nextTrack));
    }
  }

  function skipToPrevious() {
    if (queue) {
      const index = queueSong.findIndex(
        (data) => data.index === currentTrack.index,
      );
      let nextTrack = shuffle
        ? queueSong[getRandomNumber(0, queueSong.length)]
        : index === 0
          ? queueSong[queueSong.length - 1]
          : queueSong[index - 1];
      dispatch(setQueueTrack(nextTrack));
    } else {
      let nextTrack = shuffle
        ? songs[getRandomNumber(0, songs.length)]
        : currentTrack.index === 0
          ? songs[songs.length - 1]
          : songs[currentTrack.index - 1];
      dispatch(setCurrentTrack(nextTrack));
    }
  }

  function onShufflePress() {
    Toast(`Shuffle: ${shuffle ? 'Off' : 'On'}`);
    dispatch(setShuffle(!shuffle));
  }

  function onLoopPress() {
    Toast(`Loop ${loop ? 'all tracks' : 'this track'}`);
    dispatch(setLoop(!loop));
  }

  const Interstitial_favAction = (song) => {
    const { InterstitialAdPlacementId, current_advertise_type } = adConfig;

    if (current_advertise_type === 0) {
      InterstitialAdManager.showAd(InterstitialAdPlacementId)
        .then(() => favAction(song))
        .catch(() => favAction(song));
    } else if (current_advertise_type === 1) {
      AdMobInterstitial.showAd()
        .then(() => favAction(song))
        .catch(error => {
          favAction(song)
          console.warn(error)
        });
    } else {
      favAction(song)
    }
  }

  const favAction = (song) => {
    if (favorite.some((data) => data.id === song.id)) {
      props.deleteFavorite(song.id);
    } else {
      props.addFavorite(song);
    }
  };

  const Bar = () => (
    <View
      style={{
        flexDirection: 'column',
        height: 65,
        width: '100%',
        position: 'absolute',
        bottom: 0,
      }}>
      <View
        style={[
          styles.playing,
          {
            borderColor: 'transparent',
            backgroundColor: bc,
          },
        ]}
        activeOpacity={1}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback onPress={onLoopPress}>
              <Icon
                name="ios-repeat"
                size={25}
                color={loop ? contrastBg : txt}
              />
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '50%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback onPress={() => skipToPrevious()}>
                <Ion name="ios-play-skip-back" size={33} color={txt} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => dispatch(setPlayback(!isPlaying))}>
                <Ion
                  name={isPlaying ? 'pause' : 'play'}
                  size={40}
                  color={txt}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => skipToNext()}>
                <Ion name="ios-play-skip-forward" size={33} color={txt} />
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback onPress={onShufflePress}>
              <Icon
                name="ios-shuffle"
                size={25}
                color={shuffle ? contrastBg : txt}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      {currentTrack.title !== '' && (
        <Animated.ScrollView
          style={{ backgroundColor: bg2 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollA } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}>
          <View style={[styles.bigPlayer, { backgroundColor: bg2 }]}>
            <Animated.View style={styles.coverWrap(scrollA)}>
              <TouchableOpacity
                onPress={() => props.navigation.pop()}
                style={{
                  marginLeft: -Dimensions.get('window').width,
                  left: 30,
                }}>
                <Icon2
                  name="chevron-small-down"
                  size={30}
                  style={{ color: '#ccc' }}
                />
              </TouchableOpacity>
              {currentTrack.artwork ? (
                <View
                  style={{
                    elevation: 15,
                    width: '70%',
                    height: '70%',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={{ uri: currentTrack.artwork }}
                    style={styles.bigCover}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: '70%',
                    height: '70%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="ios-musical-notes-outline"
                      size={40}
                      color={txt}
                    />
                  </View>
                </View>
              )}
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: '700',
                  fontFamily: 'sans-serif-light',
                  padding: 5,
                  fontSize: 18,
                  maxWidth: '70%',
                  color: txt,
                }}>
                {currentTrack.title}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  fontWeight: '700',
                  fontFamily: 'sans-serif-light',
                  fontSize: 14,
                  color: txt2,
                }}>
                {currentTrack.album || 'unknown'}
              </Text>
              <TouchableOpacity
                onPress={() => Interstitial_favAction(currentTrack)}
                activeOpacity={1}
                style={{
                  width: '20%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: 0,
                }}>
                <Icon
                  name={
                    favorite.some((data) => data.url === currentTrack.url)
                      ? 'ios-heart-sharp'
                      : 'ios-heart-outline'
                  }
                  size={25}
                  style={{
                    color: favorite.some(
                      (data) => data.url === currentTrack.url,
                    )
                      ? '#ff3366'
                      : '#999',
                    marginTop: 10,
                  }}
                />
              </TouchableOpacity>
            </Animated.View>

            {songs.length > 0 &&
              songs
                .slice(currentTrack.index, currentTrack.index + 40)
                .map((data, i) => (
                  <>
                    {i % 8 == 0
                      ?
                      <>
                        <BannerAd theme={props.theme} adConfig={adConfig} />
                        <TouchableWithoutFeedback
                          onPress={() => currentPlay(data)}
                          key={i}>
                          <View>
                            <Item2
                              data={data}
                              index={i}
                              bc={bg2}
                              border={border}
                              // txtColor={data.id === currentTrack.id ? '#36C0FC' : txt}
                              txtColor={data.id === currentTrack.id ? contrastBg : txt}
                              un={unRecognized}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </>
                      :
                      <TouchableWithoutFeedback
                        onPress={() => currentPlay(data)}
                        key={i}>
                        <View>
                          <Item2
                            data={data}
                            index={i}
                            bc={bg2}
                            border={border}
                            // txtColor={data.id === currentTrack.id ? '#36C0FC' : txt}
                            txtColor={data.id === currentTrack.id ? contrastBg : txt}
                            un={unRecognized}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    }
                  </>
                ))}
          </View>
        </Animated.ScrollView>
      )}
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>
        <ThemeProvider theme={themes[theme]}>
          <ProgressSlider />
        </ThemeProvider>
      </View>
      {currentTrack.title !== '' && <Bar />}
    </>
  );
}

const styles = StyleSheet.create({
  thumbnailCover: {
    width: 55,
    height: 55,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  playing: {
    width: '100%',
    height: 65,
    backgroundColor: '#fafafa',
    borderWidth: 0.7,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '15%',
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '60%',
    height: 65,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 2,

    // lineHeight: 40,
  },
  controller: {
    width: '25%',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  bigPlayer: {
    marginTop: -1000,
    paddingTop: 1000,
    backgroundColor: '#fff',
    marginBottom: '100%',
  },
  coverWrap: (scrollA) => ({
    width: '100%',
    height: 400,
    justifyContent: 'flex-start',
    alignItems: 'center',
    transform: [
      {
        translateY: scrollA,
      },
    ],
  }),
  bigCover: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'stretch',
  },
  progress: {
    width: '100%',
    height: '60%',
  },

  slide: {
    width: '100%',
    height: 270,
    backgroundColor: '#fff',

    elevation: 28,
  },
  img: {
    width: '100%',
    height: 270,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#ecf1f7',
  },

  itemTxt: {
    marginLeft: 10,
    fontSize: 12,

    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },

  search: {
    paddingRight: 10,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
  },
  item2: {
    marginLeft: 10,
    fontSize: 10,
    fontFamily: 'sans-serif-medium',
    color: '#6b6b6b',
    width: '70%',
  },

  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    width: '20%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    flexDirection: 'column',
    width: '70%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'column',
    width: '10%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  Timer: {
    fontWeight: '700',
    fontFamily: 'sans-serif-light',
    fontStyle: 'italic',
    backgroundColor: '#fafafa',
    padding: 4,
    borderWidth: 0.7,
    borderColor: '#eee',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'none',
  },
});
NowPlaying.propTypes = {
  data: PropTypes.object.isRequired,
  addFavorite: PropTypes.func.isRequired,
  deleteFavorite: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  addFavorite,
  deleteFavorite,
};
export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withTheme(React.memo(NowPlaying)));
