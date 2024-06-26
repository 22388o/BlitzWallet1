import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../constants';

import {useNavigation} from '@react-navigation/native';
import {useGlobalContextProvider} from '../../../../context-store/context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ANDROIDSAFEAREA} from '../../../constants/styles';

export default function NavBar() {
  console.log('NAV BAR PAGE');

  const navigate = useNavigation();
  const insets = useSafeAreaInsets();
  const {nodeInformation, theme, toggleTheme} = useGlobalContextProvider();

  return (
    <View
      style={[
        styles.topBar,
        // {marginTop: insets.top < 20 ? ANDROIDSAFEAREA : insets.top}, line is needed for custom scrollview
      ]}>
      <TouchableOpacity
        onPress={() => {
          toggleTheme(!theme);
        }}
        activeOpacity={0.5}>
        <Image
          style={[styles.imgIcon, {marginLeft: 0}]}
          source={theme ? ICONS.lightMode : ICONS.darkMode}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate.navigate('ConnectionToNode')}
        style={{
          ...styles.connectionToNodeIcon,
          backgroundColor: nodeInformation.didConnectToNode
            ? COLORS.connectedNodeColor
            : COLORS.notConnectedNodeColor,
          marginLeft: 'auto',
        }}></TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigate.navigate('SettingsHome');
        }}
        activeOpacity={0.5}>
        <Image style={styles.imgIcon} source={ICONS.settingsIcon} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  //   topBar
  topBar: {
    width: '90%',
    height: 35,
    display: 'flex',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
    zIndex: 1,
  },
  topBarName: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },

  connectionToNodeIcon: {
    width: 17.5,
    height: 17.5,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});
