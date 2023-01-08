import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {faPlus } from '@fortawesome/free-solid-svg-icons'
import React, {useState, useMemo, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {allAttributes} from '../components/ConstVariables';
import { updateAttribute } from '../features/player/playerSlice';
function AttributeList() {
    const {player} = useSelector((state)=>state.player)
    const {attributes} = player
    const [difference, setDifference] = useState(0)
    const dispatch = useDispatch()
    const keys = Object.keys(allAttributes)

    
    useEffect(()=>{
      let out = 0 
      keys.forEach((key)=> (
        out = out + attributes[key]
     ))
     const diff = player?.pointsLeft - out 
     setDifference(diff)
    }, [player?.pointsLeft, keys, attributes])

    
     const onClick = e => {
      dispatch(updateAttribute(e.currentTarget.id))
      
     }
    return(
        <div>
            {difference !== 0 ? <h4>{`Du hast freie Attributspunkte: ${difference}`}</h4> : <h3>Attribute</h3>}
            <div className="row border m-0">
                {keys.map((key)=>(
                   attributes[key]>0 && <div key={key} className="col me-0 w-auto">
                        <h6>{`${allAttributes[key]}:`}</h6><h5>{attributes[key]}</h5>
                {difference!==0 &&<button id={key} className="" onClick={onClick}><FontAwesomeIcon icon={faPlus}/></button>}
                    </div>     
      
              ))}
                
            </div>
        </div>
    )
}

export default AttributeList