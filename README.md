# KryhaAgoricHackathon

## Project description
As Kryha team we focused on building a complete Agoric Dapp for one specific but easily generalizable usecase. We aim to improve circularity within supply chains by enabling traceability of its individual components.

For this case study we focussed on tracing plastic bottles from where the initial raw materials where mined to the conversion of these raw materials into empty bottles to the recycler that decomposes these bottles back to raw materials.

## Limitations
- Have to run the project with `--delay 1` because of `unimplemented errors` in the fakeChain.
- Working with multiple wallets caused too many problems, and therefore we did not implement a transaction contract between wallets.
- In order to demonstrate our concept with one wallet, when tokens are being used, they are also being burnt.

## Clone the repo
```git clone https://github.com/Kryha/KryhaAgoricHackathon.git```

## Checkout to develop branch
```git checkout develop```

## Install Javascript dependencies
```agoric install```

## Start the Agoric VM 
```agoric start --delay 1 --reset```

## Deploy Dapp, install smart contracts and web apis
```agoric deploy ./contract/deploy.js ./api/deploy.js```

## Frontend
```cd ui```
```yarn install```
```yarn start```

Visit ```http://localhost:3000``` for the frontend and ```http://localhost:8000/``` for the wallet.

## Development
While developing follow the guide for every change you make
https://agoric.com/documentation/getting-started/development-cycle.html

## Smart Contracts
- ```tokenCreation```: Mints fungible tokens, for the Creator.
- ```converter```: Expects an amount of fungible tokens, when they are received burns them and mints an invoice NFT.
- ```plastic```: Mints a NFT which represents the plastic bottles with a specific type and amount of tokens that were used to create it.

## Improvements
- Use multiple wallets: This way the demo can be closer to real use case scenarios and also more descentralized. All identities will have a need to know basic, and their own purses. 
- More checks need to done in the smart contract level in order to utilize Zoe's security.
