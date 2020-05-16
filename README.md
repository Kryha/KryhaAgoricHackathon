# KryhaAgoricHackathon

## Project description
We at Kryha focused on building a complete Agoric Dapp for one specific but easily generalizable usecase. We aim to improve circularity within supply chains by enabling traceability of its individual components.

For this case study we focussed on tracing plastic bottles from where the initial raw materials where mined to the conversion of these raw materials into empty bottles to the recycler that decomposes these bottles back to raw materials.

## Limitations
- Have to run the project with `--delay 1` because of `unimplemented errors` in the fakeChain.
- Working with multiple wallets caused to many problems, and therefore we did not implement a transaction contract between wallets.

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