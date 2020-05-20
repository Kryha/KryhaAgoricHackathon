import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'
import { mintAssets } from '../../services/actions'

import { useApplicationContext } from '../../store/storeContext'

const Creator = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [selectedPurse, setSelectedPurse] = useState(0)

  useEffect(() => {
    // TODO: do something with the purses
  }, [state.purses])

  const mintNewAssets = () => {
    if (amount < 1) return alert('Specify a positive amount')
    const { brandRegKey, pursePetname } = state.purses[selectedPurse]
    mintAssets(brandRegKey, pursePetname, amount, dispatch)
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
        h='50%'
      >
        <Flexdiv
          flex='row'
          w='100%'
          h='30%'
        >
          <Text c='#000000' size='20px'>Create Tokens for Mined Material</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w='100%'
          h='70%'
          alignItems='center'
          justify='center'
        >
          <Flexdiv
            flex='row'
            w='25%'
            h='50%'
            alignItems='center'
          >
            <Select
              w='75%'
              value={selectedPurse}
              border='none'
              size='14px'
              background='#FFF'
              c='#000000'
              onChange={(e) => setSelectedPurse(e.target.value)}
            >
              {state.purses.map((purse, index) => {
                return (
                  <option key={index} value={index}>{purse.issuerPetname}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w='35%'
            h='50%'
            alignItems='center'
          >
            <Text c='#000000' margin='0'>{state.purses[selectedPurse].issuerPetname}</Text>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w='30%'
            h='50%'
            alignItems='center'
          >
            <Flexdiv
              flex='row'
              w='35%'
              h='50%'
            >
              <Input
                placeholder='Amount'
                type='number'
                w='100%'
                border='none'
                size='14px'
                background='#FFF'
                c='#000000'
                value={amount === 0 ? '' : amount}
                onChange={(event) => {
                  setAmount(event.target.value)
                }
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w='65%'
              marginl='10%'
              justify='center'
              h='100%'
            >
              <Button
                c='#AB2328'
                background='#FFF'
                borderc='#AB2328'
                hoverBackground='#AB2328'
                hoverColor='#FFF'
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
