// @ts-check
// Agoric Dapp api deployment script

import fs from 'fs';
import installationConstants from '../ui/src/conf/installationConstantsConverter.js';
import { E } from '@agoric/eventual-send';
import produceIssuer from '@agoric/ertp';
import harden from '@agoric/harden';
import { makeGetInstanceHandle } from '@agoric/zoe/src/clientSupport';

// deploy.js runs in an ephemeral Node.js outside of swingset. The
// spawner runs within ag-solo, so is persistent.  Once the deploy.js
// script ends, connections to any of its objects are severed.

const INVOICE = {
  contract: 'invoiceCreation',
  issuerName: 'invoice',
  purseName: 'invoice purse'
}

const PURCHASE_CONTRACT = 'purchase'
const TOKEN_CONTRACT = 'tokenContract'
let CONTRACT_NAME = INVOICE.contract;

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function deployInvoice (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  console.log(`-- deploying: Invoice`)

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === INVOICE.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  console.log('--- instance is running on Zoe');

  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = INVOICE.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = INVOICE.purseName;
  await E(wallet).makeEmptyPurse(issuerName, "Converter " + pursePetname);
  console.log(`--- empty ${pursePetname} is added to wallet`);

  const regKey = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
  console.log(`--- contract is added to the registry under: ${regKey}`);

  return { issuer, regKey };
}

async function deployToken (references, tokenName) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  console.log(`-- deploying: Token`)

  const { INSTALLATION_REG_KEY: tokenContractRegKey } = contracts.find(({ name }) => name === TOKEN_CONTRACT);
  const tokenContractInstallationHandle = await E(registry).get(tokenContractRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const terms = harden({
    issuerName: capitalize(tokenName),
  })
  const adminInvite = await E(zoe).makeInstance(tokenContractInstallationHandle, harden({}), terms);
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

  const { issuer: invoiceIssuer, regKey: INSTANCE_REG_KEY_INVOICE } = await deployInvoice(references);
  const { issuer: tokenAIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_A_CONVERTER } = await deployToken(references, 'typeA');
  const { issuer: tokenBIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_B_CONVERTER } = await deployToken(references, 'typeB');
  const { issuer: tokenCIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_C_CONVERTER } = await deployToken(references, 'typeC');

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_REG_KEY_INVOICE,
    INSTANCE_REG_KEY_FUNGIBLE_A_CONVERTER,
    INSTANCE_REG_KEY_FUNGIBLE_B_CONVERTER,
    INSTANCE_REG_KEY_FUNGIBLE_C_CONVERTER,
    BRIDGE_URL: 'http://127.0.0.1:8001',
    API_URL: 'http://127.0.0.1:8001',
  };
  const defaultsFile = pathResolve(`../ui/src/conf/defaultsConverter.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
  // GENERATED FROM ${pathResolve('./deploy.js')}
  export default ${JSON.stringify(dappConstants, undefined, 2)};
  `;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}