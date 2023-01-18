import React,{useEffect} from 'react'
import "../Styles/Bestiaria.css"
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {reset, getBestiaria} from '../features/bestiaria/bestiariaSlice'
import NavbarComp from '../components/Navbar'


function Bestiaria() {
  const dispatch = useDispatch()  
  const navigate = useNavigate()
  const {user} = useSelector((state)=>state.auth)
  const {bestiaria} = useSelector((state)=>state.bestiaria)
  useEffect(()=>{
    console.log("getting creatures...")
    dispatch(getBestiaria())
    if(!user){
      navigate("/")
    }
    return () => {
      console.log("reset")
      dispatch(reset())
    } 
  }, [])

  return (
    <div className="dark-bg">
      <NavbarComp/>
      <div className="container-fluid bestiaria">
        {bestiaria?.map((creature)=>{
          const habitat = creature?.habitat
          return (
          <div className="row m-3" key={creature._id}>
            <div className="col-12 border">{`${creature.name} (Gattung: ${creature.art})`}</div>
            <div className="col-3 border">Bild</div>
            <div className="col-9 border">
              {creature.description}
              {habitat?.map((h)=>(
                <div className="row border border-top" key={habitat._id}>{h.name}</div>
              ))}
              </div>
              <div className='col border'>
                <div className="row">
                  <div className="col-2">Trefferpunkte: {creature.hitpoints}</div>
                  <div className="col-2">Rüstung: {creature.armor}</div>
                  <div className="col-auto">Schaden: {creature.damage}</div>
                  <div className="col-2">Trefferchance: {creature.hitchance}</div>
                </div>
              </div>
              <div className="col-12 border">{creature.ability}</div>
          </div>  
          
        )})}
      </div>
      </div>
  )
}

export default Bestiaria