// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
//   TextInput,
//   Platform,
//   Keyboard,
//   KeyboardAvoidingView,
// } from 'react-native';
// import {
//   CENTER,
//   COLORS,
//   FONT,
//   ICONS,
//   LNURL_WITHDRAWL_CODES,
//   SATSPERBITCOIN,
//   SHADOWS,
//   SIZES,
// } from '../../../../constants';

// import {useNavigation} from '@react-navigation/native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useGlobalContextProvider} from '../../../../../context-store/context';
// import {useEffect, useRef, useState} from 'react';
// import {
//   formatBalanceAmount,
//   numberConverter,
//   retrieveData,
// } from '../../../../functions';

// import {randomUUID} from 'expo-crypto';
// import Buffer from 'buffer';
// import * as bench32 from 'bech32';

// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import getKeyboardHeight from '../../../../hooks/getKeyboardHeight';
// import {pubishMessageToAbly} from '../../../../functions/messaging/publishMessage';
// import {decryptMessage} from '../../../../functions/messaging/encodingAndDecodingMessages';
// import {getPublicKey} from 'nostr-tools';
// import {getBoltzSwapPairInformation} from '../../../../functions/boltz/boltzSwapInfo';
// import {
//   getLiquidFees,
//   sendLiquidTransaction,
// } from '../../../../functions/liquidWallet';
// import createLNToLiquidSwap from '../../../../functions/boltz/LNtoLiquidSwap';
// import {contactsLNtoLiquidSwapInfo} from './internalComponents/LNtoLiquidSwap';
// import WebView from 'react-native-webview';
// import {
//   getBoltzApiUrl,
//   getBoltzWsUrl,
// } from '../../../../functions/boltz/boltzEndpoitns';
// import handleWebviewClaimMessage from '../../../../functions/boltz/handle-webview-claim-message';
// import {PaymentStatus, sendPayment} from '@breeztech/react-native-breez-sdk';
// const webviewHTML = require('boltz-swap-web-context');

// export default function SendAndRequestPage(props) {
//   const navigate = useNavigation();
//   const insets = useSafeAreaInsets();

//   const {
//     theme,
//     nodeInformation,
//     masterInfoObject,
//     toggleMasterInfoObject,
//     contactsPrivateKey,
//     liquidNodeInformation,
//   } = useGlobalContextProvider();
//   const [amountValue, setAmountValue] = useState(null);
//   const [descriptionValue, setDescriptionValue] = useState('');
//   const amountRef = useRef(null);
//   const [swapPairInfo, setSwapPairInfo] = useState({});
//   const [liquidNetworkFee, setLiquidNetworkFee] = useState(0);
//   const descriptionRef = useRef(null);
//   const selectedContact = props.route.params.selectedContact;
//   const paymentType = props.route.params.paymentType;
//   const isBTCdenominated =
//     masterInfoObject.userBalanceDenomination === 'hidden' ||
//     masterInfoObject.userBalanceDenomination === 'sats';
//   const publicKey = getPublicKey(contactsPrivateKey);
//   const webViewRef = useRef(null);

//   const decodedContacts = JSON.parse(
//     decryptMessage(
//       contactsPrivateKey,
//       publicKey,
//       masterInfoObject.contacts.addedContacts,
//     ),
//   );
//   console.log(amountValue);

//   const boltzFee =
//     swapPairInfo?.fees?.lockup + amountValue * swapPairInfo?.fees?.percentage;

//   const canUseLiquid =
//     liquidNodeInformation.userBalance - 300 > amountValue &&
//     amountValue > liquidNetworkFee;
//   const canUseLightning =
//     nodeInformation.userBalance - boltzFee > amountValue &&
//     amountValue > swapPairInfo?.limits.minimal &&
//     amountValue < swapPairInfo?.limits.maximal;

//   useEffect(() => {
//     (async () => {
//       const boltzSwapInfo = await getBoltzSwapPairInformation('ln-liquid');
//       const liquidFees = await getLiquidFees();
//       const txSize = (148 + 3 * 34 + 10.5) / 100;
//       setLiquidNetworkFee(liquidFees.fees[0] * txSize);
//       console.log(boltzSwapInfo);
//       setSwapPairInfo(boltzSwapInfo);
//     })();
//   }, []);

//   return (
//     <TouchableWithoutFeedback onPress={() => navigate.goBack()}>
//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         {/* This webview is used to call WASM code in browser as WASM code cannot be called in react-native */}
//         <WebView
//           javaScriptEnabled={true}
//           ref={webViewRef}
//           containerStyle={{position: 'absolute', top: 1000, left: 1000}}
//           source={webviewHTML}
//           originWhitelist={['*']}
//           onMessage={event =>
//             handleWebviewClaimMessage(navigate, event, 'contactsPage')
//           }
//         />
//         <View
//           style={{
//             height: '85%',
//             width: '100%',
//             backgroundColor: theme
//               ? COLORS.darkModeBackground
//               : COLORS.lightModeBackground,

//             borderTopColor: theme
//               ? COLORS.darkModeBackgroundOffset
//               : COLORS.lightModeBackgroundOffset,
//             borderTopWidth: 10,

//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,

//             borderRadius: 10,

//             paddingBottom: insets.bottom === 0 ? 10 : insets.bottom,
//           }}>
//           <View
//             style={[
//               styles.topBar,
//               {
//                 backgroundColor: theme
//                   ? COLORS.darkModeBackgroundOffset
//                   : COLORS.lightModeBackgroundOffset,
//                 ...CENTER,
//               },
//             ]}></View>
//           <KeyboardAwareScrollView
//             enableOnAndroid={true}
//             contentContainerStyle={{flex: 1}}>
//             <TouchableWithoutFeedback
//               style={{flex: 1}}
//               onPress={Keyboard.dismiss}>
//               <View
//                 style={{
//                   flex: 1,
//                 }}>
//                 <View
//                   style={[
//                     styles.profileImage,
//                     {
//                       borderColor: theme
//                         ? COLORS.darkModeBackgroundOffset
//                         : COLORS.lightModeBackgroundOffset,
//                       backgroundColor: theme
//                         ? COLORS.darkModeText
//                         : COLORS.lightModeText,
//                       marginBottom: 5,
//                     },
//                   ]}>
//                   <Image
//                     source={
//                       selectedContact.profileImg
//                         ? selectedContact.profileImg
//                         : ICONS.userIcon
//                     }
//                     style={{width: '80%', height: '80%'}}
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     styles.profileName,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     },
//                   ]}>
//                   {`${paymentType === 'send' ? 'Send' : 'Request'} money to ${
//                     selectedContact.name || selectedContact.uniqueName
//                   }`}
//                 </Text>

//                 <Text
//                   style={[
//                     styles.headerText,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                       marginTop: 'auto',
//                     },
//                   ]}>
//                   Amount
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     // amountRef.current.focus();
//                     navigate.navigate('NumberKeyboard', {
//                       setAmountValue: setAmountValue,
//                     });
//                   }}>
//                   <View
//                     style={[
//                       styles.textInputContainer,
//                       {
//                         backgroundColor: theme
//                           ? COLORS.darkModeBackgroundOffset
//                           : COLORS.lightModeBackgroundOffset,

//                         padding: 10,
//                         flexDirection: 'row',
//                         alignItems: 'flex-end',
//                         justifyContent: 'center',
//                         borderRadius: 8,
//                         marginBottom: 0,
//                       },
//                     ]}>
//                     <TextInput
//                       ref={amountRef}
//                       placeholder="0"
//                       placeholderTextColor={
//                         theme ? COLORS.darkModeText : COLORS.lightModeText
//                       }
//                       keyboardType="decimal-pad"
//                       value={
//                         amountValue === null || amountValue === 0
//                           ? ''
//                           : formatBalanceAmount(Number(amountValue))
//                       }
//                       editable={false}
//                       selectTextOnFocus={false}
//                       // onChangeText={e => {
//                       //   if (isNaN(e)) return;
//                       //   setAmountValue(e);
//                       // }}
//                       style={[
//                         styles.memoInput,
//                         {
//                           width: 'auto',
//                           maxWidth: '70%',
//                           color: theme
//                             ? COLORS.darkModeText
//                             : COLORS.lightModeText,
//                           padding: 0,
//                           margin: 0,
//                         },
//                       ]}
//                     />
//                     <Text
//                       style={[
//                         {
//                           fontFamily: FONT.Descriptoin_Regular,
//                           fontSize: SIZES.xLarge,
//                           color: theme
//                             ? COLORS.darkModeText
//                             : COLORS.lightModeText,
//                           marginLeft: 5,
//                         },
//                       ]}>
//                       {masterInfoObject.userBalanceDenomination === 'sats' ||
//                       masterInfoObject.userBalanceDenomination === 'hidden'
//                         ? 'sats'
//                         : nodeInformation.fiatStats.coin}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//                 <Text
//                   style={{
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     width: '95%',
//                     fontSize: SIZES.medium,
//                     marginTop: 10,
//                     marginBottom: 50,
//                     ...CENTER,
//                   }}>
//                   Transaction Fee:{' '}
//                   {formatBalanceAmount(
//                     numberConverter(
//                       liquidNetworkFee,
//                       'sats',
//                       nodeInformation,
//                       0,
//                     ),
//                   )}{' '}
//                   sats
//                 </Text>
//                 {/* <Text
//                   style={{
//                     color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     width: '95%',
//                     fontSize: SIZES.medium,
//                     marginTop: 10,
//                     marginBottom: 50,
//                     ...CENTER,
//                   }}>
//                   Sending amount:{' '}
//                   {formatBalanceAmount(
//                     numberConverter(
//                       amountValue - liquidNetworkFee < 0
//                         ? 0
//                         : amountValue - liquidNetworkFee,
//                       'sats',
//                       nodeInformation,
//                       0,
//                     ),
//                   )}{' '}
//                   sats
//                 </Text> */}

//                 <Text
//                   style={[
//                     styles.headerText,
//                     {
//                       color: theme ? COLORS.darkModeText : COLORS.lightModeText,
//                     },
//                   ]}>
//                   Memo
//                 </Text>

//                 <TouchableOpacity
//                   onPress={() => {
//                     // descriptionRef.current.focus();
//                     navigate.navigate('LetterKeyboard', {
//                       descriptionValue: descriptionValue,
//                       setDescriptionValue: setDescriptionValue,
//                     });
//                   }}>
//                   <View
//                     style={[
//                       styles.textInputContainer,
//                       {
//                         backgroundColor: theme
//                           ? COLORS.darkModeBackgroundOffset
//                           : COLORS.lightModeBackgroundOffset,
//                         height: 145,
//                         padding: 10,
//                         borderRadius: 8,
//                       },
//                     ]}>
//                     <TextInput
//                       ref={descriptionRef}
//                       placeholder="Description"
//                       placeholderTextColor={
//                         theme ? COLORS.darkModeText : COLORS.lightModeText
//                       }
//                       onChangeText={value => setDescriptionValue(value)}
//                       editable={false}
//                       selectTextOnFocus={false}
//                       multiline
//                       textAlignVertical="top"
//                       numberOfLines={4}
//                       maxLength={150}
//                       lineBreakStrategyIOS="standard"
//                       value={descriptionValue}
//                       style={[
//                         styles.memoInput,
//                         {
//                           color: theme
//                             ? COLORS.darkModeText
//                             : COLORS.lightModeText,
//                           fontSize: SIZES.medium,
//                           height: 'auto',
//                           width: 'auto',
//                         },
//                       ]}
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={handleSubmit}
//                   style={[
//                     styles.button,
//                     {
//                       backgroundColor: theme
//                         ? COLORS.darkModeText
//                         : COLORS.lightModeText,
//                       opacity: canUseLightning || canUseLiquid ? 1 : 0.5,
//                     },
//                   ]}>
//                   <Text
//                     style={[
//                       styles.buttonText,
//                       {
//                         color: theme
//                           ? COLORS.lightModeText
//                           : COLORS.darkModeText,
//                       },
//                     ]}>
//                     Send
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </KeyboardAwareScrollView>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
//   async function handleSubmit() {
//     try {
//       if (Number(amountValue) === 0) {
//         navigate.navigate('ErrorScreen', {
//           errorMessage: 'Cannot send a 0 amount',
//         });
//         return;
//       }
//       if (!canUseLightning && !canUseLiquid) {
//         navigate.navigate('ErrorScreen', {
//           errorMessage: 'Payment must be above network fees',
//         });
//         return;
//       }

//       // const nostrProfile = JSON.parse(await retrieveData('myNostrProfile'));
//       // const blitzWalletContact = JSON.parse(
//       //   await retrieveData('blitzWalletContact'),
//       // );

//       // if (!blitzWalletContact.token) {
//       //   navigate.navigate('ErrorScreen', {
//       //     errorMessage: 'Notifications must be turned on',
//       //   });
//       //   return;
//       // }

//       const sendingAmountMsat = isBTCdenominated
//         ? amountValue * 1000
//         : (amountValue * SATSPERBITCOIN) / nodeInformation.fiatStats.value;

//       const UUID = randomUUID();
//       let sendObject = {};
//       // const data = `https://blitz-wallet.com/.netlify/functions/lnurlwithdrawl?platform=${
//       //   Platform.OS
//       // }&token=${blitzWalletContact?.token?.data}&amount=${
//       //   sendingAmountMsat / 1000
//       // }&uuid=${UUID}&desc=${LNURL_WITHDRAWL_CODES[3]}&totalAmount=${1}`;

//       // const byteArr = Buffer.Buffer.from(data, 'utf8');
//       // const words = bench32.bech32.toWords(byteArr);
//       // const encoded = bench32.bech32.encode('lnurl', words, 1500);
//       // const withdrawLNURL = encoded.toUpperCase();

//       if (paymentType === 'send') {
//         if (canUseLiquid) {
//           const didSend = await sendLiquidTransaction(
//             Number(amountValue),
//             selectedContact.receiveAddress,
//           );

//           sendObject['amountMsat'] = sendingAmountMsat;
//           sendObject['description'] = descriptionValue;
//           sendObject['uuid'] = UUID;
//           sendObject['isRequest'] = false;
//           sendObject['isRedeemed'] = true;

//           if (didSend) {
//             pubishMessageToAbly(
//               contactsPrivateKey,
//               selectedContact.uuid,
//               masterInfoObject.contacts.myProfile.uuid,
//               JSON.stringify(sendObject),
//               masterInfoObject,
//               toggleMasterInfoObject,
//               paymentType,
//               decodedContacts,
//               publicKey,
//             );
//             navigate.goBack();
//           } else {
//             navigate.goBack();
//           }
//         } else {
//           const [
//             data,
//             swapPublicKey,
//             privateKeyString,
//             keys,
//             preimage,
//             liquidAddress,
//           ] = await contactsLNtoLiquidSwapInfo(
//             selectedContact.receiveAddress,
//             sendingAmountMsat / 1000,
//           );

//           if (data?.invoice) {
//             const paymentAddresss = data.invoice;

//             const webSocket = new WebSocket(
//               `${getBoltzWsUrl(process.env.BOLTZ_ENVIRONMENT)}`,
//             );

//             webSocket.onopen = () => {
//               console.log('did un websocket open');
//               webSocket.send(
//                 JSON.stringify({
//                   op: 'subscribe',
//                   channel: 'swap.update',
//                   args: [data?.id],
//                 }),
//               );
//             };
//             webSocket.onmessage = async rawMsg => {
//               const msg = JSON.parse(rawMsg.data);
//               console.log(msg);
//               // console.log(
//               //   lntoLiquidSwapInfo,
//               //   // lntoLiquidSwapInfo.keys.privateKey.toString('hex'),
//               //   lntoLiquidSwapInfo.preimage,
//               // );
//               if (msg.args[0].status === 'swap.created') {
//                 try {
//                   const didSend = await sendPayment(paymentAddresss);
//                   if (didSend.payment.status === PaymentStatus.FAILED) {
//                     navigate.goBack();
//                     navigate.navigate('ErrorScreen', {
//                       errorMessage: 'Lightning payment failed',
//                     });
//                   }
//                 } catch (err) {
//                   console.log(err);
//                   navigate.goBack();
//                   navigate.navigate('ErrorScreen', {
//                     errorMessage: 'Lightning payment failed',
//                   });
//                 }
//               } else if (msg.args[0].status === 'transaction.mempool') {
//                 getClaimReverseSubmarineSwapJS({
//                   address: selectedContact.receiveAddress,
//                   swapInfo: data,
//                   preimage: preimage,
//                   privateKey: keys.privateKey.toString('hex'),
//                 });
//               } else if (msg.args[0].status === 'invoice.settled') {
//                 sendObject['amountMsat'] = sendingAmountMsat;
//                 sendObject['description'] = descriptionValue;
//                 sendObject['uuid'] = UUID;
//                 sendObject['isRequest'] = false;
//                 sendObject['isRedeemed'] = true;

//                 pubishMessageToAbly(
//                   contactsPrivateKey,
//                   selectedContact.uuid,
//                   masterInfoObject.contacts.myProfile.uuid,
//                   JSON.stringify(sendObject),
//                   masterInfoObject,
//                   toggleMasterInfoObject,
//                   paymentType,
//                   decodedContacts,
//                   publicKey,
//                 );
//                 webSocket.close();
//               }
//             };
//           } else {
//             navigate.goBack();
//           }

//           console.log(data);
//         }
//       } else {
//         sendObject['amountMsat'] = sendingAmountMsat;
//         sendObject['description'] = descriptionValue;
//         sendObject['uuid'] = UUID;
//         sendObject['isRequest'] = true;
//         sendObject['isRedeemed'] = false;

//         pubishMessageToAbly(
//           contactsPrivateKey,
//           selectedContact.uuid,
//           masterInfoObject.contacts.myProfile.uuid,
//           JSON.stringify(sendObject),
//           masterInfoObject,
//           toggleMasterInfoObject,
//           paymentType,
//           decodedContacts,
//           publicKey,
//         );
//         navigate.goBack();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function getClaimReverseSubmarineSwapJS({
//     address,
//     swapInfo,
//     preimage,
//     privateKey,
//   }) {
//     const args = JSON.stringify({
//       apiUrl: getBoltzApiUrl(process.env.BOLTZ_ENVIRONMENT),
//       network: process.env.BOLTZ_ENVIRONMENT,
//       address,
//       feeRate: 1,
//       swapInfo,
//       privateKey,
//       preimage,
//     });

//     console.log('SENDING CLAIM TO WEBVIEW', args);

//     webViewRef.current.injectJavaScript(
//       `window.claimReverseSubmarineSwap(${args}); void(0);`,
//     );
//   }
// }

// const styles = StyleSheet.create({
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 125,
//     borderWidth: 5,
//     backgroundColor: 'red',
//     ...CENTER,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   profileName: {
//     width: '90%',
//     fontSize: SIZES.large,
//     fontFamily: FONT.Title_Regular,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     ...CENTER,
//     marginBottom: 10,
//   },
//   topBar: {
//     width: 120,
//     height: 8,
//     marginTop: 10,
//     borderRadius: 8,
//     marginBottom: 20,
//   },

//   optionsContainer: {
//     width: '100%',
//     height: '100%',
//   },

//   optionRow: {
//     width: '95%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 30,
//     ...CENTER,
//   },
//   optionText: {
//     fontFamily: FONT.Title_Regular,
//     fontSize: SIZES.large,
//   },

//   icon: {
//     width: 35,
//     height: 35,
//     marginRight: 15,
//   },

//   globalContainer: {
//     flex: 1,
//   },

//   headerText: {
//     fontFamily: FONT.Title_Regular,
//     fontSize: SIZES.xLarge,
//     textAlign: 'center',
//   },
//   amountDenomination: {
//     fontFamily: FONT.Title_Regular,
//     fontSize: SIZES.medium,
//     textAlign: 'center',
//   },

//   textInputContainer: {
//     width: '95%',
//     margin: 0,
//     ...CENTER,
//   },
//   memoInput: {
//     width: '100%',
//     fontFamily: FONT.Descriptoin_Regular,
//     fontSize: SIZES.xLarge,
//   },

//   button: {
//     width: 120,
//     height: 45,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     ...SHADOWS.small,
//     ...CENTER,
//     marginBottom: 0,
//     marginTop: 'auto',
//   },
//   buttonText: {
//     fontFamily: FONT.Other_Regular,
//     fontSize: SIZES.large,
//   },
// });
