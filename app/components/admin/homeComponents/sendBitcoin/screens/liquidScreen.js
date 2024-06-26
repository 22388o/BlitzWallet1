// import {
//   Animated,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Platform,
//   ScrollView,
// } from 'react-native';

// import SwipeButton from 'rn-swipe-button';
// import {useEffect, useRef, useState} from 'react';
// import {
//   InputTypeVariant,
//   LnUrlCallbackStatusVariant,
//   ReportIssueRequestVariant,
//   lnurlAuth,
//   parseInput,
//   payLnurl,
//   reportIssue,
//   sendPayment,
//   withdrawLnurl,
// } from '@breeztech/react-native-breez-sdk';
// import {useNavigation} from '@react-navigation/native';

// import WebView from 'react-native-webview';

// import {
//   CENTER,
//   COLORS,
//   FONT,
//   ICONS,
//   SATSPERBITCOIN,
//   SHADOWS,
//   SIZES,
// } from '../../../../../constants';
// import {useGlobalContextProvider} from '../../../../../../context-store/context';
// import getKeyboardHeight from '../../../../../hooks/getKeyboardHeight';
// import {
//   getLiquidFees,
//   sendLiquidTransaction,
// } from '../../../../../functions/liquidWallet';
// import {calculateBoltzFee} from '../../../../../functions/boltz/calculateBoltzFee';
// import createLiquidToLNSwap from '../../../../../functions/boltz/liquidToLNSwap';
// import {formatBalanceAmount, numberConverter} from '../../../../../functions';
// import {
//   decryptMessage,
//   encriptMessage,
// } from '../../../../../functions/messaging/encodingAndDecodingMessages';
// import {decodeLiquidAddress} from '../../../../../functions/liquidWallet/decodeLiquidAddress';
// import handleWebviewClaimMessage from '../../../../../functions/boltz/handle-webview-claim-message';
// import {contactsLNtoLiquidSwapInfo} from '../../contacts/internalComponents/LNtoLiquidSwap';
// import {
//   getBoltzApiUrl,
//   getBoltzWsUrl,
// } from '../../../../../functions/boltz/boltzEndpoitns';
// import handleReverseClaimWSS from '../../../../../functions/boltz/handle-reverse-claim-wss';

// const webviewHTML = require('boltz-swap-web-context');

// export default function LiquidPaymentScreen({
//   paymentInfo,
//   initialSendingAmount,
//   isUsingBank,
//   isBTCdenominated,
//   fiatSatValue,
// }) {
//   console.log('LIQUID PAYMENT SCREEN');

//   if (Object.keys(paymentInfo).length === 0) return;
//   const {
//     theme,
//     nodeInformation,
//     masterInfoObject,
//     liquidNodeInformation,
//     toggleMasterInfoObject,
//     contactsPrivateKey,
//   } = useGlobalContextProvider();
//   const keyboardHeight = getKeyboardHeight();
//   const webViewRef = useRef(null);
//   const navigate = useNavigation();

//   const [sendingAmount, setSendingAmount] = useState(initialSendingAmount);

//   //   const [paymentInfo, setPaymentInfo] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   //   const [sendingAmount, setSendingAmount] = useState(null);
//   //   const [lnurlDescriptionInfo, setLnurlDescriptionInfo] = useState({
//   //     didAsk: false,
//   //     description: '',
//   //   });

//   const [swapFee, setSwapFee] = useState({});
//   const [liquidNetworkFee, setLiquidNetworkFee] = useState(0);

//   const [hasError, setHasError] = useState('');

//   //   const isUsingBankWithZeroInvoice =
//   //     isUsingBank &&
//   //     paymentInfo.type != InputTypeVariant.LN_URL_PAY &&
//   //     !paymentInfo.invoice?.amountMsat;

//   const boltzFee = (sendingAmount / 1000) * swapFee?.fees?.percentage;

//   const canUseLiquid =
//     liquidNodeInformation.userBalance >
//     sendingAmount / 1000 + swapFee?.fees?.minerFees;

//   const canUseLightning =
//     nodeInformation.userBalance > sendingAmount / 1000 + 50 + boltzFee;

//   const canSendPayment = canUseLiquid
//     ? sendingAmount / 1000 >= swapFee?.limits?.minimal
//     : canUseLightning
//     ? sendingAmount / 1000 >= swapFee?.limits?.minimal
//     : false;

//   const handleClaimMessage = event => {
//     try {
//       const data = JSON.parse(event.nativeEvent.data);
//       if (data.error) throw Error(data.error);
//       console.log(data, 'DATA FROM WEBVIEW');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       const liquidFees = await getLiquidFees();
//       const txSize = (148 + 3 * 34 + 10.5) / 100;

//       const [boltzFee, pairSwapInfo] = await calculateBoltzFee(
//         sendingAmount / 1000,
//         'liquid-ln',
//       );

//       setSwapFee(pairSwapInfo);
//       setLiquidNetworkFee(liquidFees.fees[0] * txSize);
//       setIsLoading(false);
//     })();
//   }, []);

//   if (Object.keys(swapFee).length === 0) return;

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : null}
//       style={{flex: 1}}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <SafeAreaView
//           style={{flex: 1, alignItems: 'center', position: 'relative'}}>
//           <WebView
//             ref={webViewRef}
//             containerStyle={{position: 'absolute', top: 1000, left: 1000}}
//             source={webviewHTML}
//             originWhitelist={['*']}
//             onMessage={event =>
//               handleWebviewClaimMessage(navigate, event, 'sendingPage')
//             }
//           />
//           <View style={styles.topBar}>
//             <TouchableOpacity onPress={() => goBackFunction()}>
//               <Image style={styles.backButton} source={ICONS.smallArrowLeft} />
//             </TouchableOpacity>
//           </View>
//           {/* NEW CONTENT */}
//           {isLoading ? (
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <ActivityIndicator
//                 size="large"
//                 color={theme ? COLORS.darkModeText : COLORS.lightModeText}
//               />
//             </View>
//           ) : (
//             <>
//               <Text
//                 style={[
//                   styles.headerText,
//                   {
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                   },
//                 ]}>
//                 Total Balance
//               </Text>
//               <Text
//                 style={[
//                   styles.headerText,
//                   {
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     marginBottom: 30,
//                   },
//                 ]}>
//                 {formatBalanceAmount(
//                   numberConverter(
//                     liquidNodeInformation.userBalance +
//                       nodeInformation.userBalance,
//                     masterInfoObject.userBalanceDenomination,
//                     nodeInformation,
//                     masterInfoObject.userBalanceDenomination != 'fiat' ? 0 : 2,
//                   ),
//                 )}{' '}
//                 {isBTCdenominated ? 'sats' : nodeInformation.fiatStats.coin}
//               </Text>

//               <Text
//                 style={[
//                   styles.subHeaderText,
//                   {
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                   },
//                 ]}>
//                 Amount that will be sent:
//               </Text>
//               {initialSendingAmount ? (
//                 <Text
//                   style={[
//                     styles.sendingAmtBTC,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     },
//                   ]}>
//                   {formatBalanceAmount(
//                     numberConverter(
//                       initialSendingAmount / 1000,
//                       masterInfoObject.userBalanceDenomination,
//                       nodeInformation,
//                       masterInfoObject.userBalanceDenomination != 'fiat'
//                         ? 0
//                         : 2,
//                     ),
//                   )}{' '}
//                   {isBTCdenominated ? 'sats' : nodeInformation.fiatStats.coin}
//                 </Text>
//               ) : (
//                 <View
//                   style={[
//                     styles.sendingAmountInputContainer,
//                     {alignItems: Platform.OS == 'ios' ? 'baseline' : null},
//                   ]}>
//                   <TextInput
//                     style={[
//                       styles.sendingAmtBTC,
//                       {
//                         color: theme
//                           ? COLORS.darkModeText
//                           : COLORS.lightModeText,
//                         maxWidth: 175,
//                         margin: 0,
//                         padding: 0,
//                       },
//                     ]}
//                     placeholderTextColor={
//                       theme ? COLORS.darkModeText : COLORS.lightModeText
//                     }
//                     value={
//                       sendingAmount === null || sendingAmount === 0
//                         ? ''
//                         : String(sendingAmount / 1000)
//                     }
//                     keyboardType="number-pad"
//                     placeholder="0"
//                     onChangeText={e => {
//                       if (isNaN(e)) return;
//                       setSendingAmount(Number(e) * 1000);
//                     }}
//                   />

//                   <Text
//                     style={[
//                       styles.sendingAmtBTC,
//                       {
//                         color: theme
//                           ? COLORS.darkModeText
//                           : COLORS.lightModeText,
//                       },
//                     ]}>
//                     {' '}
//                     {isBTCdenominated ? 'sats' : nodeInformation.fiatStats.coin}
//                   </Text>
//                 </View>
//               )}

//               <View
//                 style={[
//                   styles.invoiceContainer,
//                   {
//                     backgroundColor: theme
//                       ? COLORS.darkModeBackgroundOffset
//                       : COLORS.lightModeBackgroundOffset,
//                   },
//                 ]}>
//                 <Text
//                   style={[
//                     styles.invoiceText,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                       textAlign: 'left',
//                     },
//                   ]}>
//                   {paymentInfo.addressInfo.label
//                     ? paymentInfo.addressInfo.label.length > 100
//                       ? paymentInfo.addressInfo.label.slice(0, 100) + '...'
//                       : paymentInfo.addressInfo.label
//                     : 'no description'}
//                 </Text>
//               </View>
//               <Text
//                 style={[
//                   styles.headerText,
//                   {
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                   },
//                 ]}>
//                 Fee and Speed
//               </Text>
//               {(canUseLiquid || canUseLightning) && (
//                 <Text
//                   style={[
//                     styles.subHeaderText,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                       fontSize: 13,
//                       marginBottom: 'auto',
//                     },
//                   ]}>
//                   {`${
//                     canUseLiquid
//                       ? 'liquid transaction fee of'
//                       : 'bank swap fee of'
//                   } ${formatBalanceAmount(
//                     numberConverter(
//                       canSendPayment
//                         ? canUseLiquid
//                           ? liquidNetworkFee
//                           : canSendPayment
//                         : liquidNetworkFee,
//                       masterInfoObject.userBalanceDenomination,
//                       nodeInformation,
//                       masterInfoObject.userBalanceDenomination != 'fiat'
//                         ? 0
//                         : 2,
//                     ),
//                   )} sats`}
//                 </Text>
//               )}

//               {canUseLiquid || canUseLightning ? (
//                 <Text
//                   style={{
//                     textAlign: 'center',
//                     marginTop: 'auto',
//                     fontFamily: FONT.Title_Regular,
//                     fontSize: SIZES.medium,
//                     marginBottom: keyboardHeight.isShowing ? 20 : 10,

//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                   }}>
//                   Minium liquid payment is{' '}
//                   {formatBalanceAmount(
//                     numberConverter(
//                       swapFee?.limits?.minimal,
//                       masterInfoObject.userBalanceDenomination,
//                       nodeInformation,
//                       masterInfoObject.userBalanceDenomination != 'fiat'
//                         ? 0
//                         : 2,
//                     ),
//                   )}{' '}
//                   sats
//                 </Text>
//               ) : (
//                 <Text
//                   style={{
//                     width: '90%',
//                     textAlign: 'center',
//                     marginTop: 'auto',
//                     fontFamily: FONT.Title_Regular,
//                     fontSize: SIZES.medium,
//                     marginBottom: 10,
//                   }}>
//                   Neither bank or lightning account has enough funds
//                 </Text>
//               )}
//               {!keyboardHeight.isShowing && (
//                 <SwipeButton
//                   containerStyles={{
//                     opacity: canSendPayment ? 1 : 0.2,
//                     width: '90%',
//                     maxWidth: 350,
//                     borderColor: theme
//                       ? COLORS.darkModeText
//                       : COLORS.lightModeText,
//                     marginTop: initialSendingAmount ? 'auto' : 10,
//                     marginBottom: 30,
//                     ...CENTER,
//                   }}
//                   titleStyles={{fontWeight: 'bold', fontSize: SIZES.large}}
//                   swipeSuccessThreshold={100}
//                   onSwipeSuccess={() => {
//                     if (!canSendPayment) return;
//                     Keyboard.dismiss();
//                     sendPaymentFunction();
//                   }}
//                   shouldResetAfterSuccess={
//                     isUsingBank && canSendPayment ? false : true
//                   }
//                   railBackgroundColor={
//                     theme
//                       ? COLORS.lightModeBackground
//                       : COLORS.darkModeBackground
//                   }
//                   railBorderColor={
//                     theme
//                       ? COLORS.lightModeBackground
//                       : COLORS.darkModeBackground
//                   }
//                   height={55}
//                   railStyles={{
//                     backgroundColor: theme
//                       ? COLORS.lightModeBackground
//                       : COLORS.darkModeBackground,
//                     borderColor: theme
//                       ? COLORS.lightModeBackground
//                       : COLORS.darkModeBackground,
//                   }}
//                   thumbIconBackgroundColor={
//                     theme
//                       ? COLORS.darkModeBackground
//                       : COLORS.lightModeBackground
//                   }
//                   thumbIconBorderColor={
//                     theme
//                       ? COLORS.lightModeBackground
//                       : COLORS.darkModeBackground
//                   }
//                   titleColor={
//                     theme
//                       ? COLORS.darkModeBackground
//                       : COLORS.lightModeBackground
//                   }
//                   title="Slide to confirm"
//                 />
//               )}
//             </>
//           )}
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );

//   async function sendPaymentFunction() {
//     try {
//       if (canUseLiquid) {
//         setIsLoading(true);
//         const didSend = await sendLiquidTransaction(
//           sendingAmount / 1000,
//           paymentInfo.addressInfo.address,
//         );

//         if (didSend) {
//           navigate.navigate('HomeAdmin');
//           navigate.navigate('ConfirmTxPage', {
//             for: 'paymentSucceed',
//             information: {},
//           });
//         } else {
//           navigate.navigate('HomeAdmin');
//           navigate.navigate('ConfirmTxPage', {
//             for: 'paymentFailed',
//             information: {},
//           });
//         }
//       } else if (canUseLightning) {
//         console.log('SENDING LIGHTNING PAYMENT');
//         const [
//           data,
//           swapPublicKey,
//           privateKeyString,
//           keys,
//           preimage,
//           liquidAddress,
//         ] = await contactsLNtoLiquidSwapInfo(
//           paymentInfo.addressInfo.address,
//           sendingAmount / 1000,
//         );

//         if (!data?.invoice) throw new Error('No Invoice genereated');
//         const webSocket = new WebSocket(
//           `${getBoltzWsUrl(process.env.BOLTZ_ENVIRONMENT)}`,
//         );

//         const didHandle = await handleReverseClaimWSS({
//           ref: webViewRef,
//           webSocket: webSocket,
//           liquidAddress: liquidAddress,
//           swapInfo: data,
//           preimage: preimage,
//           privateKey: keys.privateKey.toString('hex'),
//           navigate: navigate,
//         });

//         if (didHandle) {
//           try {
//             const didSend = await sendPayment(data?.invoice);
//             if (didSend.payment.status === PaymentStatus.FAILED) {
//               webSocket.close();
//               navigate.navigate('HomeAdmin');
//               navigate.navigate('ConfirmTxPage', {
//                 for: 'paymentFailed',
//                 information: {},
//               });
//             }
//           } catch (err) {
//             console.log(err);
//             webSocket.close();
//             navigate.navigate('HomeAdmin');
//             navigate.navigate('ConfirmTxPage', {
//               for: 'paymentFailed',
//               information: {},
//             });
//           }
//         }
//       }
//     } catch (err) {
//       setHasError('Error sending payment. Try again.');
//       console.log(err, 'SENDING ERRORR');
//       try {
//         const paymentHash = paymentInfo.invoice.paymentHash;
//         await reportIssue({
//           type: ReportIssueRequestVariant.PAYMENT_FAILURE,
//           data: {paymentHash},
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   }

//   function goBackFunction() {
//     navigate.goBack();
//   }
// }

// const styles = StyleSheet.create({
//   popupContainer: {
//     flex: 1,
//   },

//   innerContainer: {
//     flex: 1,
//     width: '95%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   topBar: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   backButton: {
//     width: 30,
//     height: 30,
//   },
//   headerText: {
//     fontSize: SIZES.xLarge,
//     fontFamily: FONT.Title_Regular,
//     ...CENTER,
//   },
//   subHeaderText: {
//     fontSize: SIZES.medium,
//     fontFamily: FONT.Title_Regular,
//     ...CENTER,
//   },

//   sendingAmountInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 30,
//   },
//   sendingAmtBTC: {
//     fontSize: SIZES.huge,
//     fontFamily: FONT.Title_Regular,
//   },
//   invoiceContainer: {
//     width: '95%',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   invoiceText: {
//     fontSize: SIZES.medium,
//     fontFamily: FONT.Descriptoin_Regular,
//   },
//   feeBreakdownContainer: {
//     width: '85%',
//   },
//   feeBreakdownRow: {
//     width: '100%',
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   feeBreakdownItem: {
//     width: '36%',
//     textAlign: 'right',

//     alignItems: 'flex-end',
//     fontSize: SIZES.medium,
//     fontFamily: FONT.Title_Bold,
//   },
//   feeBreakdownValue: {
//     fontFamily: FONT.Descriptoin_Regular,
//     fontSize: SIZES.medium,
//   },

//   buttonsContainer: {
//     width: '90%',
//     marginTop: 'auto',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   button: {
//     width: '48%',

//     height: 40,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 50,
//     borderRadius: 5,
//     ...SHADOWS.small,
//   },
//   buttonText: {
//     fontSize: SIZES.medium,
//     color: COLORS.lightWhite,
//     fontFamily: FONT.Other_Regular,
//   },
// });
