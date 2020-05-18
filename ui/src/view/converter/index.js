import React, { useState, useEffect } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'

import { useApplicationContext } from '../../store/storeContext'
import { retrieveAssets, retrieveConversions, createPurchaseOrder, convert, explain } from '../../services/actions'

const Converter = props => {
  const { state, dispatch } = useApplicationContext()
  const [amount, setAmount] = useState(0)
  const [amountToBuy, setAmountToBuy] = useState(0)
  const [selectedPurse, setSelectedPurse] = useState(2)
  const [selectedConversion, setSelectedConversion] = useState(0)

  useEffect(() => {
    if (state.conversions.length === 0) {
      retrieveConversions(dispatch)
    }
  }, [state.conversions])

  const createNewPurchaseOrder = () => {
    if (amountToBuy < 1) return alert('Specify a positive amount')
    if (state.purses[selectedPurse].extent < amountToBuy) {
      alert("The amount requested first must be minted from the Converter.")
      return
    }
    explain(dispatch)
    const { brandRegKey, pursePetname } = state.purses[selectedPurse]
    const invoicePurse = 'Converter invoice purse'
    createPurchaseOrder(brandRegKey, pursePetname, amountToBuy, invoicePurse, dispatch)
  }

  const createNewConversion = () => {
    if (amount < 1) return alert('Specify a positive amount')
    let conv = state.conversions[selectedConversion]

    const purse = state.purses.find(purse => purse.pursePetname === 'Converter invoice purse')
    if (!purse) return alert('The converter invoice purse is not present, please redeploy the dapp')

    // TODO: Make dynamic filter for the correct input types
    const invoiceAmount = purse.extent
    .filter(e => e.type.startsWith('typea'))
    .map(e => Number(e.amount))
    .reduce((a, b) => a + b, 0)

    let isValid = true;
    conv.input.forEach(i => {
      const requestedAmount = amount * i.amount
      if (invoiceAmount < requestedAmount) {
        isValid = false;
        return
      }
    })

    if (!isValid) return alert('The Converter first must create a purchase order for the amount requested.')

    convert(conv.input, conv.output, amount, dispatch)
  }

  if (state.purses.length === 0 || state.conversions.length === 0) {
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
                if (purse.issuerPetname === 'typeA' || purse.issuerPetname === 'typeB' || purse.issuerPetname === 'typeC') {
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
          <Text c='#000000' size='20px'>Create Conversion</Text>
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
              value={selectedConversion}
              border='none'
              size='14px'
              background='#FFF'
              c='#000000'
              onChange={(e) => setSelectedConversion(e.target.value)}
            >
              {state.conversions.map((conversions, index) => {
                return (
                  <option key={index} value={index}>{conversions.output.map(o => o.type).join(", ")}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w='35%'
          >
            <Text c='#000000' margin='0'>
              {state.conversions[selectedConversion].input.map((asset) => {
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
                w='80%'
                h='100%'
                onClick={createNewConversion}
              >
                Convert
              </Button>
            </Flexdiv>
          </Flexdiv>
        </Flexdiv>
      </Flexdiv>
    </Flexdiv>
  )
}

export default Converter