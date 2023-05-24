import React  from 'react'
import {useSelector} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlus } from '@fortawesome/free-solid-svg-icons';


function AllTalents(props) {
    const {player} = useSelector((state)=>state.player)
    const {talent} = useSelector((state)=>state.talents)
    const origin = player?.general?.origin.split(" ")
    const originName = origin && origin[origin.length-1]

  
  return (
        <table className="table h-100">
    <thead>
      <tr>
        <th className={`${props.el} category`} ><FontAwesomeIcon icon={props.icons[props.el]}/>{` ${props.el}`}</th>
        <th>Würfel</th>
        <th>Werte</th>
        <th>+</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(talent).map((ind)=>{
        const talentExists = player?.talents?.find(el=>el.talent.name===talent[ind].name)

        return talent[ind].category === props.el && (
      <tr key={talent[ind]._id}>
        <td>{talent[ind].name}</td>
        <td>{talent[ind].dice}</td>
        {talentExists ? (<>
        <td>
          {talentExists["points"]}
          </td>
          <td><button type="button" disabled><FontAwesomeIcon icon={faPlus}/></button></td>
          </>): (
            <>
          <td>
            <input name={talent[ind].name} type="number"  defaultValue={0} onChange={props.handleChange}/>
          </td>
          <td><button className={originName} name={talent[ind].name} onClick={props.handleClick}><FontAwesomeIcon icon={faPlus}/></button></td>
          </>)}
          </tr>
      )})}
    </tbody>
  </table>
  )
}

export default React.memo(AllTalents)