import React, {useEffect} from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useSelector, useDispatch} from 'react-redux';
import {germanAttr} from '../../data/ConstVariables';
import { generateBar } from '../../features/player/playerSlice';


function Bar(props) {
  const { bars, attributes, attributesLoaded} = useSelector((state)=>state.player) 
  console.log(bars)
  const dispatch = useDispatch()
  const max = attributes ? attributes[props.category]*10 : 0
  const curr = bars ? bars[props.category] : 0
  const variant = props.category === "vitality" ? "danger" :
  props.category === "stamina" ? "warning" :
  props.category === "spirit" ? "info": "primary"
  useEffect(()=>{
    if(attributesLoaded){
      dispatch(generateBar())
    }
  },[attributesLoaded, dispatch])
  return (
    <ProgressBar 
    label={`${germanAttr[props.category]}: ${curr} von ${max}`}
    variant={variant} 
    now={curr/max*100} max={100}/>
  )
}

export default Bar