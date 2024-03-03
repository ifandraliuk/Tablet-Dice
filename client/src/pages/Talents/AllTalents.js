import React  from 'react'
import {useSelector} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MotionButton from '../../components/MotionButton';


function AllTalents(props) {
  const {categorizedTalents} = props
    const {fractionTheme, player} = useSelector((state)=>state.player)
    const {allTalents, playerTalents} = useSelector((state)=>state.talents)

  
  return (
        <table className="custom-table h-100">
    <thead>
      <tr>
        <th className={`${categorizedTalents} category`} ><FontAwesomeIcon icon={props.icons[categorizedTalents]}/>{` ${categorizedTalents}`}</th>
        <th>Würfel</th>
        <th>Werte</th>
        <th>+</th>
      </tr>
    </thead>
    <tbody>
      {allTalents.map((talent,ind)=>{

        const talentExists = playerTalents.find(el=>el.talent.name === talent.name)
    
        //const talentExists = playerTalents?.find(el=>el.name===talent[ind].name)

        return talent.category === categorizedTalents && (
      <tr key={talent._id}>
        <td>{talent.name}</td>
        <td>{talent.dice}</td>
        {talentExists ? (
        <>
        <td>
          {talentExists["points"]}
          </td>
          <td>
            
            <button type="button" disabled><FontAwesomeIcon icon={faPlus}/></button></td>
          </>): (
            <>
          <td>
            <input name={talent.name} type="number"  defaultValue={0} onChange={props.handleChange}/>
          </td>
          <td>
          <MotionButton name={talent.name} icon={faPlus} onClick={props.handleClick}/>
           </td>
          </>)}
          </tr>
      )})}
    </tbody>
  </table>
  )
}

export default React.memo(AllTalents)