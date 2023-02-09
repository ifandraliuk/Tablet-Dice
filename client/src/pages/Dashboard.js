import React, { useEffect, useCallback } from 'react'
import { Container } from 'react-bootstrap'
import "../Styles/Dashboard.css"
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
    <div className="dark-bg dashboard-page">
      <div className={`bg ${originName}-bg container-fluid`}>
          <NavbarComp/>
          <div fluid style={{color:"white"}}>
            <div className="row">   
              <div className='col-lg-3 col-md-10 col-sm-12'>
                <div className="row">
                    <div className="p-2 col-lg-7 col-md-8 col-sm-6">
                        <img className="user-img " src={`/user/${user?._id}.jpeg`}></img>
                    </div>
                    <div className='col-lg-5 col-md-4 mt-3 col-sm-3'>
                        <div className="col"><EquippedItem category="Haupthand"/></div>
                        <div className='col'><EquippedItem category="Nebenhand"/></div>
                        <div className='col'>
                         {/* {player?.talents?.findIndex(el=>el.talent?.category==="Nahkampf")>=0?
                          (<div className="col-lg-12 col-md-12 col-sm-auto">
                            {player.talents.map((el)=>{
        
                              const category = el.talent.category
                              if(category==="Nahkampf" || category==="Fernkampf"){
                                return (
                                <div key={el._id} className="col">{`${el.talent.name}: `}<strong>{el.talent.dice}</strong></div>
                                )
                              }
                            })}
                          </div>):<div>keine</div>}*/}
                          <h5>{`Rüstung: `}<strong>{armor}</strong></h5>
                        </div>
                       
                      </div>
                  </div>
                <div className='row'><h1>{user?.name}</h1></div >
                <div className='row'><h2>{player.userclass?.name}</h2></div >
                <div className="row">
                  <div className='col-auto border pt-2'><h3>Stufe: <strong>{player?.level}</strong></h3></div>
                  <div  className='col-auto  border'><button className={originName} onClick={newLevel}><FontAwesomeIcon icon={faLevelUp} /></button></div>
                </div>
                <div className='col-lg-7 col-md-7 col-sm-12 mt-3'>
                  <Figure><Figure.Image src={`/origin/${originName}ldpi.png`}/></Figure>
                </div>
              </div>
              {/*second column */}
              <div className="col-lg-9">
                <div className='row border-bottom border-2 m-1'>
                  <div className="row">
                    <div className="col-lg-12 col-md-12" >
                      {player && player.attributes ? (<AttributeList/>): (<Spinner animation="border"/>) }
                   </div>
                </div>

                <BarListComponent/>
                {player && player.userclass ? (<ClassList/>) : (<Spinner animation="border"/>)}
              </div>
          <div className="row">
              
              <div className="col-lg-7 col-md-12">
              <h3>Aktive Boni</h3>
                {bonis?.length===0 ? <p>Hast noch keine...</p>:
                bonis.map((boni, ind)=>(
                  <h5 key={ind}>{boni}</h5>
                ))}
              </div>
                {setboni?.length>0 && <div className='col-lg-4 col-md-12'>
                  <h3>Set bonus</h3>
                  <h5>{setboni}</h5>
                </div>
                }
              
          </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
}

export default Dashboard