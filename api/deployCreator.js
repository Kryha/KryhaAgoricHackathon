// @ts-check
// Agoric Dapp api deployment script

import fs from 'fs';
import installationConstants from '../ui/src/conf/installationConstants.js';
import { E } from '@agoric/eventual-send';
import produceIssuer from '@agoric/ertp';
import harden from '@agoric/harden';
import { makeGetInstanceHandle } from '@agoric/zoe/src/clientSupport';

// deploy.js runs in an ephemeral Node.js outside of swingset. The
// spawner runs within ag-solo, so is persistent.  Once the deploy.js
// script ends, connections to any of its objects are severed.

const TOKEN_CONTRACT = 'tokenCreation'

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function deployToken (references, tokenName) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  console.log(`-- deploying: ${tokenName}`)

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === TOKEN_CONTRACT);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const terms = harden({
    issuerName: capitalize(tokenName),
  })
  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle, harden({}), terms);
  console.log('--- instance is running on Zoe');

  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const issuer = await E(publicAPI).getTokenIssuer();

  const brandRegKey = await E(registry).register(
    tokenName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(tokenName, issuer, brandRegKey)

  const pursePetName = `${capitalize(tokenName)} purse`;
  await E(wallet).makeEmptyPurse(tokenName, pursePetName);
  console.log(`--- empty ${pursePetName} is added to wallet`);

  const regKey = await E(registry).register(`${TOKEN_CONTRACT}_${tokenName}_instance`, instanceHandle);
  console.log(`--- contract is added to the registry under: ${regKey}`);

  return { issuer, regKey };
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
  const references = await referencesPromise;

  const { issuer: tokenAIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_A } = await deployToken(references, 'typeA');
  const { issuer: tokenBIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_B } = await deployToken(references, 'typeB');
  const { issuer: tokenCIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_C } = await deployToken(references, 'typeC');

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_REG_KEY_FUNGIBLE_A,
    INSTANCE_REG_KEY_FUNGIBLE_B,
    INSTANCE_REG_KEY_FUNGIBLE_C,
    BRIDGE_URL: 'http://127.0.0.1:8000',
    API_URL: 'http://127.0.0.1:8000',
  };
  const defaultsFile = pathResolve(`../ui/src/conf/defaults.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
  // GENERATED FROM ${pathResolve('./deploy.js')}
  export default ${JSON.stringify(dappConstants, undefined, 2)};
  `;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}