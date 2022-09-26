import React, {useState} from 'react'
import styled from 'styled-components'

interface Props {
  checked: boolean
  onCheckStateChange?: (checked: boolean) => void
}

const Container = styled.div<Props>`
  position: relative;
  width: 38px;
  border-radius: 88px;
  display: inline-block;
  padding: 3px;
  vertical-align: middle;
  background: ${props => props.checked ? '#66cc07' : '#c7c7c7'};
  transition: all 0.3s;
  top: -2px;
  :hover {
    cursor: pointer;
  }
`

const Circle = styled.div<Props>`
  width: 18px;
  height: 18px;
  border-radius: 888px;
  background: #ffffff;
  position: relative;
  left: ${props => props.checked ? '20px' : '0'};
  transition: all 0.3s;
`

const Switch: React.FC<Props> = (state) => {

  const [checked, setChecked] = useState(state.checked)

  return (
    <Container checked={checked} onClick={() => {
      const newState = !checked
      setChecked(newState)
      state.onCheckStateChange?.(newState)
    }}>
      <Circle checked={checked}/>
    </Container>
  )
}

export default Switch
