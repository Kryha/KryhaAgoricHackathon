import React from 'react'
import { Flexdiv, Text } from '../shared/styled'
import Iframe from 'react-iframe'
import dappConstants from '../../constants'

import Creator from '../creator'
import Convertor from '../convertor'
import Decomposer from '../decomposer'

const Main = props => {
    const {
    CREATOR_WALLET,
    CONVERTOR_WALLET,
    DECOMPOSER_WALLET
  } = dappConstants

  let wallet
  let render

  if(props.active ==='convertor'){
    render = <Convertor/>
    wallet = CONVERTOR_WALLET
  }else if(props.active ==='decomposer'){
    render = <Decomposer/>
    wallet = DECOMPOSER_WALLET
  } else {
    render = <Creator/>
    wallet = CREATOR_WALLET
  }

  return (
    <Flexdiv
      flex='column'
      w='80%'
      h='100%'
      marginl='10%'
      background='#3E3E3E'
    >
      <Flexdiv
        flex='row'
        w='100%'
        h='30%'
      >
        {render}
      </Flexdiv>

      <Flexdiv
        flex='column'
        w='100%'
        h='70%'
      >
        <Flexdiv
          flex='row'
          w='100%'
          h='5%'
        >
          <Text
            c='#FFF'
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
