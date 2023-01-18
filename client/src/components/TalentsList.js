import React, { Fragment, useState, useCallback, useEffect } from 'react'
import "../Styles/Talents.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPenToSquare, faTrash, faFloppyDisk, faArrowRight, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons'
import {useDispatch, useSelector} from 'react-redux'
import { updateTalent, removeTalent, sortValueIncrease, sortedTalents} from '../features/player/playerSlice';


function TalentsList({props}) {
  const {player} = useSelector((state)=>state.player)
  const dispatch = useDispatch()
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  const [edit, toEdit] = useState(false)
  const [update, toUpdate] = useState([])
  const SortOrder = "ascn" | "descn"
  const [sortKey, setSortKey] = useState("")
  const [sortReverse, setSortReverse] = useState(true)
  const talentHeaders = [
    {name: "name", label:"Name"},
    {name: "category", label:"Kategorie"},
    {name: "dice", label:"Würfel"},
    {name: "points", label:"Werte"},
  ]
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

  const sort = (e) => {
   setSortKey(e.currentTarget.name)
   console.log(sortKey===e.currentTarget.name)
   if(sortKey === e.currentTarget.name){
      setSortReverse(sortReverse=>!sortReverse)
   }
   
   //sortedCallback()
   console.log(sortKey, sortReverse)
  }
  useEffect(()=>{
    console.log("useffect")
    dispatch(sortedTalents({sortKey: sortKey, reverse:sortReverse}))
  }, [dispatch, sortKey, sortReverse])
    
const sortedCallback = ()=>{
    console.log("callback")
    dispatch(sortedTalents({sortKey: sortKey, reverse:sortReverse}))
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
                  {talentHeaders.map((header)=>(
                    <th>{header.label}  <button className="sort-btn" name={header.name} onClick={sort}>{sortKey===header.name && sortReverse ? <FontAwesomeIcon icon={faSortDown}/> : <FontAwesomeIcon icon={faSortUp}/> }</button> </th>
                  ))}
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