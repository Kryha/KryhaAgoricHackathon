import produceIssuer from '@agoric/ertp';

const unitIssuerResults = produceIssuer('unit');

export const unitMint = unitIssuerResults.mint;
export const unitIssuer = unitIssuerResults.issuer;
export const unitAmountMath = unitIssuerResults.amountMath;
