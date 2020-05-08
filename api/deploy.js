// @ts-check
// Agoric Dapp api deployment script

import fs from 'fs';
import installationConstants from '../ui/public/conf/installationConstants.js';
import { E } from '@agoric/eventual-send';
import produceIssuer from '@agoric/ertp';
import harden from '@agoric/harden';
import { makeGetInstanceHandle } from '@agoric/zoe/src/clientSupport';

// deploy.js runs in an ephemeral Node.js outside of swingset. The
// spawner runs within ag-solo, so is persistent.  Once the deploy.js
// script ends, connections to any of its objects are severed.

// The deployer's wallet's petname for the tip issuer.
const TIP_ISSUER_PETNAME = process.env.TIP_ISSUER_PETNAME || 'typeA';

async function deployToken (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  console.log('deployToken');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === 'tokenCreation');
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = 'typeA'
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = `${issuerName} purse`;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  // TODO: remove | Temporarily contains a one time deposit
  const { payout: payoutP } = await E(zoe).offer(invite);
  console.log(await payoutP);

  const typeAPurse = await E(wallet).getPurse(pursePetname);

  payoutP.then(async payout => {
    const typeAPayment = await payout.TypeA;
    console.log('tip payment in typeA received. Depositing now.');
    try {
      await E(typeAPurse).deposit(typeAPayment);
      console.log('deposit successful.');
    } catch (e) {
      console.error(e);
    }
  });
}

async function deployNFT (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === 'plasticA');
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  console.log('- SUCCESS! contract instance is running on Zoe');

  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = 'Plastic'
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = `${issuerName} purse`;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);
}

/**
 * @typedef {Object} DeployPowers The special powers that `agoric deploy` gives us
 * @property {(path: string) => { moduleFormat: string, source: string }} bundleSource
 * @property {(path: string) => string} pathResolve
 */

/**
 * @param {any} referencesPromise A promise for the references
 * available from REPL home
 * @param {DeployPowers} powers
 */
export default async function deployApi (referencesPromise, { bundleSource, pathResolve }) {

  // Let's wait for the promise to resolve.
  const references = await referencesPromise;

  // Unpack the references.
  const {

    // *** LOCAL REFERENCES ***
    // This wallet only exists on this machine, and only you have
    // access to it. The wallet stores purses and handles transactions.
    wallet,

    // Scratch is a map only on this machine, and can be used for
    // communication in objects between processes/scripts on this
    // machine.
    uploads: scratch,

    // The spawner persistently runs scripts within ag-solo, off-chain.
    spawner,

    // *** ON-CHAIN REFERENCES ***

    // Zoe lives on-chain and is shared by everyone who has access to
    // the chain. In this demo, that's just you, but on our testnet,
    // everyone has access to the same Zoe.
    zoe,

    // The registry also lives on-chain, and is used to make private
    // objects public to everyone else on-chain. These objects get
    // assigned a unique string key. Given the key, other people can
    // access the object through the registry
    registry,

    // The http request handler.
    // TODO: add more explanation
    http,


  } = references;

  const {
    contracts
  } = installationConstants;

  await deployToken(references);
  await deployNFT(references);


  const issuersArray = await E(wallet).getIssuers();
  console.log(issuersArray);
  const issuers = new Map(issuersArray);
  const tipIssuer = issuers.get(TIP_ISSUER_PETNAME);

  if (tipIssuer === undefined) {
    console.error('Cannot find TIP_ISSUER_PETNAME', TIP_ISSUER_PETNAME, 'in home.wallet');
    console.error('Have issuers:', [...issuers.keys()].join(', '));
    process.exit(1);
  }


  const TIP_BRAND_REGKEY = await E.G(E(wallet).getIssuerNames(tipIssuer)).brandRegKey;

  const CONTRACT_NAME = 'encouragement';
  const { INSTALLATION_REG_KEY: encouragementRegKey } = contracts.find(({ name }) => name === CONTRACT_NAME);
  const encouragementContractInstallationHandle = await E(registry).get(encouragementRegKey);

  const issuerKeywordRecord = harden({ Tip: tipIssuer });
  const adminInvite = await E(zoe).makeInstance(encouragementContractInstallationHandle, issuerKeywordRecord);
  console.log('- SUCCESS! contract instance is running on Zoe');

  // Let's get the Zoe invite issuer to be able to inspect our invite further
  const inviteIssuer = await E(zoe).getInviteIssuer();

  // Use the helper function to get an instanceHandle from the invite.
  // An instanceHandle is like an installationHandle in that it is a
  // similar opaque identifier. In this case, though, it identifies a
  // running contract instance, not code. 
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);

  // Let's use the adminInvite to make an offer. Note that we aren't
  // specifying any proposal, and we aren't escrowing any assets with
  // Zoe in this offer. We are doing this so that Zoe will eventually
  // give us a payout of all of the tips. We can trigger this payout
  // by calling the `cancel` function on the `cancelObj`.
  const {
    payout: adminPayoutP,
    outcome: adminOutcomeP,
    cancelObj,
  } = await E(zoe).offer(adminInvite);

  const outcome = await adminOutcomeP;
  console.log(`-- ${outcome}`);

  // When the promise for a payout resolves, we want to deposit the
  // payments in our purses. We will put the adminPayoutP and
  // cancelObj in our scratch location so that we can share the
  // live objects with the shutdown.js script. 
  E(scratch).set('adminPayoutP', adminPayoutP);
  E(scratch).set('cancelObj', cancelObj);

  // Now that we've done all the admin work, let's share this
  // instanceHandle by adding it to the registry. Any users of our
  // contract will use this instanceHandle to get invites to the
  // contract in order to make an offer.
  const INSTANCE_REG_KEY = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  console.log(`-- Contract Name: ${CONTRACT_NAME}`);
  console.log(`-- InstanceHandle Register Key: ${INSTANCE_REG_KEY}`);
  console.log(`-- TIP_BRAND_REGKEY: ${TIP_BRAND_REGKEY}`)

  // We want the handler to run persistently. (Scripts such as this
  // deploy.js script are ephemeral and all connections to objects
  // within this script are severed when the script is done running.)
  // To run the handler persistently, we must use the spawner to run
  // the code on this machine even when the script is done running.

  // Bundle up the handler code
  const { source, moduleFormat } = await bundleSource(pathResolve('./src/handler.js'));

  // Install it on the spawner
  const handlerInstall = E(spawner).install(source, moduleFormat);

  // Spawn the running code
  const handler = E(handlerInstall).spawn({ publicAPI, http });
  await E(http).registerAPIHandler(handler);


  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_REG_KEY,
    // BRIDGE_URL: 'agoric-lookup:https://local.agoric.com?append=/bridge',
    brandRegKeys: { Tip: TIP_BRAND_REGKEY },
    BRIDGE_URL: 'http://127.0.0.1:8000',
    API_URL: 'http://127.0.0.1:8000',
  };
  const defaultsFile = pathResolve(`../ui/public/conf/defaults.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
  // GENERATED FROM ${pathResolve('./deploy.js')}
  export default ${JSON.stringify(dappConstants, undefined, 2)};
  `;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}
