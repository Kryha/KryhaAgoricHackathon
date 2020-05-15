import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'

import { useApplicationContext } from '../../store/storeContext'
import {retrieveAssets, createPurchaseOrder, decompose, retrieveDecompositions} from '../../services/actions'

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
        h='25%'
      >
        <Flexdiv
          flex='row'
          w='100%'
          h='20%'
        >
          <Text c='#ED7174' >Current Owned Assets</Text>
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
          <Text c='#ED7174'>Create Purchase Order</Text>
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
              border='none'
              size='14px'
              background='#3E3E3E'
              c='#fff'
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
                c='#ED7174'
                background='#3E3E3E'
                borderc='#ED7174'
                hoverBackground='#ED7174'
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
          <Text c='#ED7174'>Decompose</Text>
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
              value={selectedDecomposition}
              border='none'
              size='14px'
              background='#3E3E3E'
              c='#fff'
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
            w = '35%'
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
                c='#ED7174'
                background='#3E3E3E'
                borderc='#ED7174'
                hoverBackground='#ED7174'
                hoverColor='#3E3E3E'
                radius='3px'
                fontSize='16px'
                w='100%'
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
