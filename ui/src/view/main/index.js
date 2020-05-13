import React, { useState, useEffect, useContext } from 'react'
import { Flexdiv } from '../shared/styled'
import Creator from '../creator'

import { Store } from '../../store'

const Main = props => {
  const { state, dispatch } = useContext(Store)

  let render
  if(props.active ==='creator'){
    render = <Creator/>
  }

  return (
    <Flexdiv
      flex='row'
      w='80%'
      h='100%'
      marginl='10%'
      background='#3E3E3E'
    >
      {render}
    </Flexdiv>
  )
}

export default Main
