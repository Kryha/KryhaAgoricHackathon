import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'

import { useApplicationContext } from '../../store/storeContext'
import {retrieveAssets, retrieveConversions, createPurchaseOrder, convert} from '../../services/actions/actions'

const Converter = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [amountToBuy, setAmountToBuy] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState(0)
  const [selectedConversion, setSelectedConversion] = useState(0)

  useEffect(() =>{
    if(state.conversions.length === 0){
      retrieveConversions(dispatch)
    }
  },[state.conversions])

  useEffect(() =>{
    if(state.assets.length === 0){
      retrieveAssets(dispatch)
    }
  },[state.assets])

  const createNewPurchaseOrder = () => {
    if(amountToBuy > 0){
      let asset = state.assets[selectedAsset]
      createPurchaseOrder(asset.type, amount, asset.seller,dispatch)
    }
  }

  const createNewConversion = () => {
    if(amount > 0){
      let conv = state.conversions[selectedConversion]
      convert(conv.input, conv.output, conv.amount,dispatch)
    }
  }

  if (state.conversions.length === 0) {
    return (
      <Flexdiv
        flex='column'
        w='100%'
        h='100%'
      >
        ...Loading agoric data
      </Flexdiv>
    )
  }

  return (
    <Flexdiv
      flex='column'
      w='100%'
      h='100%'
    >
      <Flexdiv
        flex='column'
        w='95%'
        marginl='5%'
        h='25%'
      >
        <Flexdiv
          flex='row'
          w='100%'
          h='20%'
        >
          <Text c='#A161A1' >Current Owned Assets</Text>
        </Flexdiv>
        
        <Flexdiv
          flex='row'
          w='80%'
          h='80%'
          alignItems='center'
          justify='center'
        >
          {state.assets.map((asset, index)=>{
            return(
              <Flexdiv
                flex='row'
                w={(100/state.assets.length)+'%'}
                key={index}
              >
                <Text key={index} c='#FFF'>{asset.type}</Text>
              </Flexdiv>
            )
          })}
        </Flexdiv>
      </Flexdiv>

      <Flexdiv
        flex='column'
        w='95%'
        marginl='5%'
        h='30%'
      >
        <Flexdiv
          flex='row'
          w = '100%'
          h = '20%'
        >
          <Text c='#A161A1'>Create Purchase Order</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
          h='80%'
          alignItems='center'
          justify='center'
        >
          <Flexdiv
            flex='row'
            w = '25%'
            h='50%'
            alignItems='center'
          >
            <Select
              w='75%'
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {state.assets.map((asset, index)=>{
                return(
                  <option key={index} value={index}>{asset.type}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '35%'
            h='50%'
            alignItems='center'
          >
            <Text c='#FFF' margin='0'>{state.assets[selectedAsset].seller}</Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '30%'
            h='50%'
            alignItems='center'
          >
            <Flexdiv
              flex='row'
              w = '35%'
              h='50%'
            >
              <Input
                placeholder='Amount'
                type='number'
                w='100%'
                border='none'
                size='14px'
                background='#3E3E3E'
                c='#fff'
                value={amountToBuy === 0 ? '': amountToBuy}
                onChange={(event)=> {
                  setAmountToBuy(event.target.value)}
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w = '65%'
              marginl='10%'
              h='100%'
              justify='center'
            >
              <Button
                c='#A161A1'
                background='#3E3E3E'
                borderc='#A161A1'
                hoverBackground='#A161A1'
                hoverColor='#3E3E3E'
                radius='3px'
                fontSize='16px'
                w='80%'
                h='100%'
                onClick={createNewPurchaseOrder}
              >
                Purchase
              </Button>
            </Flexdiv>
          </Flexdiv>
        </Flexdiv>
      </Flexdiv>

      <Flexdiv
        flex='column'
        w='95%'
        marginl='5%'
        margint='5%'
        h='30%'
      >
        <Flexdiv
          flex='row'
          w = '100%'
          h='20%'
        >
          <Text c='#A161A1'>Create Conversion</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
          h='80%'
          alignItems='center'
          justify='center'
        >
          <Flexdiv
            flex='row'
            w = '25%'
            h='50%'
            alignItems='center'
          >
            <Select
              w='75%'
              value={selectedConversion}
              onChange={(e) => setSelectedConversion(e.target.value)}
            >
              {state.conversions.map((conversions, index)=>{
                return(
                  <option key={index} value={index}>{conversions.output}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '35%'
          >
            <Text c='#FFF' margin='0'>
              {state.conversions[selectedConversion].input.map((asset)=>{
                let tmp = asset.amount
                if(amount > 0) {
                  tmp *= amount
                }
                return `${asset.type} (${tmp})`
              }).join(', ')}
            </Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '30%'
            h='50%'
            alignItems='center'
          >
            <Flexdiv
              flex='row'
              w = '35%'
              h='50'
              alignItems='center'
            >
              <Input
                placeholder='Amount'
                type='number'
                w='100%'
                border='none'
                size='14px'
                background='#3E3E3E'
                c='#fff'
                value={amount === 0 ? '': amount}
                onChange={(event)=> {
                  setAmount(event.target.value)}
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w = '65%'
              marginl='10%'
              h='100%'
              justify='center'
            >
              <Button
                c='#A161A1'
                background='#3E3E3E'
                borderc='#A161A1'
                hoverBackground='#A161A1'
                hoverColor='#3E3E3E'
                radius='3px'
                fontSize='16px'
                w='80%'
                h='100%'
                onClick={createNewConversion}
              >
                Create
              </Button>
            </Flexdiv>
          </Flexdiv>
        </Flexdiv>
      </Flexdiv>
    </Flexdiv>
  )
}

export default Converter
