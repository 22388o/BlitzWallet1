import * as nostr from 'nostr-tools';

import {retrieveData} from '../secureStore';

export async function generatePubPrivKeyForMessaging() {
  try {
    const mnemonic = await retrieveData('mnemonic');

    const privateKey = nostr.nip06.privateKeyFromSeedWords(mnemonic);
    const publicKey = nostr.getPublicKey(privateKey);

    return new Promise(resolve => resolve(publicKey));
  } catch (err) {
    console.log(err);
  }
}
