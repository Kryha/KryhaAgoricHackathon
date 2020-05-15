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
  issuerName: 'plastic',
  purseName: 'plastic purse'
}

const SWAP = {
  contract: 'fakeSwap'
}

async function deployTokenA (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  console.log('deployToken');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === TOKEN_A.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = TOKEN_A.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = TOKEN_A.purseName;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  let CONTRACT_NAME = TOKEN_A.contract;
  INSTANCE_REG_KEY_FUNGIBLE_A = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  return issuer;
}

async function deployTokenB (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  console.log('deployToken');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === TOKEN_B.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = TOKEN_B.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = TOKEN_B.purseName;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  let CONTRACT_NAME = TOKEN_B.contract;
  INSTANCE_REG_KEY_FUNGIBLE_B = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  return issuer;
}

async function deployTokenC (references) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const {
    contracts
  } = installationConstants;

  console.log('deployToken');

  const { INSTALLATION_REG_KEY: tokenCreationRegKey } = contracts.find(({ name }) => name === TOKEN_C.contract);
  const mintContractInstallationHandle = await E(registry).get(tokenCreationRegKey);
  const inviteIssuer = await E(zoe).getInviteIssuer();
  const getInstanceHandle = makeGetInstanceHandle(inviteIssuer);

  const adminInvite = await E(zoe).makeInstance(mintContractInstallationHandle);
  const instanceHandle = await getInstanceHandle(adminInvite);

  const { publicAPI } = await E(zoe).getInstanceRecord(instanceHandle);
  const invite = await E(publicAPI).makeInvite();

  const issuer = await E(publicAPI).getTokenIssuer();

  const issuerName = TOKEN_C.issuerName;
  const brandRegKey = await E(registry).register(
    issuerName,
    await E(issuer).getBrand()
  )

  await E(wallet).addIssuer(issuerName, issuer, brandRegKey)

  const pursePetname = TOKEN_C.purseName;
  await E(wallet).makeEmptyPurse(issuerName, pursePetname);

  let CONTRACT_NAME = TOKEN_C.contract;
  INSTANCE_REG_KEY_FUNGIBLE_C = await E(registry).register(`${CONTRACT_NAME}instance`, instanceHandle);

  return issuer;
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

  return issuer;
}

async function deployConverter (references, tokenIssuer) {
  const {
    wallet,
    zoe,
    registry,
  } = references;

  const { contracts } = installationConstants;

  const { INSTALLATION_REG_KEY: converterRegKey } = contracts.find(({ name }) => name === CONVERTER_PLASTIC.contract);
  const converterContractInstallationHandle = await E(registry).get(converterRegKey);

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

  const tokenPurse = await E(wallet).getPurse(TOKEN_A.purseName);
  const nftPurse = await E(wallet).getPurse(INVOICE.purseName);

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

  const tokenAIssuer = await deployTokenA(references);
  const tokenBIssuer = await deployTokenB(references);
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
