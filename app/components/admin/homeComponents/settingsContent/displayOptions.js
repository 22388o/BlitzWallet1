import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import {useNavigation} from '@react-navigation/native';
import {ThemeText} from '../../../../functions/CustomElements';

import {useEffect, useState} from 'react';
import Icon from '../../../../functions/CustomElements/Icon';

import CustomToggleSwitch from '../../../../functions/CustomElements/switch';
import {Slider} from '@miblanchard/react-native-slider';

export default function DisplayOptions() {
  const navigate = useNavigation();
  const {theme, toggleMasterInfoObject, masterInfoObject, nodeInformation} =
    useGlobalContextProvider();
  const [selectedCurrencyInfo, setSelectedCountryInfo] = useState(null);
  const currentCurrency = masterInfoObject?.fiatCurrency;

  const sliderValue = masterInfoObject.homepageTxPreferance;

  const steps = [15, 20, 25, 30, 35, 40];
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    const [selectedCurrency] = masterInfoObject.fiatCurrenciesList?.filter(
      item => item.id === currentCurrency,
    );
    setSelectedCountryInfo(selectedCurrency);
  }, []);

  if (!selectedCurrencyInfo) return;

  console.log(masterInfoObject.satDisplay);

  return (
    <View style={styles.innerContainer}>
      <ThemeText
        styles={{...styles.infoHeaders}}
        content={'Balance Denomination'}
      />
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.darkModeText,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            paddingVertical: 10,
          },
        ]}>
        <ThemeText content={'Current denomination'} />
        <TouchableOpacity
          onPress={() => {
            if (masterInfoObject.userBalanceDenomination === 'sats')
              toggleMasterInfoObject({userBalanceDenomination: 'fiat'});
            else if (masterInfoObject.userBalanceDenomination === 'fiat')
              toggleMasterInfoObject({userBalanceDenomination: 'hidden'});
            else toggleMasterInfoObject({userBalanceDenomination: 'sats'});
          }}
          style={{
            height: 40,
            width: 40,
            backgroundColor: theme
              ? COLORS.darkModeText
              : COLORS.lightModeBackground,
            borderRadius: 8,
            alignItems: 'center',

            justifyContent: 'center',
          }}>
          {masterInfoObject.userBalanceDenomination === 'sats' ? (
            <Icon width={18} height={18} name={'bitcoinB'} />
          ) : masterInfoObject.userBalanceDenomination === 'fiat' ? (
            <ThemeText
              styles={{
                color: COLORS.primary,
                includeFontPadding: false,
                fontSize: SIZES.large,
              }}
              content={selectedCurrencyInfo?.info?.symbol.grapheme}
            />
          ) : (
            <ThemeText
              styles={{
                color: COLORS.primary,
                includeFontPadding: false,
                fontSize: SIZES.large,
              }}
              content={'*'}
            />
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.darkModeText,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            paddingVertical: 10,
          },
        ]}>
        <ThemeText content={'How to display sats'} />
        <TouchableOpacity
          onPress={() => {
            if (masterInfoObject.satDisplay === 'symbol') return;
            toggleMasterInfoObject({satDisplay: 'symbol'});
          }}
          style={{
            height: 40,

            width: 40,
            backgroundColor:
              masterInfoObject.satDisplay === 'symbol'
                ? COLORS.primary
                : theme
                ? COLORS.darkModeText
                : COLORS.lightModeBackground,
            borderRadius: 8,
            alignItems: 'center',

            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 10,
          }}>
          <Icon
            color={
              masterInfoObject.satDisplay === 'symbol'
                ? COLORS.darkModeText
                : COLORS.primary
            }
            width={18}
            height={18}
            name={'bitcoinB'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (masterInfoObject.satDisplay === 'word') return;
            toggleMasterInfoObject({satDisplay: 'word'});
          }}
          style={{
            height: 40,
            width: 'auto',
            backgroundColor:
              masterInfoObject.satDisplay === 'word'
                ? COLORS.primary
                : theme
                ? COLORS.darkModeText
                : COLORS.lightModeBackground,
            borderRadius: 8,
            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <ThemeText
            styles={{
              color:
                masterInfoObject.satDisplay === 'word'
                  ? COLORS.darkModeText
                  : COLORS.primary,
              includeFontPadding: false,
              fontSize: SIZES.medium,
              paddingHorizontal: 10,
            }}
            content={'Sats'}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.darkModeText,
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          },
        ]}>
        <ThemeText content={`Slide for camera`} />
        <CustomToggleSwitch page={'displayOptions'} />
      </View>

      <ThemeText
        styles={{...styles.infoHeaders}}
        content={'Home Screen Transactions'}
      />

      <View style={styles.container}>
        <View style={styles.labelsContainer}>
          {steps.map(value => (
            <ThemeText key={value} content={value} />
          ))}
        </View>
        <Slider
          trackStyle={{
            width: windowDimensions.width * 0.95 * 0.9 * 0.9,
            backgroundColor: COLORS.primary,
            height: 10,
            borderRadius: 20,
          }}
          onSlidingComplete={e => {
            const [num] = e;
            toggleMasterInfoObject({homepageTxPreferance: num});
          }}
          value={sliderValue}
          minimumValue={15}
          maximumValue={40}
          step={5}
          thumbStyle={{
            backgroundColor: COLORS.darkModeText,
            width: 25,
            height: 25,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          }}
          maximumTrackTintColor={COLORS.primary}
          minimumTrackTintColor={COLORS.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    marginTop: 25,
    alignItems: 'center',
    width: '90%',
    ...CENTER,
  },
  infoHeaders: {
    width: '100%',
    marginBottom: 10,
  },
  contentContainer: {
    minHeight: 60,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  homeScreenTxOptionContainer: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },

  container: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: SIZES.medium,
    color: '#000',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 20,
    transform: [{scaleY: 2}],
  },
});
