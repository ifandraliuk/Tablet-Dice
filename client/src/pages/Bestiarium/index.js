import React,{useEffect} from 'react'
import "../../Styles/Bestiaria.css"
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {reset, getBestiaria} from '../../features/bestiaria/bestiariaSlice'
import NavbarComp from '../../components/Navbar'
import BestienList from './BestienList'


const Bestiaria = () => {
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
      <BestienList creatures={bestiaria}/>
      </div>
  )
}

export default Bestiaria