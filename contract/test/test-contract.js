// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from 'tape-promise/tape';
// eslint-disable-next-line import/no-extraneous-dependencies
import bundleSource from '@agoric/bundle-source';

import { E } from '@agoric/eventual-send';
import harden from '@agoric/harden';

import { makeZoe } from '@agoric/zoe';
import { makeGetInstanceHandle } from '@agoric/zoe/src/clientSupport';

const mintPaymentsRoot = `${__dirname}/../src/plasticA`;

test('zoe - mint payments', async t => {
  t.plan(2);
  try {
    const zoe = makeZoe({ require });
    // Pack the contract.
    const { source, moduleFormat } = await bundleSource(mintPaymentsRoot);
    const installationHandle = await E(zoe).install(source, moduleFormat);
    const inviteIssuer = await E(zoe).getInviteIssuer();
    const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

    // Alice creates a contract instance
    const adminInvite = await E(zoe).makeInstance(installationHandle);
    const instanceHandle = await getInstanceHandle(adminInvite);

    // Bob wants to get 1000 tokens so he gets an invite and makes an
    // offer
    const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
    const invite = await E(publicAPI).makeInvite();
    t.ok(await E(inviteIssuer).isLive(invite), `valid invite`);
    const { payout: payoutP } = await E(zoe).offer(invite);

    // Bob's payout promise resolves
    const bobPayout = await payoutP;
    const bobTokenPayout = await bobPayout.Token;

    // Let's get the tokenIssuer from the contract so we can evaluate
    // what we get as our payout
    const tokenIssuer = await E(publicAPI).getTokenIssuer();
    const amountMath = await E(tokenIssuer).getAmountMath();

    const tokens1000 = await E(amountMath).make(harden([{ type: 'typeA' }]));
    const tokensBrand = tokens1000.brand;
    const tokenPayoutAmount = await E(tokenIssuer).getBrand();

    console.log(tokenPayoutAmount);
    console.log(tokens1000);

    t.deepEquals(tokenPayoutAmount, tokensBrand);
  } catch (e) {
    t.assert(false, e);
    console.log(e);
  }
});
