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

// The deployer's wallet's petname for the tip issuer.
const TIP_ISSUER_PETNAME = process.env.TIP_ISSUER_PETNAME || 'typeA';
let INSTANCE_REG_KEY_NFT;
let INSTANCE_REG_KEY_FUNGIBLE_A;
let INSTANCE_REG_KEY_FUNGIBLE_B;
let INSTANCE_REG_KEY_FUNGIBLE_C;
let INSTANCE_REG_KEY_INVOICE;
let INSTANCE_REG_KEY_SWAP;
let INSTANCE_REG_KEY_CONVERTER;

const TOKEN_A = {
  contract: 'tokenACreation',
  issuerName: 'typeA',
  purseName: 'typeA purse'
}

const TOKEN_B = {
  contract: 'tokenBCreation',
  issuerName: 'typeB',
  purseName: 'typeB purse'
}

const TOKEN_C = {
  contract: 'tokenCCreation',
  issuerName: 'typeC',
  purseName: 'typeC purse'
}

const PLASTIC_A = {
  contract: 'plasticA1',
  issuerName: 'plasticA1',
  purseName: 'plasticA1 purse'
}

const INVOICE = {
  contract: 'invoiceCreation',
  issuerName: 'invoice',
  purseName: 'invoice purse'
}

const CONVERTER_PLASTIC = {
  contract: 'converter',
  issuerName: 'plastic bottle',
  purseName: 'plastic bottle purse'
}

const SWAP = {
  contract: 'fakeSwap'
}

async function deployToken (references, contractObj) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  let { 
    contract: contractName,
    issuerName,
    purseName: pursePetname
  } = contractObj;
  console.log(`-- deploy: ${contractName}`);

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === contractName);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const issuer = await E(publicAPI).getTokenIssuer();

  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  const regKey = await E(registry).register(`${contractName}instance`, instanceHandle);
  return { issuer, regKey };
}

async function deployNFT (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  console.log('deployNFT');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === PLASTIC_A.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  console.log('- SUCCESS! contract instance is running on Zoe');

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

  let CONTRACT_NAME = PLASTIC_A.contract;
  INSTANCE_REG_KEY_NFT = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  return issuer;
}

async function deployInvoice (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  console.log('deployInvoice');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === INVOICE.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  console.log('- SUCCESS! contract instance is running on Zoe');

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
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  let CONTRACT_NAME = INVOICE.contract;
  INSTANCE_REG_KEY_INVOICE = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  console.log('deployed Invoice');
  return issuer;
}

async function deployConverter (references, tokenIssuer) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  console.log('converter start');
  const { contracts } = installationConstants;

  const { INSTALLATION_REG_KEY: converterRegKey } = contracts.find(({ name }) => name === CONVERTER_PLASTIC.contract);
  const converterContractInstallationHandle = await E(registry).get(converterRegKey);

  console.log('converter get registry handle complete');

  const issuerKeywordRecord = harden({
    Price: tokenIssuer,
  });
  const adminInvite = await E(zoe).makeInstance(converterContractInstallationHandle, issuerKeywordRecord);
  console.log('- SUCCESS! contract instance is running on Zoe');

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

  let CONTRACT_NAME = CONVERTER_PLASTIC.contract;
  INSTANCE_REG_KEY_CONVERTER = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
}


async function swapTokenNft (references, tokenIssuer, nftIssuer) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  const { INSTALLATION_REG_KEY: swapRegKey } = contracts.find(({ name }) => name === SWAP.contract);
  const swapContractInstallationHandle = await E(registry).get(swapRegKey);

  const issuerKeywordRecord = harden({
    Asset: nftIssuer,
    Price: tokenIssuer,
  });
  const adminInvite = await E(zoe).makeInstance(swapContractInstallationHandle, issuerKeywordRecord);
  console.log('- SUCCESS! contract instance is running on Zoe');

  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);
  const instanceHandle = await getInstanceHandle(adminInvite);

  let CONTRACT_NAME = SWAP.contract;
  INSTANCE_REG_KEY_SWAP = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);
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

  const { issuer: tokenAIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_A } = await deployToken(references, TOKEN_A);
  const { issuer: tokenBIssuer, regKey: INSTANCE_REG_KEY_FUNGIBLE_B } = await deployToken(references, TOKEN_B);
  // const tokenCIssuer = await deployTokenC(references);
  const nftIssuer = await deployNFT(references);
  const invoiceIssuer = await deployInvoice(references);
  // await swapTokenNft(references, tokenAIssuer, nftIssuer);
  await deployConverter(references, tokenAIssuer);

  const issuersArray = await E(wallet).getIssuers();
  const issuers = new Map(issuersArray);
  console.log(issuers);

  // Re-save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    INSTANCE_REG_KEY_FUNGIBLE_A,
    INSTANCE_REG_KEY_FUNGIBLE_B,
    // INSTANCE_REG_KEY_FUNGIBLE_C,
    INSTANCE_REG_KEY_NFT,
    INSTANCE_REG_KEY_INVOICE,
    // INSTANCE_REG_KEY,
    // INSTANCE_REG_KEY_SWAP,
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
