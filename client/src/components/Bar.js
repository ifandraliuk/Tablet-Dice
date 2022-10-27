import React, {useState, useEffect} from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';


function Bar({name, max, curr}) {
    const [percentage, setPercentage] = useState(100)
    const variant = name === "vitality" ? "danger" 
    : name === "stamina" ? "warning"
    : name === "spirit" ? "info"
    : "primary"
    const label = name === "vitality" ? "Trefferpunkte" 
    : name === "stamina" ? "Ausdauer"
    : name === "spirit" ? "Spirituele Kraft"
    : "Mana"
    useEffect(()=> {
          let val = curr/max*100
          if(val <= 100 && val>=0){
              setPercentage(val)
          }
      }, [curr])
  return (
    <ProgressBar 
    label={`${label}: ${curr} von ${max}`}
    variant={variant} 
    now={percentage}/>
  )
}

export default Bar