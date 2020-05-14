import React, { useState, useEffect, useContext } from 'react'
import { Flexdiv, Text, Button, Input, Select } from '../shared/styled'


import { Store } from '../../store'

const Creator = props => {
  const { state, dispatch } = useContext(Store)
  const [amount, setAmount] = useState(0)
  state.assets = [{type: 'test'}, {type: 'test2'}]



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
          <Text c='#FFF' >Current Asset Types</Text>
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
          <Text c='#FFF'>Current Assets</Text>
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
            >
              {state.assets.map((asset, index)=>{
                return(
                  <option key={index} value={asset.type}>{asset.type}</option>
                )
              })}
            </Select>
          </Flexdiv>
          <Flexdiv
            flex='row'
            w = '45%'
          >
            Asset info
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
              <Button>
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
