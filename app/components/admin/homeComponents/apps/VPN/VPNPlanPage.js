import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import {ThemeText} from '../../../../../functions/CustomElements';
import {useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../../constants';

import {useGlobalContextProvider} from '../../../../../../context-store/context';
import VPNDurationSlider from './components/durationSlider';
import CustomButton from '../../../../../functions/CustomElements/button';
import FullLoadingScreen from '../../../../../functions/CustomElements/loadingScreen';
import {useNavigation} from '@react-navigation/native';
import {
  copyToClipboard,
  getLocalStorageItem,
  setLocalStorageItem,
} from '../../../../../functions';
import {
  ReportIssueRequestVariant,
  parseInput,
  reportIssue,
} from '@breeztech/react-native-breez-sdk';
import {
  LIGHTNINGAMOUNTBUFFER,
  LIQUIDAMOUTBUFFER,
} from '../../../../../constants/math';
import {getBoltzWsUrl} from '../../../../../functions/boltz/boltzEndpoitns';
import handleSubmarineClaimWSS from '../../../../../functions/boltz/handle-submarine-claim-wss';
import {useWebView} from '../../../../../../context-store/webViewContext';
import QRCode from 'react-native-qrcode-svg';
import {removeLocalStorageItem} from '../../../../../functions/localStorage';
import createLiquidToLNSwap from '../../../../../functions/boltz/liquidToLNSwap';
import {sendLiquidTransaction} from '../../../../../functions/liquidWallet';

export default function VPNPlanPage() {
  const [contriesList, setCountriesList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const deviceSize = useWindowDimensions();
  const {
    theme,
    nodeInformation,
    liquidNodeInformation,
    toggleMasterInfoObject,
    masterInfoObject,
    contactsPrivateKey,
  } = useGlobalContextProvider();
  const [selectedDuration, setSelectedDuration] = useState('week');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);

  const [error, setError] = useState('');
  const navigate = useNavigation();
  const {webViewRef} = useWebView();
  console.log(contriesList);
  useEffect(() => {
    (async () => {
      setCountriesList(
        (await axios.get('https://lnvpn.net/api/v1/countryList')).data,
      );
    })();
  }, []);

  const countryElements = useMemo(() => {
    return [...contriesList]
      .filter(item =>
        item.country
          .slice(5)
          .toLowerCase()
          .startsWith(searchInput.toLocaleLowerCase()),
      )
      .map(item => {
        if (item.cc == 2) return <View key={item.country}></View>;
        return (
          <TouchableOpacity
            onPress={() => {
              setSearchInput(item.country);
              setSelectedCountry(item.cc);
            }}
            style={{paddingVertical: 10}}
            key={item.country}>
            <ThemeText styles={{textAlign: 'center'}} content={item.country} />
          </TouchableOpacity>
        );
      });
  }, [searchInput, contriesList]);

  return (
    <>
      {isPaying ? (
        <>
          {generatedFile ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard(generatedFile, navigate);
                }}
                activeOpacity={0.9}
                style={[
                  styles.qrCodeContainer,
                  {
                    backgroundColor: theme
                      ? COLORS.darkModeBackgroundOffset
                      : COLORS.lightModeBackgroundOffset,
                  },
                ]}>
                <View
                  style={{
                    width: 275,
                    height: 275,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}>
                  <QRCode
                    size={275}
                    quietZone={15}
                    value={generatedFile}
                    color={COLORS.lightModeText}
                    backgroundColor={COLORS.darkModeText}
                    logo={ICONS.logoIcon}
                    logoSize={50}
                    logoMargin={5}
                    logoBorderRadius={50}
                    logoBackgroundColor={COLORS.darkModeText}
                  />
                </View>
              </TouchableOpacity>
              <ThemeText styles={{marginTop: 10}} content={generatedFile} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
              }}>
              <FullLoadingScreen
                textStyles={{
                  color: error
                    ? COLORS.cancelRed
                    : theme
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                }}
                text={error || 'Generating VPN file'}
              />
            </View>
          )}
        </>
      ) : (
        <View style={{flex: 1}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={{flex: 1}}>
            <VPNDurationSlider
              setSelectedDuration={setSelectedDuration}
              selectedDuration={selectedDuration}
            />
            <View style={{flex: 1, marginTop: 10}}>
              <View
                style={{
                  flex: 1,
                  maxHeight: deviceSize.height / 2,
                }}>
                <TextInput
                  autoFocus={true}
                  onChangeText={setSearchInput}
                  value={searchInput}
                  placeholder="United States"
                  placeholderTextColor={
                    theme ? COLORS.darkModeText : COLORS.lightModeText
                  }
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme
                        ? COLORS.darkModeBackgroundOffset
                        : COLORS.lightModeBackgroundOffset,
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}
                />
                <ScrollView>{countryElements}</ScrollView>
              </View>

              <CustomButton
                buttonStyles={{marginTop: 'auto', ...CENTER}}
                textContent={'Pay'}
                actionFunction={() => {
                  // console.log(selectedDuration, selectedCountry);

                  // setIsPaying(true);

                  // setTimeout(() => {
                  //   setGeneratedFile(true);
                  // }, 5000);
                  createVPN();
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );

  async function createVPN() {
    if (!selectedCountry) {
      navigate.navigate('ErrorScreen', {
        errorMessage: `Please select a country for the VPN to be located in`,
      });
      return;
    }
    setIsPaying(true);
    try {
      const invoice = (
        await axios.post(
          'https://lnvpn.net/api/v1/getInvoice?ref=BlitzWallet',
          {
            duration:
              selectedDuration === 'week'
                ? '1.5'
                : selectedDuration === 'month'
                ? '4'
                : '9',
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
      ).data;
      console.log(invoice);
      if (invoice.payment_hash && invoice.payment_request) {
        let savedRequests =
          JSON.parse(await getLocalStorageItem('savedVPNIds')) || [];

        savedRequests.push({
          payment_hash: invoice.payment_hash,
          payment_request: invoice.payment_request,
        });

        setLocalStorageItem('savedVPNIds', JSON.stringify(savedRequests));
        const parsedInput = await parseInput(invoice.payment_request);
        const sendingAmountSat = parsedInput.invoice.amountMsat / 1000;

        if (
          nodeInformation.userBalance >=
          sendingAmountSat + LIGHTNINGAMOUNTBUFFER
        ) {
          try {
            await sendPayment({bolt11: invoice.payment_request});
            setTimeout(() => {
              getVPNConfig({
                paymentHash: invoice.payment_hash,
                location: selectedCountry,
              });
            }, 5000);
          } catch (err) {
            try {
              setError('Error paying with lightning');
              const paymentHash = parsedInput.invoice.paymentHash;
              await reportIssue({
                type: ReportIssueRequestVariant.PAYMENT_FAILURE,
                data: {paymentHash},
              });
            } catch (err) {
              console.log(err);
            }
          }
        } else if (
          liquidNodeInformation.userBalance >=
          sendingAmountSat + LIQUIDAMOUTBUFFER
        ) {
          const {swapInfo, privateKey} = await createLiquidToLNSwap(
            invoice.payment_request,
          );

          if (!swapInfo?.expectedAmount || !swapInfo?.address) {
            setError('Error paying with liquid');
            return;
          }

          const refundJSON = {
            id: swapInfo.id,
            asset: 'L-BTC',
            version: 3,
            privateKey: privateKey,
            blindingKey: swapInfo.blindingKey,
            claimPublicKey: swapInfo.claimPublicKey,
            timeoutBlockHeight: swapInfo.timeoutBlockHeight,
            swapTree: swapInfo.swapTree,
          };

          console.log(refundJSON);
          const webSocket = new WebSocket(
            `${getBoltzWsUrl(process.env.BOLTZ_ENVIRONMENT)}`,
          );

          const didHandle = await handleSubmarineClaimWSS({
            ref: webViewRef,
            webSocket: webSocket,
            invoiceAddress: invoice.payment_request,
            swapInfo,
            privateKey,
            toggleMasterInfoObject,
            masterInfoObject,
            contactsPrivateKey,
            refundJSON,
            navigate,
            handleFunction: () =>
              setTimeout(() => {
                getVPNConfig({
                  paymentHash: invoice.payment_hash,
                  location: selectedCountry,
                });
              }, 5000),
            page: 'VPN',
          });
          if (didHandle) {
            const didSend = await sendLiquidTransaction(
              swapInfo.expectedAmount,
              swapInfo.address,
            );

            if (!didSend) {
              webSocket.close();
              setError('Error sending liquid payment');
            }
          }
        } else {
          setError('Not enough funds');
        }
      } else {
        console.log(err);
        setError('Error creating invoice');
      }
      console.log(invoice);
    } catch (err) {
      console.log(err);
      setError('Error paying invoice');
    }
  }

  async function getVPNConfig({paymentHash, location}) {
    try {
      console.log(paymentHash, location);
      const VPNInfo = (
        await axios.post(
          'https://lnvpn.net/api/v1/getTunnelConfig?ref=BlitzWallet',
          {
            paymentHash: paymentHash,
            location: `${location}`,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
      ).data;

      console.log(VPNInfo);
      setGeneratedFile(VPNInfo.WireguardConfig);

      let savedRequests =
        JSON.parse(await getLocalStorageItem('savedVPNIds')) || [];

      const updatedList = savedRequests.map(item => {
        if (item.payment_hash === paymentHash) {
          return {...item, config: VPNInfo.WireguardConfig};
        } else return item;
      });

      setLocalStorageItem('savedVPNIds', JSON.stringify(updatedList));
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    padding: 10,
    ...CENTER,
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Regular,
    borderRadius: 8,
    marginBottom: 20,
  },
  qrCodeContainer: {
    width: 300,
    height: 'auto',
    minHeight: 300,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
