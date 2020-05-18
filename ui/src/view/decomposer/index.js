import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'

import { useApplicationContext } from '../../store/storeContext'
import { retrieveAssets, createPurchaseOrderDec, decompose, retrieveDecompositions, explain } from '../../services/actions'

const Decomposer = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [amountToBuy, setAmountToBuy] = useState(0)
  const [selectedPurse, setSelectedPurse] = useState(8)
  const [selectedDecomposition, setSelectedDecomposition] = useState(0)

  useEffect(() => {
    if (state.decompositions.length === 0) {
      retrieveDecompositions(dispatch)
    }
  }, [state.decompositions])

  useEffect(() => {

  }, [state.purses])

  const createNewPurchaseOrder = () => {
    if (amountToBuy < 1) return alert('Specify a positive amount')
    if (state.purses[selectedPurse].extent < amountToBuy) {
      alert("The amount requested first must be minted from the Converter.")
      return
    }
    explain(dispatch)
    const { brandRegKey, pursePetname } = state.purses[selectedPurse]
    const invoicePurse = 'Decomposer invoice purse'
    createPurchaseOrderDec(brandRegKey, pursePetname, amountToBuy, invoicePurse, dispatch)
  }

  const createNewDecomposition = () => {
    if (amount > 0) {
      let decomp = state.decompositions[selectedDecomposition]
      decompose(decomp.input, decomp.amount, dispatch)
    }
  }

  if (state.purses.length === 0 || state.decompositions.length === 0) {
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
          <Text c='#000000' size='20px'>Current Owned Assets</Text>
        </Flexdiv>

        <Flexdiv
          flex='row'
          w='80%'
          h='80%'
          alignItems='center'
          justify='center'
        >
          {state.assets.map((asset, index) => {
            return (
              <Flexdiv
                flex='row'
                w={(100 / state.assets.length) + '%'}
                key={index}
                justify='center'
              >
                <Text key={index} c='#000000'>{asset.type}</Text>
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
          w='100%'
          h='20%'
        >
          <Text c='#000000' size='20px'>Create Purchase Order</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w='100%'
          h='80%'
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
                if (purse.issuerPetname === 'plastic bottle') {
                  return (
                    <option key={index} value={index}>{purse.issuerPetname}</option>
                  )
                }
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
                value={amountToBuy === 0 ? '' : amountToBuy}
                onChange={(event) => {
                  setAmountToBuy(event.target.value)
                }
                }
              />
            </Flexdiv>
            <Flexdiv
              flex='row'
              w='65%'
              marginl='10%'
              h='100%'
              justify='center'
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
          w='100%'
          h='20%'
        >
          <Text c='#000000' size='20px'>Decompose</Text>
        </Flexdiv>
        <Flexdiv
          flex='row'
          w='100%'
          h='80%'
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
              value={selectedDecomposition}
              border='none'
              size='14px'
              background='#FFF'
              c='#000000'
              onChange={(e) => setSelectedDecomposition(e.target.value)}
            >
              {state.decompositions.map((decomposition, index) => {
                return (
                  <option key={index} value={index}>{decomposition.input}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w='35%'
          >
            <Text c='#000000' margin='0'>
              {state.decompositions[selectedDecomposition].output.map((asset) => {
                let tmp = asset.amount
                if (amount > 0) {
                  tmp *= amount
                }
                return `${asset.type} (${tmp})`
              }).join(', ')}
            </Text>
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
              h='50'
              alignItems='center'
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
              h='100%'
              justify='center'
            >
              <Button
                c='#AB2328'
                background='#FFF'
                borderc='#AB2328'
                hoverBackground='#AB2328'
                hoverColor='#FFF'
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
    </Flexdiv >
  )
}

export default Decomposer
