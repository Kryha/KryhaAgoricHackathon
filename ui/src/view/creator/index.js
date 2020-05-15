import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'
import { mintAssets } from '../../services/actions'

import { useApplicationContext } from '../../store/storeContext'

const Creator = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [selectedPurse, setSelectedPurse] = useState(0)

  useEffect(() =>{
    // TODO: do something with the purses
  },[state.purses])

  const mintNewAssets = () => {
    if(amount < 1) return alert('Specify a positive amount')
    const { brandRegKey, pursePetname } = state.purses[selectedPurse]
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
        h='30%'
      >
        <Flexdiv
          flex='row'
          w='100%'
        >
          <Text c='#ED7174' >Current Asset Types</Text>
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
          h = '20%'
        >
          <Text c='#ED7174'>Create Tokens for Mined Material</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w = '100%'
          h='80%'
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
              value={selectedPurse}
              border='none'
              size='14px'
              background='#3E3E3E'
              c='#fff'
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
            h='50%'
            alignItems='center'
          >
            <Text c='#FFF' margin='0'>{state.purses[selectedPurse].issuerPetname}</Text>
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
              w = '47.5%'
              marginl='10%'
              h='100%'
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
