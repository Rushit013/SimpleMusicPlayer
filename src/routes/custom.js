/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import * as React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Share from 'react-native-share';
import DashboardOperation from '../util/DashboardOperation';

class Custom extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  _Share = () => {
    Share.open({
      message:
        'Download SimpleMusicPlayer and enjoy offline playing!!! \n https://play.google.com/store/apps/details?id=com.SimpleMusicPlayer',
    });
  };

  render() {
    const {
      settings: { theme },
      ...rest
    } = this.props;
    const bc2 = theme !== 'light' ? '#0c0c0c' : '#fafafa';
    // const inactive = theme !== 'light' ? '#29292a' : '#6b6b6b';
    const inactive = theme !== 'light' ? '#29292a' : '#13292A';

    return (
      <>
        <View style={{
          backgroundColor: inactive,
          alignItems: "center",
        }}>
          <Image source={require("../assets/images/logo.png")} style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginTop: 20
          }} />
          <Text style={{ fontWeight: "bold", fontSize: 16, marginVertical: 10, color: bc2, fontFamily: 'sans-serif-medium', }}>Music Player</Text>
        </View>
        <DrawerContentScrollView {...rest}>
          <View
            style={{
              backgroundColor: bc2,
              height: 1,
              width: '80%',
              left: '10%',
            }}></View>
          <DrawerItemList {...rest} />
        </DrawerContentScrollView>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 110 + 140,
          }}>
          <TouchableOpacity
            onPress={() => {
              DashboardOperation.onMoreApp();
            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
            }}>
            <View style={{ position: 'absolute', left: 30 }}>
              <Image source={require('../assets/images/playstore.png')} style={{
                height: 18,
                width: 18,
                resizeMode: 'contain',
                tintColor: inactive
              }} />
            </View>
            <Text
              style={{
                position: 'absolute',
                left: 63,
                color: inactive,
                fontSize: 12,
                fontFamily: 'sans-serif-medium',
              }}>
              Our Apps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DashboardOperation.onRateus();
            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 50,
            }}>
            <View style={{ position: 'absolute', left: 30 }}>
              <Image source={require('../assets/images/favorites.png')} style={{
                height: 18,
                width: 18,
                resizeMode: 'contain',
                tintColor: inactive
              }} />
            </View>
            <Text
              style={{
                position: 'absolute',
                left: 63,
                color: inactive,
                fontSize: 12,
                fontFamily: 'sans-serif-medium',
              }}>
              Rate App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DashboardOperation.onShare();
            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 100,
            }}>
            <View style={{ position: 'absolute', left: 20 }}>
              <Icon
                name="share-social-outline"
                size={20}
                style={{ marginLeft: 10, color: inactive }}
              />
            </View>
            <Text
              style={{
                position: 'absolute',
                left: 63,
                color: inactive,
                fontSize: 12,
                fontFamily: 'sans-serif-medium',
              }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

Custom.propTypes = {
  settings: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  settings: state.settings,
});

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Custom);
