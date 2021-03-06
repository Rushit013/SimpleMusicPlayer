
import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    StyleSheet,
    Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { setCurrentTrack } from '../redux/actions/playback';
import BottomMenu from './BottomMenu';
import { withTheme } from 'styled-components/native';
import BannerAd from './BannerAd';
import PublisherbannerAd from './PublisherbannerAd';
// import { bannerAdPlacementId, InterstitialAdPlacementId, current_advertise_type } from '../util/Adskeys';
import { BannerView, InterstitialAdManager, AdSettings } from 'react-native-fbads';
import { getAdKey } from '../util/Adsaction';

function Item({ item, bc, border, txtColor }) {
    return (
        <View
            style={[styles.item, { backgroundColor: bc, borderBottomColor: border }]}>
            <View style={styles.left}>
                {item.artwork ? (
                    <Image source={{ uri: item.artwork }} style={styles.cover} />
                ) : (
                    <View style={[styles.cover, { borderColor: border }]}>
                        <Icon name="ios-musical-notes-outline" size={30} color={txtColor} />
                    </View>
                )}
            </View>

            <View style={styles.mid}>
                <Text
                    numberOfLines={1}
                    style={{
                        width: '90%',
                        color: txtColor,
                        fontWeight: '700',
                        fontFamily: 'sans-serif-light',
                        fontSize: 12,
                    }}>
                    {item.title || 'unknown'}
                </Text>
                <Text numberOfLines={1} style={styles.txt}>
                    {item.album ? item.album : 'unknown'}
                </Text>
            </View>

            <View style={styles.right}>
                <BottomMenu song={item} />
            </View>
        </View>
    );
}

const Songs = (props) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const { adResponse } = useSelector((state) => state.adSettings);
    const [adConfig, setAdconfig] = React.useState({});

    React.useEffect(async () => {
        const response = await getAdKey(adResponse);
        setAdconfig(response)
    }, [])

    const { songs } = data;
    const { bg2, txt, border, contrastBg } = props.theme;

    const push = (data) => {
        dispatch(setCurrentTrack(data))
    }

    const renderFooterComponent = () => {
        return (
            <View style={{ height: 220 }}>
            </View>
        )
    }

    return (
        <>
            {songs.length > 0 && (
                <FlatList
                    data={songs}
                    onEndReachedThreshold={1200}
                    initialNumToRender={300}
                    maxToRenderPerBatch={300}
                    disableVirtualization={true}
                    legacyImplementation={false}
                    renderItem={({ item, index }) => (
                        <>
                            {(index % 10 == 0)
                                ?
                                <>
                                    <BannerAd theme={props.theme} adConfig={adConfig} />
                                    <TouchableWithoutFeedback
                                        key={index + 'l'}
                                        onPress={() => push(item)}
                                        style={{
                                            marginBottom: songs.length - 1 === index ? 220 : 0,
                                        }}>
                                        <View>
                                            <Item item={item} bc={bg2} border={border} txtColor={txt} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </>
                                :
                                <TouchableWithoutFeedback
                                    key={index + 'l'}
                                    onPress={() => push(item)}
                                    style={{
                                        marginBottom: songs.length - 1 === index ? 220 : 0,
                                    }}>
                                    <View>
                                        <Item item={item} bc={bg2} border={border} txtColor={txt} />
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                        </>
                    )}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={renderFooterComponent}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        height: 60,
        backgroundColor: '#fff',
        borderWidth: 0.7,
        borderColor: 'transparent',
        borderBottomColor: '#E1E9EE',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
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
        width: '70%',
        height: 60,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    right: {
        width: '10%',
        height: '100%',
    },
    txt: {
        width: '90%',
        color: '#6b6b6b',
        fontWeight: '700',
        fontFamily: 'sans-serif-light',
        fontSize: 10,
    },
});

export default withTheme(React.memo(Songs));