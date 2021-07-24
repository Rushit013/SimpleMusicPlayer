import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Menu from 'react-native-vector-icons/Feather';
import _ from 'underscore';
import { withTheme } from 'styled-components/native';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
import BannerAd from '../components/BannerAd';
import { getAdKey } from '../util/Adsaction';

function FolderScreen(props) {
  const { songs } = useSelector((state) => state.data);

  const { adResponse } = useSelector((state) => state.adSettings);
  const [adConfig, setAdconfig] = React.useState({});

  React.useEffect(async () => {
    const response = await getAdKey(adResponse);
    setAdconfig(response)
  }, [])

  let data = _.groupBy(songs, 'folder');
  let folder = Object.keys(data);

  const { txt, header, bg, bg2, border, nativeColor, contrastBg } = props.theme;

  function Item2({ data, index, arr, bc, border, txtColor }) {
    let bi = _.groupBy(songs, 'folder');
    return (
      <View
        key={index}
        style={[styles.item, { backgroundColor: bc, borderBottomColor: border }]}>
        <View style={styles.left}>
          <Text style={[styles.itemTxt, { color: txtColor }]} numberOfLines={1}>
            {data}
          </Text>
        </View>
        <View style={styles.select}>
          <View
            style={{
              backgroundColor: nativeColor,
              width: '70%',
              height: 30,

              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff' }} numberOfLines={1}>
              {bi[data].length} {bi[data].length <= 1 ? 'song' : 'songs'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const renderFooterComponent = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 40 }}>
        <BannerAd adSize="mediumRectangle" theme={props.theme} adConfig={adConfig} />
      </View>
    )
  }

  const navigate = (title, data) => {
    props.navigation.navigate('LibrarySong', {
      title: title,
      data: data,
    });
  };

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
              color: bg,
            }}>
            Folder
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 64, width: '100%', height: '100%' }}>
        {folder.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            data={folder}
            renderItem={({ item, index }) =>
              item !== '' && (
                <>
                  {index % 10 == 0
                    ?
                    <>
                      <BannerAd theme={props.theme} adConfig={adConfig} />
                      <TouchableOpacity
                        onPress={() => navigate(item, data[item])}
                        key={item}
                        activeOpacity={1}
                      // style={{
                      //   marginBottom: folder.length - 1 === index ? 220 : 0,
                      // }}
                      >
                        <Item2
                          data={item}
                          index={index}
                          arr={folder}
                          bc={bg2}
                          border={border}
                          txtColor={txt}
                        />
                      </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity
                      onPress={() => navigate(item, data[item])}
                      key={item}
                      activeOpacity={1}
                    // style={{
                    //   marginBottom: folder.length - 1 === index ? 220 : 0,
                    // }}
                    >
                      <Item2
                        data={item}
                        index={index}
                        arr={folder}
                        bc={bg2}
                        border={border}
                        txtColor={txt}
                      />
                    </TouchableOpacity>
                  }
                </>

              )
            }
            keyExtractor={(item) => item}
            ListFooterComponent={renderFooterComponent}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#999' }}>No Folder's Found</Text>
          </View>
        )}
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

  itemTxt: {
    marginLeft: 20,
    fontSize: 18,
    color: '#6b6b6b',
    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },

  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    width: '60%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  select: {
    width: '40%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
export default connect('', actions)(withTheme(FolderScreen));
