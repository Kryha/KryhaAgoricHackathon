import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'
import {retrieveAssets, mintAssets} from '../../services/actions/actions'

import { useApplicationContext } from '../../store/storeContext'

const Creator = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [selectedPurse, setSelectedPurse] = useState(0)

  useEffect(() =>{
    // TODO: do something with the purses
  },[state.purses])

  const mintNewAssets = () => {
    if(amount < 1) return alert('Specify a postive amount')
    const { brandRegKey, pursePetname} = state.purses[selectedPurse]
    mintAssets(brandRegKey, pursePetname,  amount, dispatch)
  }

  if (state.purses.length === 0) {
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
        margint='5%'
        h='30%'
      >
        <Flexdiv
          flex='row'
          w = '100%'
        >
          <Text c='#FFF'>Create Tokens for mined materials</Text>
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
              value={selectedPurse}
              onChange={(e) => setSelectedPurse(e.target.value)}
            >
              {state.purses.map((purse, index)=>{
                return(
                  <option key={index} value={index}>{purse.issuerPetname}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '45%'
          >
            <Text c='#FFF' margin='0'>{state.purses[selectedPurse].issuerPetname}</Text>
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
