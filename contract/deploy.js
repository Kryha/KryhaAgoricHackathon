// @ts-check
import fs from 'fs';
import { E } from '@agoric/eventual-send';

// This script takes our contract code, installs it on Zoe, and makes
// the installation publicly available. Our backend API script will
// use this installation in a later step.

/**
 * @typedef {Object} DeployPowers The special powers that agoric deploy gives us
 * @property {(path: string) => { moduleFormat: string, source: string }} bundleSource
 * @property {(path: string) => string} pathResolve
 */

/**
 *
 * @param {*} referencesPromise
 * @param {DeployPowers} powers
 */
export default async function deployContract(
  referencesPromise,
  { bundleSource, pathResolve },
) {
  // Your off-chain machine (what we call an ag-solo) starts off with
  // a number of references, some of which are shared objects on chain, and
  // some of which are objects that only exist on your machine.

  // Let's wait for the promise to resolve.
  const references = await referencesPromise;

  // Unpack the references.
  const {
    // *** ON-CHAIN REFERENCES ***

    // Zoe lives on-chain and is shared by everyone who has access to
    // the chain. In this demo, that's just you, but on our testnet,
    // everyone has access to the same Zoe.
    zoe,

    // The registry also lives on-chain, and is used to make private
    // objects public to everyone else on-chain. These objects get
    // assigned a unique string key. Given the key, other people can
    // access the object through the registry.
    registry,
  } = references;

  const contracts = [
    {
      name: 'tokenCreation',
      path: `./src/tokenCreation.js`,
    },
    {
      name: 'encouragement',
      path: `./src/encouragement.js`,
    },
    {
      name: 'plasticA',
      path: `./src/plasticA.js`,
    },
    {
      name: 'atomicSwap',
      path: `./src/atomicSwap.js`,
    },
  ];

  const installedContracts = await Promise.all(
    contracts.map(async contract => {
      const { source, moduleFormat } = await bundleSource(
        pathResolve(contract.path),
      );
      const installationHandle = await E(zoe).install(source, moduleFormat);

      const INSTALLATION_REG_KEY = await E(registry).register(
        `${contract.name}installation`,
        installationHandle,
      );
      console.log('- SUCCESS! contract code installed on Zoe');
      console.log(`-- Contract Name: ${contract.name}`);
      console.log(
        `-- InstallationHandle Register Key: ${INSTALLATION_REG_KEY}`,
      );

      return { ...contract, INSTALLATION_REG_KEY };
    }),
  );

  // Save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    contracts: installedContracts,
  };
  const defaultsFile = pathResolve(
    `../ui/public/conf/installationConstants.js`,
  );
  console.log('writing', defaultsFile);
  const defaultsContents = `\
  // GENERATED FROM ${pathResolve('./deploy.js')}
  export default ${JSON.stringify(dappConstants, undefined, 2)};
  `;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}
