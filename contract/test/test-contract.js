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

    // make some mints/issuers for the test
    // const {
    //   issuer: plasticIssuer,
    //   mint: plasticMint,
    //   amountMath: plasticAmountMath,
    // } = produceIssuer('plastics', 'strSet');

    // const plastic5 = plasticAmountMath.make(5);
    // const plasticPayment = plasticMint.mintPayment(plastic5);

    const adminInvite = await E(zoe).makeInstance(installationHandle, {
      Plastic: 'plastics',
    });

    t.ok(
      await E(inviteIssuer).isLive(adminInvite),
      `an valid invite (an ERTP payment) was created`,
    );
  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  }
});
