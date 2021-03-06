import React, { useState } from 'react'

import ApplicationContextProvider from './store/storeContext'
import { Flexdiv, Page, Text, Image } from './view/shared/styled'
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
            background='#AB2328'
            h='100%'
          >
            <Flexdiv
              flex='row'
              h='10%'
              w='100%'
              marginb='25%'
              alignItems='center'
              justify='center'
              cursor='pointer'
            >
              <a
                style={{ height: '100%', width: '100%', display: 'flex', 'flexDirection': 'row', 'justifyContent': 'center' }}
                href='https://www.kryha.io'>
                <Image
                  src={window.location.origin + '/KryhaW.png'}
                  padding='10% 0 0 0'
                  h='100%'
                  w='100%'
                />
              </a>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h='10%'
              alignItems='center'
              hoverBackground='#C84145'
              background={active === 'creator' ? '#C84145' : 'none'}
              marginb='25%'
              cursor='pointer'
              onClick={() => setActive('creator')}
            >
              <Text
                padding='0 5% 0 15%'
                break='break-word'
                w='100%'
                textO='break-word'
                c='#FFF'
              >Creator</Text>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h='10%'
              alignItems='center'
              hoverBackground='#C84145'
              background={active === 'converter' ? '#C84145' : 'none'}
              marginb='25%'
              cursor='pointer'
              onClick={() => setActive('converter')}
            >
              <Text
                padding='0 5% 0 15%'
                break='break-word'
                w='100%'
                textO='break-word'
                c='#FFF'
              >Converter</Text>
            </Flexdiv>
            <Flexdiv
              flex='row'
              h='10%'
              alignItems='center'
              hoverBackground='#C84145'
              background={active === 'decomposer' ? '#C84145' : 'none'}
              marginb='25%'
              cursor='pointer'
              onClick={() => setActive('decomposer')}
            >
              <Text
                padding='0 5% 0 15%'
                break='break-word'
                w='100%'
                textO='break-word'
                c='#FFF'
              >Decomposer</Text>
            </Flexdiv>
          </Flexdiv>

          <Flexdiv w='90%' h='97%' marginr='10vw' margint='3%' flex='column'>
            <Flexdiv
              flex='row'
              h='5%'
            >
              <Text
                c='#AB2328'
                margint='0'
                marginl='10%'
                size='25px'
                transform='capitalize'
              >{active + ' overview'}</Text>
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
