import connectToNode from './connectToNode';
import {getLocalStorageItem, setLocalStorageItem} from './localStorage';
import RotatingAnimation from './rotatingAnimation';
import {retrieveData, terminateAccount, storeData} from './secureStore';
import generateMnemnoic from './seed';
import shuffleArray from './shuffleArray';
import {
  hasHardware,
  hasSavedProfile,
  handleLogin,
} from './biometricAuthentication';
import formatBalanceAmount from './formatNumber';

import copyToClipboard from './copyToClipboard';
import {getClipboardText, getQRImage} from './sendBitcoin';
import numberConverter from './numberConverter';

export {
  connectToNode,
  retrieveData,
  terminateAccount,
  storeData,
  generateMnemnoic,
  shuffleArray,
  RotatingAnimation,
  getLocalStorageItem,
  setLocalStorageItem,
  hasHardware,
  hasSavedProfile,
  handleLogin,
  formatBalanceAmount,
  copyToClipboard,
  getClipboardText,
  getQRImage,
  numberConverter,
};
