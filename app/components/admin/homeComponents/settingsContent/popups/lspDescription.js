import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import {BTN, COLORS, FONT, ICONS, SIZES} from '../../../../../constants';
import {useNavigation} from '@react-navigation/native';
import {CENTER, backArrow} from '../../../../../constants/styles';
import {
  GlobalThemeView,
  ThemeText,
} from '../../../../../functions/CustomElements';
import {WINDOWWIDTH} from '../../../../../constants/theme';

export default function LspDescriptionPopup() {
  const navigate = useNavigation();
  return (
    <GlobalThemeView>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <Image
            style={[backArrow, {marginBottom: 20, marginLeft: 0}]}
            source={ICONS.smallArrowLeft}
          />
        </TouchableOpacity>
        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
          <ThemeText
            content={`A Lightning Service Provider (LSP) is a business that enables a more seamless experience on the Lightning Network. Such services include providing liquidity management and payment routing.`}
            styles={{...styles.text, marginTop: 'auto'}}
          />
          <ThemeText
            content={`Since the Lightning Network worked based on a series of channels the size of a Lightning channel is naturally constrained. Using an LSP decreases that constraint making larger payments more feasible.`}
            styles={{...styles.text}}
          />
          <ThemeText
            content={`It’s important to note here that an LSP DOES NOT HAVE ACCESS TO YOUR FUNDS. They are mearly a helper to make the Lightning Networks liquidity constraint have less of an impact.`}
            styles={{...styles.text, marginBottom: 'auto'}}
          />

          <TouchableOpacity
            onPress={() => {
              try {
                WebBrowser.openBrowserAsync(
                  'https://thebitcoinmanual.com/articles/explained-lsp/#:~:text=LSPs%20are%20counterparties%20on%20users%E2%80%99%20payment%20channels%20that,network%20management%20such%20as%3A%20Opening%20and%20closing%20channels',
                );
              } catch (err) {
                console.log(err);
              }
            }}
            style={[BTN, {backgroundColor: COLORS.primary, marginTop: 0}]}>
            <ThemeText
              content={'Learn More'}
              styles={{
                fontSize: SIZES.large,
                color: COLORS.lightModeBackground,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </GlobalThemeView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    width: WINDOWWIDTH,
    ...CENTER,
  },
  text: {
    width: '100%',
    marginBottom: 10,
  },
});
