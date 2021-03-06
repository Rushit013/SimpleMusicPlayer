import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    BackHandler,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addPlaylistSong, deletePlaylistSong } from '../redux/actions/playlist';

import Menu from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import { withTheme } from 'styled-components/native';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
import BannerAd from '../components/BannerAd';
import { getAdKey } from '../util/Adsaction';

function AddSongToPlaylist(props) {
    const dispatch = useDispatch();

    const { songs } = useSelector((state) => state.data);
    const { playlistSongs } = useSelector((state) => state.playlist);
    const { adResponse } = useSelector((state) => state.adSettings);
    const [adConfig, setAdconfig] = React.useState({});

    React.useEffect(async () => {
        const response = await getAdKey(adResponse);
        setAdconfig(response)

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonClick,
            );
        };
    }, []);

    const handleBackButtonClick = () => {
        props.navigation.goBack();
        return true;
    };

    const { txt, header, bg, bg2, border, baseColor, contrastBg } = props.theme;

    const selectId = (data) => {
        const item = {
            id: data.id + props.route.params.data,
            title: data.title,
            artist: data.artist,
            url: data.url,
            artwork: data.artwork,
            album: data.album,
            duration: data.duration,
            fileName: data.fileName,
            db: props.route.params.data,
            index: data.index,
        };

        if (playlistSongs.some((res) => res.id === item.id)) {
            dispatch(deletePlaylistSong(item.id));
        } else dispatch(addPlaylistSong(item));
    };

    function Item2({ data, index, l, bc, border, txtColor }) {
        return (
            <View
                key={index}
                style={[styles.item, { backgroundColor: bc, borderBottomColor: border }]}>
                <View style={styles.left}>
                    {data.artwork ? (
                        <Image source={{ uri: data.artwork }} style={styles.cover} />
                    ) : (
                        <View style={[styles.cover, { borderColor: border }]}>
                            <Icon
                                name="ios-musical-notes-outline"
                                size={30}
                                color={txtColor}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.right}>
                    <Text style={[styles.itemTxt, { color: txtColor }]} numberOfLines={1}>
                        {data.title ? data.title : data.fileName.replace('.mp3', '')}
                    </Text>
                    <Text style={[styles.item2, { width: '90%' }]}>
                        {data.album && data.album.trim()}
                    </Text>
                    <Text style={styles.item2} numberOfLines={1}>
                        {data.artist}
                    </Text>
                </View>
                <View style={styles.select}>
                    <View
                        style={{
                            backgroundColor: playlistSongs.some(
                                (res) => res.id === data.id + props.route.params.data,
                            )
                                ? contrastBg
                                : baseColor,
                            width: 20,
                            height: 20,
                            borderRadius: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {playlistSongs.some(
                            (res) => res.id === data.id + props.route.params.data,
                        ) && <Menu name="check" color="#fff" size={15} />}
                    </View>
                </View>
            </View>
        );
    }

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
                        width: '80%',

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontWeight: '700',
                            fontFamily: 'sans-serif-light',
                            fontSize: 18,
                            color: bg,
                            textTransform: 'capitalize',
                        }}>
                        {props.route.params.data}
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 64, width: '100%', height: '100%' }}>
                <FlatList
                    data={songs}
                    onEndReachedThreshold={1200}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    // disableVirtualization={true}
                    legacyImplementation={false}
                    renderItem={({ item, index }) =>
                        item.id !== '' && (
                            <>
                                {index % 10 == 0
                                    ?
                                    <>
                                        <BannerAd theme={props.theme} adConfig={adConfig} />
                                        <TouchableOpacity
                                            onPress={() => selectId(item)}
                                            key={index + 'j'}
                                            activeOpacity={0.7}
                                            style={{
                                                marginBottom: songs.length - 1 === index ? 220 : 0,
                                            }}>
                                            <Item2
                                                data={item}
                                                index={index}
                                                id={item.id}
                                                bc={bg2}
                                                border={border}
                                                txtColor={txt}
                                            />
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <TouchableOpacity
                                        onPress={() => selectId(item)}
                                        key={index + 'j'}
                                        activeOpacity={0.7}
                                        style={{
                                            marginBottom: songs.length - 1 === index ? 220 : 0,
                                        }}>
                                        <Item2
                                            data={item}
                                            index={index}
                                            id={item.id}
                                            bc={bg2}
                                            border={border}
                                            txtColor={txt}
                                        />
                                    </TouchableOpacity>
                                }
                            </>

                        )
                    }
                    keyExtractor={(item) => item.id}
                />
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
        height: 70,
        width: '100%',
        overflow: 'hidden',

        borderWidth: 0.7,
        borderColor: 'transparent',
        backgroundColor: '#fff',
        borderBottomColor: '#ecf1f7',
    },

    itemTxt: {
        marginLeft: 10,
        fontSize: 12,
        width: '90%',
        borderRadius: 10,
        fontFamily: 'sans-serif-medium',
    },
    title: {
        fontSize: 32,
    },
    search: {
        paddingRight: 10,
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        // backgroundColor: '#fff',
    },
    item2: {
        marginLeft: 10,
        fontSize: 10,
        fontFamily: 'sans-serif-medium',
        color: '#6b6b6b',
        width: '70%',
    },
    result: {
        fontStyle: 'italic',
        fontFamily: 'sans-serif-medium',
        padding: 10,
        paddingTop: 0,
        textAlign: 'center',
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
    right: {
        flexDirection: 'column',
        width: '70%',
        height: 60,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    select: {
        width: '30%',
        height: 60,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});

export default connect('', actions)(withTheme(React.memo(AddSongToPlaylist)));
