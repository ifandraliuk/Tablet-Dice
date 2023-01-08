import React, { Fragment, useState } from 'react'
import "../Styles/Talents.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPenToSquare, faTrash, faFloppyDisk, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {useDispatch, useSelector} from 'react-redux'
import { updateTalent, removeTalent } from '../features/player/playerSlice';

function TalentsList({props}) {
  console.log("im active")
  const {player} = useSelector((state)=>state.player)
  const dispatch = useDispatch()
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  const [edit, toEdit] = useState(false)
  const [update, toUpdate] = useState([])
  const handleEdit = () => {
    toEdit(edit=>!edit)
  }

  const handleChange = (e) => {
    console.log(e.target.value, e.target.name)
    const name = e.target.name
    console.log(isNaN(e.target.value))
    const value = isNaN(parseInt(e.target.value))? 0 : e.target.value
    console.log(name, typeof(value))
    let el = [e.target.name, parseInt(value)]
    let flag = false
    if(update.length > 0 && el[1] >= 0){
        toUpdate(update.map((val)=>{
          if(val[0] === el[0]){
            flag = true
          }
          return flag ? el : val
        }))
      if(!flag){
        toUpdate([...update, el])
      }
    } else {
      toUpdate([...update, el])
    }

  }
  const handleRemove = e => {
    console.log(e.currentTarget.name)
    dispatch(removeTalent(e.currentTarget.name))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    update.forEach((el, i)=>{
      if(el[1]>0) //sorting out null values
        dispatch(updateTalent({"id": el[0], "point": el[1]}))
    })
    toEdit(edit=>!edit)
    toUpdate([])
  }


  return (
    <Fragment>
      {player?.talents?.length>0 ? 
    (<>
            <div><h3>Erlernte Talente</h3></div>
            <div className="button-group">
              <button className="btn-edit"  onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare}/></button>
              <button className="btn-save" onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk}/></button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kategorie</th>
                  <th>Würfel</th>
                  <th>Werte</th>
                  <th>X</th>
                </tr>
              </thead>
              <tbody>
              {player?.talents?.map((el)=>(
            <tr key={el._id}>
              <td >{el.talent.name}</td>
              <td className={el.talent.category}>{el.talent.category}</td>
              <td>{el.talent.dice}</td>
              {edit ? (<td>
                {`${el.points} `} <FontAwesomeIcon icon={faArrowRight} />
                <input name={el._id} type="number" onChange={handleChange} defaultValue={el.points}/>
                </td>) :
                (<td>{el.points}</td>)}
              <td><button className="btn-remove" name={el._id} style={{paddingBottom:"1px", paddingTop:"1px"}} onClick={handleRemove}><FontAwesomeIcon icon={faTrash} /></button></td>
            </tr>
          ))}</tbody>
          </table>
         
    </>) : 
    (<>
    <p>Keine Talente gefunden</p>
    </>)
    }

    </Fragment>
  )
}

export default TalentsList