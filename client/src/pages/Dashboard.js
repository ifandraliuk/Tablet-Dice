import React, { useEffect, useCallback } from 'react'
import { Container } from 'react-bootstrap'

import NavbarComp from '../components/Navbar'
import {useSelector, useDispatch} from 'react-redux';
import Image from 'react-bootstrap/Image'
import Figure from 'react-bootstrap/Figure'
import Spinner from 'react-bootstrap/Spinner'
import EquippedItem from '../components/EquippedItem'
import BarListComponent from '../components/BarListComponent'
import ClassList from '../components/ClassList'

import AttributeList from '../components/AttributeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLevelUp} from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import {updateLevel, getArmor} from '../features/player/playerSlice';

function Dashboard() {
  const {user} = useSelector((state)=>state.auth)
  const {player, armor, bonis, setboni} = useSelector((state)=>state.player)
  const dispatch = useDispatch()  
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  console.log(originName)
  const newLevel = () => {
    dispatch(updateLevel())
  }


  return (
    <div className="dark-bg">
      <div className={`bg ${originName}-bg`}>
          <NavbarComp/>
          <Container fluid style={{color:"white"}}>
          <div className="row">   
              <div className='col-lg-3 height-auto'>
                <div className="row">
                    <div style={{backgroundColor:"white"}} className="p-2 col-7 mb-2 ms-1 me-1">
                        <Image fluid src={`/user/${user?._id}.jpeg`}></Image>
                    </div>
                    <div className='col-2 mt-3'>
                        <div className="row"><EquippedItem category="Haupthand"/></div>
                        <div className='row mt-2'><EquippedItem category="Nebenhand"/></div>
                        <div className="row">
                    <div className='col'>
                    {player?.talents?.findIndex(el=>el.talent?.category==="Nahkampf")>=0?
                    (<div>
                      <h5>Proben</h5>
                      {player.talents.map((el)=>{
  
                        const category = el.talent.category
                        if(category==="Nahkampf" || category==="Fernkampf"){
                          return (
                            <div key={el._id}>{`${el.talent.name}: ${el.talent.dice}`}</div>
                          )
                        }
                      })}
                    </div>):<div>keine</div>}
                  </div>
                </div>
                        <div><h5>{`Rüstung: ${armor}`}</h5></div>
                    </div>
                </div>
                <div className='row'><h1>{user?.name}</h1></div >
                <div className='row'><h2>{player.userclass?.name}</h2></div >
                <div className="row">
                  <div className='col-auto border pt-2'><h3>Stufe: {player?.level}</h3></div>
                  <div  className='col-auto  border'><button onClick={newLevel}><FontAwesomeIcon icon={faLevelUp} /></button></div>
                </div>
                <div className='col-7 mt-3'>
                  <Figure><Figure.Image src={`/origin/${originName}ldpi.png`}/></Figure>
                </div>
              </div>
              <div className="col ms-6">
                <div className='row border-bottom border-2 m-1'>
                  <div className="row">
                    <div className="col" >
                      {player && player.attributes ? (<AttributeList/>): (<Spinner animation="border"/>) }
                   </div>
                </div>

                <BarListComponent/>
                {player && player.userclass ? (<ClassList/>) : (<Spinner animation="border"/>)}
              </div>
          <div className="row">
              
              <div className="col-7">
              <h3>Aktive Boni</h3>
                {bonis?.length===0 ? <p>Hast noch keine...</p>:
                bonis.map((boni, ind)=>(
                  <h5 key={ind}>{boni}</h5>
                ))}
              </div>
                {setboni?.length>0 && <div className='col-5'>
                  <h3>Set bonus</h3>
                  <h5>{setboni}</h5>
                </div>
                }
              
          </div>
            </div>
          </div>
          </Container>
      </div>
    </div>
  )
}

export default Dashboard