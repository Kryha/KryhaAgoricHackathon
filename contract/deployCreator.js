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
export default async function deployContract (
  referencesPromise,
  { bundleSource, pathResolve },
) {
  const references = await referencesPromise;
  const { zoe, registry } = references;

  const contracts = [
    {
      name: 'tokenCreation',
      path: `./src/tokenCreation.js`,
    }
  ];

  console.log('- Installing contract code installed on Zoe');
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
      console.log(`-- ${contract.name}::${INSTALLATION_REG_KEY}`);

      return { ...contract, INSTALLATION_REG_KEY };
    }),
  );

  // Save the constants somewhere where the UI and api can find it.
  const dappConstants = {
    contracts: installedContracts,
  };
  const defaultsFile = pathResolve(`../ui/src/conf/installationConstants.js`);
  console.log('writing', defaultsFile);
  const defaultsContents = `\
  // GENERATED FROM ${pathResolve('./deploy.js')}
  export default ${JSON.stringify(dappConstants, undefined, 2)};
  `;
  await fs.promises.writeFile(defaultsFile, defaultsContents);
}