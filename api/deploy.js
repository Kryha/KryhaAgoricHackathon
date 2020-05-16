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

let INSTANCE_REG_KEY_NFT;
// let INSTANCE_REG_KEY_INVOICE;
// let INSTANCE_REG_KEY_SWAP;
// let INSTANCE_REG_KEY_CONVERTER;

const TOKEN_CONTRACT = 'tokenCreation'

const PLASTIC_A = {
  contract: 'plastic',
  issuerName: 'plastic',
  purseName: 'plastic purse'
}

const INVOICE = {
  contract: 'invoiceCreation',
  issuerName: 'invoice',
  purseName: 'invoice purse'
}

const CONVERTER_PLASTIC = {
  contract: 'converter',
  issuerName: 'invoice',
  purseName: 'invoice purse'
}

const SWAP = {
  contract: 'fakeSwap'
}

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

async function deployNFT (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  console.log(`-- deploying: NFT`)

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === PLASTIC_A.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  console.log('--- instance is running on Zoe');

  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = PLASTIC_A.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = PLASTIC_A.purseName;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);
  console.log(`--- empty ${pursePetname} is added to wallet`);

  let CONTRACT_NAME = PLASTIC_A.contract;
  INSTANCE_REG_KEY_NFT = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
  console.log(`--- contract is added to the registry under: ${INSTANCE_REG_KEY_NFT}`);

  return issuer;
}

// async function deployInvoice (references) {
//   const {
//     wallet,
//     zoe,
//     registry,
//   } = references;

//   const { contracts } = installationConstants;

//   console.log(`-- deploying: Invoice`)

//   const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === INVOICE.contract);
//   const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

//   const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
//   console.log('--- instance is running on Zoe');

//   const inviteIssuer = await E(zoe).getInviteIssuer();
//   const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
//   const instanceHandle = await getInstanceHandle(adminInvite);

//   const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
//   const invite = await E(publicAPI).makeInvite();

//   const issuer = await E(publicAPI).getTokenIssuer();

//   const issuerName = INVOICE.issuerName;
//   const brandRegKey = await E(registry).register(
//     issuerName,
//     await E(issuer).getBrand()
//   )

//   await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

//   const pursePetname = INVOICE.purseName;
//   await E(wallet).makeEmptyPurse(issuerName, pursePetname);
//   console.log(`--- empty ${pursePetname} is added to wallet`);

//   let CONTRACT_NAME = INVOICE.contract;
//   INSTANCE_REG_KEY_INVOICE = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
//   console.log(`--- contract is added to the registry under: ${INSTANCE_REG_KEY_INVOICE}`);

//   return issuer;
// }

async function deployConverter (references, tokenIssuer) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  console.log(`-- deploying: Converter`)

  const { contracts } = installationConstants;

  const { INSTALLATION_REG_KEY: converterRegKey } = contracts.find(({ name }) => name === CONVERTER_PLASTIC.contract);
  const converterContractInstallationHandle = await E(registry).get(converterRegKey);

  const issuerKeywordRecord = harden({
    Price: tokenIssuer,
  });
  const adminInvite = await E(zoe).makeInstance(converterContractInstallationHandle, issuerKeywordRecord);
  console.log('--- instance is running on Zoe');

  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = CONVERTER_PLASTIC.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = CONVERTER_PLASTIC.purseName;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  console.log(`--- empty ${pursePetname} is added to wallet`);

  let CONTRACT_NAME = CONVERTER_PLASTIC.contract;
  const regKey = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
  console.log(`--- contract is added to the registry under: ${regKey}`);

  return { regKey };
}


// async function swapTokenNft (references, tokenIssuer, nftIssuer) {
//   const {
//     wallet,
//     zoe,
//     registry,
//   } = references;

//   const { contracts } = installationConstants;

//   const { INSTALLATION_REG_KEY: swapRegKey } = contracts.find(({ name }) => name === SWAP.contract);
//   const swapContractInstallationHandle = await E(registry).get(swapRegKey);

//   const issuerKeywordRecord = harden({
//     Asset: nftIssuer,
//     Price: tokenIssuer,
//   });
//   const adminInvite = await E(zoe).makeInstance(swapContractInstallationHandle, issuerKeywordRecord);
//   console.log('--- instance is running on Zoe');

//   const inviteIssuer = await E(zoe).getInviteIssuer();
//   const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
//   const instanceHandle = await getInstanceHandle(adminInvite);

//   let CONTRACT_NAME = SWAP.contract;
//   INSTANCE_REG_KEY_SWAP = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
//   console.log(`--- contract is added to the registry under: ${INSTANCE_REG_KEY_SWAP}`);
// }

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
  const {
    wallet,
    uploads: scratch,
    spawner,
    zoe,
    registry,
    http,
  } = references;

  const {
    contracts
  } = installationConstants;

  const { issuer: tokenAIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_A } = await deployToken(references, 'typeA');
  const { issuer: tokenBIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_B } = await deployToken(references, 'typeB');
  const { issuer: tokenCIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_C } = await deployToken(references, 'typeC');
  const nftIssuer = await deployNFT(references);
  // const invoiceIssuer = await deployInvoice(references);
  // await swapTokenNft(references, tokenAIssuer, nftIssuer);
  const { regKey: INSTANCE_REG_KEY_CONVERTER } = await deployConverter(references, tokenAIssuer);
  // const { issuer: tokenAIssuer, regKey: INSTANCE_REG_KEY_CONVERTER_A } = await deployConverter(references, tokenAIssuer);

  const issuersArray = await E(wallet).getIssuers();
  const issuers = new Map(issuersArray);
  console.log(issuers);

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_REG_KEY_FUNGIBLE_A,
    INSTANCE_REG_KEY_FUNGIBLE_B,
    INSTANCE_REG_KEY_FUNGIBLE_C,
    INSTANCE_REG_KEY_NFT,
    INSTANCE_REG_KEY_CONVERTER,
    // BRIDGE_URL: 'agoric-lookup:https://local.agoric.com?append=/bridge',
    // brandRegKeys: { Tip: TIP_BRAND_REGKEY },
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
