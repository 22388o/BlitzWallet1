import {
  receiveOnchain,
  receivePayment,
  openChannelFee,
} from '@breeztech/react-native-breez-sdk';
import {SATSPERBITCOIN} from '../../constants';
import {createLiquidSwap, getSwapPairInformation} from '../LBTC';

async function generateUnifiedAddress(
  nodeInformation,
  userBalanceDenomination,
  amount,
  description,
  isGeneratingAddressFunc,
  setMinMaxSwapAmount,
  setErrorMessageText,
) {
  try {
    isGeneratingAddressFunc(true);

    const bitcoinAddress = await generateBitcoinAddress(
      nodeInformation,
      userBalanceDenomination,
      amount,
      description,
      undefined,
      setMinMaxSwapAmount,
      setErrorMessageText,
    );

    const lightningAddress = await generateLightningAddress(
      nodeInformation,
      userBalanceDenomination,
      amount,
      description,
      undefined,
      setErrorMessageText,
    );

    if (!bitcoinAddress || !lightningAddress) return;

    const unifiedAddress = `bitcoin:${bitcoinAddress}?amount=${
      userBalanceDenomination === 'fiat'
        ? (amount / nodeInformation.fiatStats.value).toFixed(8)
        : (amount / SATSPERBITCOIN).toFixed(8)
    }&lightning=${lightningAddress}`;

    isGeneratingAddressFunc(false);
    console.log(unifiedAddress);
    return new Promise(resolve => {
      resolve(unifiedAddress);
    });
  } catch (err) {
    console.log(err);
  }
}

async function generateBitcoinAddress(
  nodeInformation,
  userBalanceDenomination,
  amount,
  description,
  isGeneratingAddressFunc,
  setMinMaxSwapAmount,
  setErrorMessageText,
) {
  try {
    const requestedSatAmount =
      userBalanceDenomination === 'fiat'
        ? Math.floor(
            (amount / nodeInformation.fiatStats.value) * SATSPERBITCOIN,
          )
        : amount;

    console.log(requestedSatAmount);

    isGeneratingAddressFunc && isGeneratingAddressFunc(true);
    const swapInfo = await receiveOnchain({
      description: description,
      amount: requestedSatAmount,
    });
    setMinMaxSwapAmount({
      min: swapInfo.minAllowedDeposit,
      max: swapInfo.maxAllowedDeposit,
    });
    isGeneratingAddressFunc && isGeneratingAddressFunc(false);

    return new Promise(resolve => {
      resolve(
        `bitcoin:${swapInfo.bitcoinAddress}?amount=${
          userBalanceDenomination === 'fiat'
            ? (amount / nodeInformation.fiatStats.value).toFixed(8)
            : (amount / SATSPERBITCOIN).toFixed(8)
        }`,
      );
    });
  } catch (err) {
    return new Promise(resolve => {
      resolve(false);
    });
  }
}

async function generateLightningAddress(
  nodeInformation,
  userBalanceDenomination,
  amount,
  description,
  isGeneratingAddressFunc,
  setErrorMessageText,
) {
  try {
    const requestedSatAmount =
      userBalanceDenomination === 'fiat'
        ? Math.floor(
            (amount / nodeInformation.fiatStats.value) * SATSPERBITCOIN,
          )
        : amount;

    isGeneratingAddressFunc && isGeneratingAddressFunc(true);
    console.log(requestedSatAmount);
    checkRecevingCapacity(
      setErrorMessageText,
      nodeInformation,
      requestedSatAmount,
      userBalanceDenomination,
    );

    // if (requestedSatAmount === 0) {
    //   setErrorMessageText('Must set invoice for more than 0 sats');
    //   return;
    // }

    // setErrorMessageText('');

    // const channelFee = await openChannelFee({
    //   amountMsat: requestedSatAmount * 1000,
    // });

    // if (nodeInformation.inboundLiquidityMsat < requestedSatAmount * 1000) {
    //   setErrorMessageText(
    //     `Amount is above your receiving capacity. Sending this payment will incur a ${Math.ceil(
    //       channelFee.feeMsat / 1000,
    //     ).toLocaleString()} sat fee`,
    //   );
    // }
    // if (
    //   channelFee.feeMsat != 0 &&
    //   channelFee.feeMsat + 500 * 1000 > requestedSatAmount * 1000
    // ) {
    //   setErrorMessageText(
    //     `It costs ${Math.ceil(
    //       channelFee.feeMsat / 1000 + 500,
    //     ).toLocaleString()} sat to open a channel, but only ${Math.ceil(
    //       requestedSatAmount / 1000,
    //     ).toLocaleString()} sat was requested.`,
    //   );
    //   return;
    // }
    const invoice = await receivePayment({
      amountMsat: requestedSatAmount * 1000,
      description: description,
    });

    if (invoice) {
      isGeneratingAddressFunc && isGeneratingAddressFunc(false);
      return new Promise(resolve => {
        resolve(invoice.lnInvoice.bolt11);
      });
    }
  } catch (err) {
    return new Promise(resolve => {
      resolve(false);
    });
  }
}

async function generateLiquidAddress(
  nodeInformation,
  userBalanceDenomination,
  amount,
  paymentDescription,
  isGeneratingAddressFunc,
  setMinMaxSwapAmount,
  setErrorMessageText,
  setSendingAmount,
  setInProgressSwapInfo,
) {
  try {
    isGeneratingAddressFunc && isGeneratingAddressFunc(true);
    const requestedSatAmount =
      userBalanceDenomination === 'fiat'
        ? Math.floor(
            (amount / nodeInformation.fiatStats.value) * SATSPERBITCOIN,
          )
        : amount;

    const pairSwapInfo = await getSwapPairInformation();
    if (!pairSwapInfo) new Error('no swap info');
    const adjustedSatAmount = Math.round(
      requestedSatAmount -
        pairSwapInfo.fees.minerFees.baseAsset?.normal -
        requestedSatAmount * (pairSwapInfo.fees.percentageSwapIn / 100),
    );

    console.log(adjustedSatAmount, requestedSatAmount);
    console.log(adjustedSatAmount < pairSwapInfo.limits.minimal, 'TESTING');
    if (adjustedSatAmount < pairSwapInfo.limits.minimal) {
      setErrorMessageText({
        type: 'stop',
        text: 'Request amount is below minimum receive amount',
      });
      return new Promise(resolve => {
        resolve('in function error');
      });
    }

    if (requestedSatAmount > pairSwapInfo.limits.maximalZeroConf) {
      setErrorMessageText({
        type: 'warning',
        text: 'Amount is greater than max swap limit',
      });
      return new Promise(resolve => {
        resolve('in function error');
      });
    }
    console.log(adjustedSatAmount, requestedSatAmount);
    setErrorMessageText('');
    checkRecevingCapacity(
      setErrorMessageText,
      nodeInformation,
      Math.round(adjustedSatAmount),
      userBalanceDenomination,
    );

    const invoice = await receivePayment({
      amountMsat: adjustedSatAmount * 1000,
      description: 'Liquid Swap',
    });
    if (invoice) {
      const swapInfo = await createLiquidSwap(
        invoice.lnInvoice.bolt11,
        pairSwapInfo.hash,
      );
      console.log(swapInfo);
      console.log(pairSwapInfo.limits);
      setMinMaxSwapAmount({
        min: pairSwapInfo.limits.minimal + 500,
        max: pairSwapInfo.limits.maximalZeroConf?.baseAsset,
      });
      setInProgressSwapInfo({
        hash: pairSwapInfo.hash,
        adjustedSatAmount: adjustedSatAmount,
        id: swapInfo.id,
        redeemScript: swapInfo.redeemScript,
      });
      isGeneratingAddressFunc && isGeneratingAddressFunc(false);
      return new Promise(resolve => {
        resolve(swapInfo.bip21);
      });
    }
  } catch (err) {
    console.log(err);
    return new Promise(resolve => {
      resolve(false);
    });
  }
}

async function checkRecevingCapacity(
  setErrorMessageText,
  nodeInformation,
  satAmount,
  userBalanceDenomination,
) {
  if (satAmount === 0) {
    setErrorMessageText({
      type: 'stop',
      text: 'Must set invoice for more than 0 sats',
    });
    return new Promise(resolve => {
      resolve('in function error');
    });
  }

  setErrorMessageText('');

  const channelFee = await openChannelFee({
    amountMsat: satAmount * 1000,
  });

  if (nodeInformation.inboundLiquidityMsat < satAmount * 1000) {
    setErrorMessageText({
      type: 'warning',
      text: `Amount is above your receiving capacity. Sending this payment will incur a ${Math.ceil(
        userBalanceDenomination === 'fiat'
          ? (
              (channelFee.feeMsat / 1000) *
              (nodeInformation.fiatStats.value / SATSPERBITCOIN)
            ).toFixed(2)
          : channelFee.feeMsat / 1000,
      ).toLocaleString()} ${
        userBalanceDenomination === 'fiat'
          ? nodeInformation.fiatStats.coin
          : 'sat'
      } fee`,
    });
  }
  if (
    channelFee.feeMsat != 0 &&
    channelFee.feeMsat + 500 * 1000 > satAmount * 1000
  ) {
    setErrorMessageText({
      type: 'stop',
      text: `It costs ${Math.ceil(
        userBalanceDenomination === 'fiat'
          ? (
              (channelFee.feeMsat / 1000 + 500) *
              (nodeInformation.fiatStats.value / SATSPERBITCOIN)
            ).toFixed(2)
          : channelFee.feeMsat / 1000 + 500,
      ).toLocaleString()} ${
        userBalanceDenomination === 'fiat'
          ? nodeInformation.fiatStats.coin
          : 'sat'
      } to open a channel, but only ${Math.ceil(
        userBalanceDenomination === 'fiat'
          ? (
              (channelFee.feeMsat / 1000 + 500) *
              (nodeInformation.fiatStats.value / SATSPERBITCOIN)
            ).toFixed(2)
          : channelFee.feeMsat / 1000 + 500,
      ).toLocaleString()} ${
        userBalanceDenomination === 'fiat'
          ? nodeInformation.fiatStats.coin
          : 'sat'
      } was requested.`,
    });
    return;
  }
}

export {
  generateUnifiedAddress,
  generateLightningAddress,
  generateBitcoinAddress,
  generateLiquidAddress,
};
