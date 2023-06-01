import React, { useEffect, useState } from 'react'
import "../../Styles/Diary.css"
import Note from './Note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShareNodes, faFloppyDisk, faMarker} from '@fortawesome/free-solid-svg-icons'
import { diaryCategories } from '../../data/ConstVariables';
import NavbarComp from '../../components/Navbar'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {reset, getUsers, postDiary, editDiary, getMyDiary, removeDiary} from '../../features/diary/diarySlice'
import Spinner from 'react-bootstrap/Spinner'

function Diary() {
  const {diary, userList} = useSelector((state)=>state.diaries)
  console.log("diary page")
  console.log(localStorage)
  const {player} = useSelector((state)=>state.player)
  const {user} = useSelector((state)=>state.auth)
  const [shareActive, setShare] = useState(false)
  const [share, shareWith] = useState([user._id]) 
  const [text, setText] = useState([])
  const [activeCategory, setCategory] = useState("Personen")
  const [saveData, setSave] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(()=>{
    console.log("getting userList...")
    dispatch(getUsers())
    dispatch(getMyDiary(user?._id))
    if(!user){
      navigate("/")
    }
    return () => {
      console.log("reset")
      dispatch(reset())
    } 
  }, [])

  const onClick= e => {
    console.log(e.target.value, e.target.name)
    const id = e.target.id
    if(share.includes(id)){
      shareWith(share.filter(el=>el!==id))
    } else {
      shareWith([...share, id])
    }
    console.log(share)
  }

  const onChange = e => {
    setText(e.target.value)
  }
  const shareOptions = () => {
    setShare(shareActive=>!shareActive)
    if(activeCategory?.length > 0){
      document.getElementById(activeCategory).focus()
    }
  }
  const onEdit = e => {
    setEdit(edit=>!edit)
    const diaryId = e.currentTarget.id
    console.log(diaryId)
    setEditId(diaryId.toString())
    let playerIds = []
    const toEdit = diary.find(d=>d._id===diaryId.toString())
    console.log(toEdit)
    if(!toEdit){
      return false
    }
    setText(toEdit.text)
    if(toEdit.category){
      setCategory(toEdit.category)
    } else {
      setCategory("")
    }
    toEdit.players?.map((player)=>(
      playerIds.push(player._id)
    ))
    shareWith(playerIds)
    /*    if(!toEdit){
      return false
    }
    
    if(toEdit.category){
      setCategory(toEdit.category)
    } else {
      setCategory("")
    }
    setText(toEdit.text)
    //setEditPlayers(toEdit.players)
    shareWith(toEdit.players) */
  }
  const onRemove = e => {
    console.log("remove pressed")
    console.log(e.currentTarget.id)
    dispatch(removeDiary(e.currentTarget.id))
  }

  const onSubmit = e => {
    console.log("submit")
    e.preventDefault()
    
    const players = share
    console.log(players)
    if(text.length>0 && saveData){
      const data = {
        text: text, 
        players: players,
        category: activeCategory    
      }
      if(edit){
        console.log("edit note")
        console.log(data)
        console.log(editId)
        dispatch(editDiary({id:editId, data:data}))
        setEditId("")
        setEdit(false)
      } else {
        console.log("posting a diary note")
        dispatch(postDiary(data))
    }
    document.getElementById("journal").reset();
    if(activeCategory?.length > 0){
      document.getElementById(activeCategory).focus()
    }
    setText("")
    shareWith([user._id])    
    setShare(false)
    setSave(false)
    }
  }
  return (
    <div className="dark-bg">
        <div className="container-fluid diary-page"  style={{color:"white"}}>
          <div className="row">
            <div className="col-xl-3  col-lg-3 col-md-12">
              {diaryCategories && diaryCategories.map((category)=>(
                <button id={category} name={category} onClick={e=>setCategory(e.target.name)} className={`categories ${category}`} key={category}>{category}</button>
              ))}
            </div>
            <div className="col-xl-8 col-lg-8  border col-md-12">
              <form id="journal" onSubmit={onSubmit}>
                <div className='w-auto h-auto  p-2 mb-2'>
                  <textarea id="textarea-note" type="text" cols="40" rows="5" onChange={onChange} value={text}></textarea>
                  <div className="row info-row ">
                    <div className="col-lg-auto col-md-1">
                      <button className='btn-edit' onClick={shareOptions}><FontAwesomeIcon icon={faShareNodes} /></button>
                    </div>
                    <div className="col-xl-auto col-lg-auto col-md-8">
                      {activeCategory?.length === 0  ? 
                      (<div>Kategorie nicht gewählt</div>): (<h5 className={`${activeCategory} `}>{activeCategory}</h5>)}
                    </div>
                    <div className="col-lg-auto m-0 p-0 col-md-2">
                      {activeCategory.length===0 ? 
                      (<button className='btn-save' disabled><FontAwesomeIcon icon={faFloppyDisk} /></button>)
                      : edit?<button className='btn-save' type="submit" onClick={()=>setSave(true)}><FontAwesomeIcon icon={faMarker} /></button>
                        : <button className='btn-save' type="submit" onClick={()=>setSave(true)}><FontAwesomeIcon icon={faFloppyDisk} /></button>
                      }
                    </div>
                  </div>
                  {shareActive &&(<div className="col-3 border mt-2">
                    {userList?.map((u)=>(
                          u.id!==user?._id &&<div className="p-2" key={u.id}>
                            <input  type="checkbox" name="users" id={u.id} onChange={onClick} checked={share?.includes(u.id)}/>
                            <label htmlFor={u.id}>{u.name}</label><br/>
                            </div>
                        )
                        )}       
                  </div>)}
                </div>
              </form>
            </div>
          </div>
          {diary ? (
              diary.length>0 ? 
              <div>
                  {diary.map((note)=>(
                    note.category===activeCategory && <Note key={note._id} note={note} onRemove={onRemove} onEdit={onEdit}/>
                  ))}</div>
            : <h5>Du hast noch keine Notizen</h5>
            ) 
             : <Spinner  animation="border"/>}
          </div>
           
        </div>
  )
}

export default Diary