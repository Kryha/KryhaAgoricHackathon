import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'
import {retrieveAssets, mintAssets} from '../../services/actions/actions'

import { useApplicationContext } from '../../store/storeContext'

const Creator = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState(0)

  useEffect(() =>{
    if(state.assets.length === 0){
      retrieveAssets(dispatch)
    }
  },[state.assets])


  const mintNewAssets = () => {
    if(amount > 0){
      mintAssets(state.assets[selectedAsset].type, amount, dispatch)
    }
  }

  if (state.assets.length === 0) {
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
          <Text c='#A161A1' >Current Asset Types</Text>
        </Flexdiv>
        
        <Flexdiv
          flex='row'
          w='100%'
          alignItems='center'
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
          <Text c='#A161A1'>Current Assets</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
          h='100%'
          alignItems='center'
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
            w = '45%'
            h='50%'
            alignItems='center'
          >
            <Text c='#FFF' margin='0'>{state.assets[selectedAsset].description}</Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '25%'
            h='50%'
            alignItems='center'
          >
            <Flexdiv
              flex='row'
              w = '47.5%'
              h='50%'
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
              marginl='10%'
              h='100%'
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
                onClick={mintNewAssets}
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

export default Creator
