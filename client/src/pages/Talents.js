import React, {useEffect, useState} from 'react'
import "../Styles/Talents.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFloppyDisk,} from '@fortawesome/free-solid-svg-icons'
import NavbarComp from '../components/Navbar'
import { Image, Container, Spinner, } from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTalent, reset } from '../features/talent/talentSlice';
import { addTalent } from '../features/player/playerSlice';
import Form from 'react-bootstrap/Form';
import TalentsList from '../components/TalentsList';
import { races } from '../components/ConstVariables'
import TableTalent from '../components/TableTalent'
import AttributeList from '../components/AttributeList'


function Talents() {
  const {user} = useSelector((state)=>state.auth)
  const {player} = useSelector((state)=>state.player)
  const {talent, isLoading, isError, message} = useSelector((state)=>state.talents)
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  const [newTalents, setNewTalent] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const categories = []
  const els = {}
  const kindAdvantage = races[player?.general?.kind]?.ability
  //find all categories from dB
  Object.keys(talent).map((ind) => {
    return categories.push(talent[ind].category)})  
  // count amount of els in each category
  categories.forEach(function (x) { els[x] = (els[x] || 0) + 1; }); 
  const sorted = Object.fromEntries(
    Object.entries(els).sort(([,a],[,b]) => parseInt(b)-parseInt(a))
);
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
    }
    dispatch(getTalent())
    // Dismount general info
     return () => {
      dispatch(reset())
    } 
  }, [user, navigate, isError, dispatch, message])

  const handleChange = e => {
    console.log(e.target.value, e.target.name)
    const name = e.target.name
    console.log(isNaN(e.target.value))
    const value = isNaN(parseInt(e.target.value))? 0 : parseInt(e.target.value)
    console.log(name, typeof(value))
    let talent = [e.target.name, value]
    const exists = newTalents.findIndex(el=>el[0]===name)
    console.log(exists)
    if(newTalents && newTalents.length === 0){
      setNewTalent([...newTalents, talent])
    } else {
      if(exists >= 0){
        console.log("found index, repalcing value", exists)
        setNewTalent(newTalents.map((val, ind)=>(
          val[0] === name && ind===exists ? talent : val
        )))
      } else {
        setNewTalent([...newTalents, talent])
      }
    }

  }
  const handleClick = e => {
    e.preventDefault()
    const name = e.currentTarget.name
    console.log(e.currentTarget.name)
    const talent = newTalents.find(el=>el[0]===name)
    if(talent){
      const value = parseInt(talent[1])
      if(value > 0 ){
        console.log("adding manually talent")
        dispatch(addTalent({"name": name, "point": value}))
        setNewTalent(newTalents.map((t)=>(
          t[0] === name ? [t[0], 0] : t
        )))
        console.log(talent)
      }
    }
    console.log(newTalents)


}
  const handleSubmit = (e) => {
    e.preventDefault()
    newTalents.forEach((el, i)=>{
      if(el[1]>0) //sorting out null values
        dispatch(addTalent({"name": el[0], "point": el[1]}))
    })
    console.log(newTalents)
    setNewTalent([])
  }

  if(isLoading){
    return <Spinner animation="border"/>
  }
  return (
    <div style={{backgroundColor:"#161614",  }} className="Talents">
       <div style={{backgroundImage:`url(/${originName}.svg)`, overflow:"auto", backgroundAttachment:"fixed", height:"100vh", backgroundRepeat:"no-repeat"}}>
        <NavbarComp/>
        <Container fluid  style={{color:"white"}}>
          
        <div className="row">
          <div className='col-lg-3 col-md-12 me-3'>
              <div style={{backgroundColor:"white"}} className="p-2 col-lg-7 col-md-2 mb-2 ms-1 me-1 border">
                  <Image fluid src={`/user/${user?._id}.jpeg`}></Image>
              </div>
            <div className="col-lg-9 col-md-10 border">            
              <h3>{player?.userclass?.name}</h3>
              <p>{player?.userclass?.advantages}</p>
              <h3>{player?.general?.kind}</h3>
              <h5>{kindAdvantage?.name}</h5>
              <p>{kindAdvantage?.descr}</p>
            </div>

          </div>
          <div className="col-lg-8 col-md-12">
          {player?.talents ? <AttributeList/>:<Spinner animation='border'/>}
          {player.talents ? (
            <TalentsList props={player.talents}/>
          ) : (<>Du hast noch keine Talente...</>)}
        </div>
        </div>
        <div className="row">
          <div className='col-lg-3'></div>
          <div className="col-lg-8">
          
            <h5>Alle Talente</h5>
                    <button className="btn-save" onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk}/></button>
                <Form>
                                 
                    {Object.keys(sorted).map((el, ind)=>{
                      return (
                          <div className="col-12 border" key={ind}>
                          <TableTalent handleChange={handleChange} handleClick={handleClick} el={el}/>
                       </div>
                    )})}
                
              </Form>
              
            </div>
        </div>

        </Container>
        </div>
        </div>
  )
}

export default Talents