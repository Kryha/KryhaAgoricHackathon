// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from 'tape-promise/tape';
// eslint-disable-next-line import/no-extraneous-dependencies
import bundleSource from '@agoric/bundle-source';

import { E } from '@agoric/eventual-send';
import harden from '@agoric/harden';

import { makeZoe } from '@agoric/zoe';
import produceIssuer from '@agoric/ertp';
import { makeGetInstanceHandle } from '@agoric/zoe/src/clientSupport';

const contractPath = `${__dirname}/../src/plasticA`;

test('contract with valid offers', async t => {
  try {
    t.plan(3);
    // Set up
    const zoe = makeZoe({ require });
    const inviteIssuer = await E(zoe).getInviteIssuer();
    const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
    const { source, moduleFormat } = await bundleSource(contractPath);
    const installationHandle = await E(zoe).install(source, moduleFormat);
    const code = await E(zoe).getInstallation(installationHandle);

    // test that everything is ok till now
    t.ok(
      code.includes(`This contract mints a NFT.`),
      `the code installed passes a quick check of what we intended to install`,
    );

    const adminInvite = await E(zoe).makeInstance(installationHandle);

    t.ok(
      await E(inviteIssuer).isLive(adminInvite),
      `a valid invite (an ERTP payment) was created`,
    );

    const instanceHandle = await getInstanceHandle(adminInvite);

    const {
      payout: adminPayoutP,
      outcome: adminOutcomeP,
      cancelObj: { cancel: cancelAdmin },
    } = await E(zoe).offer(adminInvite);

    t.equals(
      await adminOutcomeP,
      `admin invite redeemed`,
      `admin outcome is correct`,
    );
  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  }
});
