import React, {useState} from 'react'

import ApplicationContextProvider from './store/storeContext'
import { Flexdiv, Page, Text } from './view/shared/styled'
// Components
import Main from './view/main'

function App () {
  const [active, setActive] = useState('creator')

  return (
    <ApplicationContextProvider>
      <Page>
        <Flexdiv
          flex='row'
          h='100%'
        >
          <Flexdiv
            flex='column'
            w='10%'
            background='#9E00FF'
            h = '100%'
          >
            <Flexdiv
              flex='row'
              h = '10%'
              marginb='25%'
              alignItems='center'
              justify='center'
            >
              Logo
            </Flexdiv>
            <Flexdiv
              flex='row'
              h = '10%'
              alignItems='center'
              hoverBackground='#B133FF'
              marginb='25%'
              onClick={() => setActive('creator')}
            >
              <Text
                marginl='15%'
              >Creator</Text>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h = '10%'
              alignItems='center'
              hoverBackground='#B133FF'
              marginb='25%'
              onClick={() => setActive('converter')}
            >
              <Text
                marginl='15%'
              >Connverter</Text>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h = '10%'
              alignItems='center'
              hoverBackground='#B133FF'
              marginb='25%'
              onClick={() => setActive('decomposer')}
            >
              <Text
                marginl='15%'
              >Decomposer</Text>
            </Flexdiv>
          </Flexdiv>
          
          <Flexdiv w='90%' h='97%' marginr='10vw' margint='3%' flex='column'>
            <Flexdiv
              flex='row'
              h='5%'
            >
              <Text
                c='#9E00FF'
                margint='0'
                marginl='10%'
              >{active+ ' overview'}</Text>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h='100%'
            >
              <Main active={active} />
            </Flexdiv>
          </Flexdiv>
        </Flexdiv>
      </Page>
    </ApplicationContextProvider>
  )
}

export default App
