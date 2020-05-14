import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'

import { useApplicationContext } from '../../store/storeContext'
import {retrieveAssets, createPurchaseOrder, decompose, retrieveDecompositions} from '../../services/actions/actions'

const Decomposer = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [amountToBuy, setAmountToBuy] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState(0)
  const [selectedDecomposition, setSelectedDecomposition] = useState(0)

  useEffect(() =>{
    if(state.decompositions.length === 0){
      retrieveDecompositions(dispatch)
    }
  },[state.decompositions])

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

  const createNewDecomposition = () => {
    if(amount > 0){
      let decomp = state.decompositions[selectedDecomposition]
      decompose(decomp.input, decomp.amount, dispatch)
    }
  }

  if (state.assets.length === 0 || state.decompositions.length === 0) {
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
  console.log(state.decompositions)
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
          <Text c='#A161A1' >Current Owned Assets</Text>
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
          <Text c='#A161A1'>Create Purchase Order</Text>
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
        >
          <Text c='#A161A1'>Decompose</Text>
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
              value={selectedDecomposition}
              onChange={(e) => setSelectedDecomposition(e.target.value)}
            >
              {state.decompositions.map((decomposition, index)=>{
                return(
                  <option key={index} value={index}>{decomposition.input}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '45%'
          >
            <Text c='#FFF' margin='0'>
              {state.decompositions[selectedDecomposition].output.map((asset)=>{
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
                c='#A161A1'
                background='#3E3E3E'
                borderc='#A161A1'
                hoverBackground='#A161A1'
                hoverColor='#3E3E3E'
                radius='3px'
                fontSize='16px'
                w='80%'
                h='100%'
                onClick={createNewDecomposition}
              >
                Decompose
              </Button>
            </Flexdiv>
          </Flexdiv>
        </Flexdiv>
      </Flexdiv>
    </Flexdiv>
  )
}

export default Decomposer
