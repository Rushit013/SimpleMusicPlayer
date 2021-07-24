import {combineReducers} from 'redux';
import data from './data';
import settings from './settings';
import search from './search';
import playlist from './playlist';
import favorite from './favorite';
import playback from './playback';
import history from './history';
import adSettings from './adSettings';

export default combineReducers({
  data,
  playlist,
  settings,
  search,
  favorite,
  playback,
  history,
  adSettings
});
