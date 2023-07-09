import { faDiceD20, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { diceAbbr } from '../../data/ConstVariables'
import { useEffect, useState } from 'react'

function DiceInfo(props) {
    const {talent, attr, bonus} = props
    const talentAttributes = talent?.talent.dice.split("/")
    const [dicePoints, setDicePoints] = useState("")


    useEffect(()=>{ 
      let dPoints = []
      talentAttributes?.forEach(talent => {
        const name = diceAbbr[talent]
        const points = attr[name] 
        dPoints.push(points)
      })
      setDicePoints(dPoints.join("/"))

    }, [talentAttributes, attr])


  return (
    <div className="row">
        <div className='col-auto border-top border-end'>
          <div  className='col-auto'>
            <FontAwesomeIcon icon={faDiceD20}/> 
            {talent?.talent.dice}
          </div>
          <div className='col-6 ms-auto'>{dicePoints}</div>
        </div>
        <div className='col-auto '>{talent?.points}</div>  
        <div className='col-auto'><strong><FontAwesomeIcon icon={faPlus} /> {bonus? bonus:0}</strong></div>    
    </div>
  )
}

export default DiceInfo