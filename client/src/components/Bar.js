import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useSelector} from 'react-redux';
import {germanAttr} from './ConstVariables'


function Bar(props) {
  const {player, bars} = useSelector((state)=>state.player) 
  console.log(bars)
  const {attributes} = player
  const max = attributes ? attributes[props.category]*10 : 0
  const curr = bars ? bars[props.category] : 0
  const variant = props.category === "vitality" ? "danger" :
  props.category === "stamina" ? "warning" :
  props.category === "spirit" ? "info": "primary"

  return (
    <ProgressBar 
    label={`${germanAttr[props.category]}: ${curr} von ${max}`}
    variant={variant} 
    now={curr/max*100} max={100}/>
  )
}

export default Bar