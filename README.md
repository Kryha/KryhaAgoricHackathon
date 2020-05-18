# KryhaAgoricHackathon

## Project description
As Kryha team we focused on building a complete Agoric Dapp for one specific but easily generalizable usecase. We aim to improve circularity within supply chains by enabling traceability of its individual components.

For this case study we focussed on tracing plastic bottles from where the initial raw materials where mined to the conversion of these raw materials into empty bottles to the recycler that decomposes these bottles back to raw materials.

## Limitations
- Working with multiple wallets caused too many problems, and therefore we did not implement a transaction contract between wallets. This limitation is essential for this demo. In order to make it more clear every transaction that needs further explanation creates an alert.

## Clone the repo
```git clone https://github.com/Kryha/KryhaAgoricHackathon.git```

## Checkout to develop branch
```git checkout develop```

## Install Javascript dependencies
```agoric install```

## Start the Agoric VM 
```agoric start --reset```

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
- ```tokenCreation```: Mints fungible tokens, for the Creator. Mirroring the initial raw (virgin) materials being sourced in the physical world.
- ```converter```: Creates a new non-fungible token in exchange for burning (destructive usage of) fungible tokens. This contract converts input A into output B, losing A in the process. This contract mirrors a manufacturing process where raw materials are being converted into new empty plastic bottles using up the raw materials in the process.
- ```invoiceCreation```: Mints a non-fungible token which represents an invoice and sets the attributes of the invoice.
- ```plasticA```: Mints a non-fungible token which represents a plastic of type A and sets the attributes of the plastic.

## Improvements
- Use multiple wallets: This way the demo can be closer to real use case scenarios and also more descentralized. All identities will have a need to know basis, and their own purses. This will also make it possible to trace plastics to individual parties and trace the recycle history of individual products. For example; we can trace how much of a specific bottle has been made of recycled plastics.
- More checks need to done in the smart contract level in order to utilize Zoe's security.
- Tests have to be written to validate the correct behaviour of the smart contracts.
