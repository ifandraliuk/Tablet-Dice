import React, { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { logout } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const {player, isError} = useSelector((state)=>state.player)
    const {user} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
    if(player || user){
        dispatch(logout())
        
    }
    localStorage.clear()
    navigate("/")
    }, [])
  return (
    <div>errorPage</div>
  )
}

export default ErrorPage