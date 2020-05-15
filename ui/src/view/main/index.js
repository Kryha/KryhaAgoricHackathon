import React from 'react'
import { Flexdiv, Text } from '../shared/styled'
import Iframe from 'react-iframe'
import dappConstants from '../../constants'

import Creator from '../creator'
import Converter from '../converter'
import Decomposer from '../decomposer'

const Main = props => {
    const {
    CREATOR_WALLET,
    CONVERTER_WALLET,
    DECOMPOSER_WALLET
  } = dappConstants

  let wallet
  let render

  if(props.active ==='converter'){
    render = <Converter/>
    wallet = CONVERTER_WALLET
  }else if(props.active ==='decomposer'){
    render = <Decomposer/>
    wallet = DECOMPOSER_WALLET
  } else {
    render = <Creator/>
    wallet = CREATOR_WALLET
  }

  // TODO: Decide whether to include or delete multiple wallet support. This is a temporary fix 
  wallet = CREATOR_WALLET

  return (
    <Flexdiv
      flex='column'
      w='80%'
      h='100%'
      marginl='10%'
      background='#3E3E3E'
      radius='3px'
    >
      <Flexdiv
        flex='row'
        w='100%'
        h='50%'
      >
        {render}
      </Flexdiv>

      <Flexdiv
        flex='column'
        w='100%'
        h='50%'
      >
        <Flexdiv
          flex='row'
          w='100%'
          h='5%'
        >
          <Text
            c='#ED7174'
            margin ='0'
            marginl='5%'
          >Approve/reject purchase orders</Text>
        </Flexdiv>

        <Flexdiv
          flex='row'
          w='100%'
          h='95%'
          background='#FFF'
        >
          <Iframe url={wallet}
            width="100%"
            height="100%"
            id="walletBridgeIFrame"
            className="walletBridgeIFrame"
            display="initial"
            position="flex"/>
        </Flexdiv>
      </Flexdiv>
    </Flexdiv>
  )
}

export default Main
