import { doFetch } from './fetch-websocket';

export const walletAddOffer = async (offer) => {
  return doFetch(
    {
      type: 'walletAddOffer',
      data: offer,
    },
  )
}