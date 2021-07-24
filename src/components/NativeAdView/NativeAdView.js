import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import {
  withNativeAd,
  AdIconView,
  TriggerableView,
  MediaView,
  AdChoicesView,
} from 'react-native-fbads';
import styles from './styles';

const { width } = Dimensions.get('window');
var windowSize = Dimensions.get('window');

class NativeAdView extends Component {
  render() {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconViewContainer}>
            <AdIconView style={styles.iconView} />
          </View>
          <View style={styles.headercenterBodyContainer}>
            <TriggerableView style={styles.headlineContainer}>
              <Text style={styles.headlineText}>
                {this.props.nativeAd.headline}
              </Text>
            </TriggerableView>
            <TriggerableView style={styles.sponsoredTranslationContainer}>
              <Text numberOfLines={2} style={styles.sponsoredTranslationText}>
                {this.props.nativeAd.socialContext}
              </Text>
            </TriggerableView>
          </View>
          <MediaView nativeAdView={this.props.nativeAd} style={{ height: 1, width: 1 }} />
          <View style={{ alignItems: 'center', width: 100, height: 50, borderRadius: 3, }}>
          <TriggerableView
            style={{
              fontSize: 14,
              width: '100%',
              textAlign: 'center',
              fontWeight: '700',
              lineHeight: 50,
              height: 50,
              color: '#fff',
              borderTopWidth: 0,
              // borderRadius: 3,
              backgroundColor: this.props.theme === 'dark' ? '#900020' : '#08392B',

            }}
          >
            {this.props.nativeAd.callToActionText}
          </TriggerableView>
        </View>
        </View>
      
        {/* <AdChoicesView location="topRight" expandable={true} style={styles.AdChoicesViewContainer} />
        <Text style={styles.translationText}>Ad</Text> */}
      </View>
    );
  }
}

export default withNativeAd(NativeAdView);