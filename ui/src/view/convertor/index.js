import React, { useState, useEffect, useContext } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'
import {retrieveAssets, retrieveConversions, createPurchaseOrder, convert} from '../../services/actions/actions'

import { Store } from '../../store'

const Convertor = props => {
  const { state, dispatch } = useContext(Store)
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
        h='30%'
      >
        <Flexdiv
          flex='row'
          w='100%'
        >
          <Text c='#FFF' >Current Owned Assets</Text>
        </Flexdiv>
        
        <Flexdiv
          flex='row'
          w='100%'
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
        margint='5%'
        h='30%'
      >
        <Flexdiv
          flex='row'
          w = '100%'
        >
          <Text c='#FFF'>Create Purchase Order</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
        >
          <Flexdiv
            flex='row'
            w = '25%'
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
            w = '45%'
          >
            <Text c='#FFF' margin='0'>{state.assets[selectedAsset].seller}</Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '25%'
          >
            <Flexdiv
              flex='row'
              w = '47.5%'
            >
              <Input
                placeholder='Amount'
                type='number'
                w='100%'
                value={amountToBuy === 0 ? '': amountToBuy}
                onChange={(event)=> {
                  setAmountToBuy(event.target.value)}
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w = '47.5%'
              marginl='5%'
            >
              <Button
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
        >
          <Text c='#FFF'>Create Conversion</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
        >
          <Flexdiv
            flex='row'
            w = '25%'
          >
            <Select
              w='75%'
              value={selectedConversion}
              onChange={(e) => setSelectedConversion(e.target.value)}
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
            w = '45%'
          >
            <Text c='#FFF' margin='0'>{state.conversions[selectedConversion].output}</Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '25%'
          >
            <Flexdiv
              flex='row'
              w = '47.5%'
            >
              <Input
                placeholder='Amount'
                type='number'
                w='100%'
                value={amount === 0 ? '': amount}
                onChange={(event)=> {
                  setAmount(event.target.value)}
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w = '47.5%'
              marginl='5%'
            >
              <Button
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

export default Convertor
