import {
  PERMISSIONS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export const checkFilePermission = async () => {
  if (Platform.OS === 'android') {
    const status = await checkMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      status[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
      status[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
    ) {
      return true;
    } else {
      return false;
    }
  } else if (Platform.OS === 'ios') {
    return true;
  }
};

export const askFilePermission = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }
  const status = await requestMultiple([
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  ]);
  if (
    status[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
    status[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
  ) {
    return true;
  } else {
    return false;
  }
};
