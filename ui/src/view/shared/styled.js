import styled from 'styled-components'

const Flexdiv = styled.div`
    display: ${props => props.display || 'flex'};
    flex-direction: ${props => props.flex || 'row'};
    flex-wrap: ${props => props.wrap};
    flex-grow: ${props => props.grow};
    justify-content: ${props => props.justify};
    justify-items: ${props => props.justifyItems};
    align-content: ${props => props.align};
    align-items: ${props => props.alignItems};
    width: ${props => props.w};
    min-width: ${props => props.minw};
    max-width: ${props => props.maxw};
    height: ${props => props.h};
    min-height: ${props => props.minh};
    max-height: ${props => props.maxh};
    padding: ${props => props.padding};
    margin: ${props => props.margin};
    margin-left: ${props => props.marginl};
    margin-right: ${props => props.marginr};
    margin-top: ${props => props.margint};
    margin-bottom: ${props => props.marginb};
    background: ${props => props.background};
    color: ${props => props.c};
    border-color: ${props => props.borderc};
    border: ${props => props.border};
    border: ${props => props.border};
    border-bottom: ${props => props.borderb};
    border-top: ${props => props.bordertop};
    border-right: ${props => props.borderr};
    border-radius: ${props => props.radius};
    position:  ${props => props.position};
    top: ${props => props.top};
    bottom: ${props => props.bottom};
    left: ${props => props.left};
    right: ${props => props.right};
    overflow-y: ${props => props.overflowy};
    overflow: ${props => props.overflow};
    cursor: ${props => props.cursor};
    box-shadow: ${props => props.shadow};
    box-sizing: ${props => props.sizing || 'border-box'};
    transform: ${props => props.transform};
    :hover{
      background: ${props => props.hoverBackground};
      color: ${props => props.hoverColor};
      cursor:  ${props => props.cursor};
    }
    transition: ${props => props.transition};
    opacity: ${props => props.opacity};
`

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${props => props.fontSize};
    font-weight: ${props => props.fontWeight};
    background-color: ${props => props.background};
    color: ${props => props.c};
    border-color: ${props => props.borderc};
    border-radius: ${props => props.radius};
    width: ${props => props.w};
    height: ${props => props.h};
    padding: ${props => props.padding};
    margin: ${props => props.margin};
    cursor: ${props => props.cursor};
    :hover{
      cursor:  ${props => props.cursor || 'pointer'};
      background: ${props => props.hoverBackground};
      color: ${props => props.hoverColor};  
    }
    :focus{
      outline:0;
    }
`

const Text = styled.p`
    font-size: ${props => props.size};
    font-style: ${props => props.fontStyle};
    padding: ${props => props.padding};
    padding-left: ${props => props.paddingl};
    margin: ${props => props.margin};
    margin-left: ${props => props.marginl};
    margin-top: ${props => props.margint};
    margin-right: ${props => props.marginr};
    margin-bottom: ${props => props.marginb};
    background-color: ${props => props.background};
    color: ${props => props.c};
    font-weight: ${props => props.fontWeight};
    line-height: ${props => props.lineHeight};
    left: ${props => props.left};
    right: ${props => props.right};
    width: ${props => props.w};
    height: ${props => props.h};
    border: ${props => props.border};
    border-radius: ${props => props.radius};
    text-align: ${props => props.align};
    text-justify: ${props => props.justify};
    text-overflow: ${props => props.textO}
    word-break: ${props => props.break};
    overflow: ${props => props.overflow};
    cursor: ${props => props.cursor};
    transform: ${props => props.transform};
    z-index: ${props => props.zidx};
    :hover{
      background: ${props => props.hoverBackground};
      color: ${props => props.hoverColor};  
    }
    position:${props => props.position}
`

const Input = styled.input`
  font-size: ${props => props.size};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  background-color: ${props => props.background};
  color: ${props => props.c};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.lineHeight};
  width: ${props => props.w};
  height: ${props => props.h};
  border: ${props => props.border};
  border-radius: ${props => props.radius};
  text-align: ${props => props.align};
  :focus {
    outline: none;
  }
`
const InputArea = styled.textarea`
  font-size: ${props => props.size};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  background-color: ${props => props.background};
  color: ${props => props.c};
  cols: ${props => props.cols};
  rows: ${props => props.rows};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.lineHeight};
  width: ${props => props.w};
  height: ${props => props.h};
  border: ${props => props.border};
  border-radius: ${props => props.radius};
  text-align: ${props => props.align};
`

const Select = styled.select`
  font-size: ${props => props.size};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  background-color: ${props => props.background};
  color: ${props => props.c};
  cols: ${props => props.cols};
  rows: ${props => props.rows};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.lineHeight};
  width: ${props => props.w};
  height: ${props => props.h};
  border: ${props => props.border};
  border-radius: ${props => props.radius};
  text-align: ${props => props.align};
`

const Image = styled.img`
  src: ${props => props.src};
  width: ${props => props.w};
  height: ${props => props.h};
  max-width: ${props => props.maxw};
  max-height: ${props => props.maxh};
  padding: ${props => props.padding};
  padding-left: ${props => props.paddingl};
  padding-right: ${props => props.paddingr};
  padding-top: ${props => props.paddingt};
  padding-bottom: ${props => props.paddingb};
  margin: ${props => props.margin};
  margin-left: ${props => props.marginl};
  margin-right: ${props => props.marginr};
  margin-top: ${props => props.margint};
  margin-bottom: ${props => props.marginb};
  color: ${props => props.c};
  alt: ${props => props.alt};
  position: ${props => props.d};
  z-index: ${props => props.zidx};
  top: ${props => props.top};
  bottom: ${props => props.bottom};
  left: ${props => props.left};
  right: ${props => props.right};
  opacity: ${props => props.opacity};
`

export const Page = styled.div`
  width:100vw;
  height:100vh;
  background-color: #171717
  position: fixed;
  background-size: cover;
`

export const FlexTable = styled(Flexdiv)`
  background: #3E3E3E;
`

export const FlexTableRow = styled(Flexdiv)`
  :nth-child(odd) {
    background: #383838;
  }
  :nth-child(n).active {
    background: lightgray;
  }
  :hover{
    background: lightgray;
    cursor: pointer;
  }
`

export const FlexTableHeader = styled(FlexTableRow)`
background: #3E3E3E;
`

export const TableData = styled(Flexdiv)`
  :not(: last - child) {
    margin - right: 1em;
  }
  background: #3E3E3E;
`

export { Flexdiv, Button, Text, Input, InputArea, Image, Select }
