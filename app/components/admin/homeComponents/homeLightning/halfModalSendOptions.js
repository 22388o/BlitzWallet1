import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import {getClipboardText, getQRImage} from '../../../../functions';
import {ThemeText} from '../../../../functions/CustomElements';

export default function HalfModalSendOptions() {
  const navigate = useNavigation();
  const insets = useSafeAreaInsets();
  const {theme, nodeInformation} = useGlobalContextProvider();

  return (
    <TouchableWithoutFeedback onPress={() => navigate.goBack()}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: '60%',
            width: '100%',
            marginTop: 'auto',
            backgroundColor: theme
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,

            borderTopColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
            borderTopWidth: 10,

            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,

            borderRadius: 10,

            padding: 10,
            paddingBottom: insets.bottom,
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: theme
                  ? COLORS.darkModeBackgroundOffset
                  : COLORS.lightModeBackgroundOffset,
              },
            ]}></View>
          <View style={styles.optionsContainer}>
            <ScrollView showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  navigate.navigate('HomeAdmin');
                  navigate.navigate('SendBTC');
                }}>
                <View style={styles.optionRow}>
                  <Image
                    style={styles.icon}
                    source={
                      theme ? ICONS.scanQrCodeLight : ICONS.scanQrCodeDark
                    }
                  />

                  <ThemeText
                    styles={{...styles.optionText}}
                    content={'Scan QR'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  getQRImage(navigate, 'modal', nodeInformation);
                }}>
                <View style={styles.optionRow}>
                  <Image
                    style={styles.icon}
                    source={theme ? ICONS.ImagesIcon : ICONS.ImagesIconDark}
                  />
                  <ThemeText
                    styles={{...styles.optionText}}
                    content={'From Image'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  getClipboardText(navigate, 'modal', nodeInformation);
                }}>
                <View style={styles.optionRow}>
                  <Image
                    style={styles.icon}
                    source={theme ? ICONS.clipboardLight : ICONS.clipboardDark}
                  />
                  <ThemeText
                    styles={{...styles.optionText}}
                    content={'From Clipboard'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // getClipboardText(navigate, 'modal', nodeInformation);
                  navigate.goBack();
                  navigate.navigate('ManualyEnterSendAddress');
                }}>
                <View style={styles.optionRow}>
                  <Image
                    style={styles.icon}
                    source={theme ? ICONS.editIconLight : ICONS.editIcon}
                  />
                  <ThemeText
                    styles={{...styles.optionText}}
                    content={'Manual Input'}
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: 120,
    height: 8,
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  optionsContainer: {
    width: '100%',
    height: '100%',
  },

  optionRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    ...CENTER,
  },
  optionText: {
    fontSize: SIZES.large,
  },

  icon: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
});
