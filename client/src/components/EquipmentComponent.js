import React from 'react'
import {useSelector} from 'react-redux';
import EquippedItem from '../components/EquippedItem';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image'
function EquipmentComponent() {
  const {player, isLoading,  equipmentError, armor} = useSelector((state)=>state.player)
  console.log("re-rendering equipment")
    if(isLoading){
        return (<h4>Is loading...</h4>)
    }
  return (
    <>
      <div className="row justify-content-center" style={{color:"white"}}>{`Rüstwert: ${armor}`}</div>
      <div>{equipmentError && <Alert variant={equipmentError.variant}>{equipmentError.msg}</Alert>}</div>
        <div className="row justify-content-center m-3">
          <div className="col col-3 col-sm-6 w-auto h-auto">
            {["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].map((name)=>(
              <div className="row pb-5" key={name}><EquippedItem category={name}/></div>
            ))}
          </div>
          <div className="col col-lg-6 col-sm-12 w-auto h-auto  align-self-start"><Image src={`/classes_img/${player?.userclass?.name}xxhdpi.png`}></Image></div>
          <div className="col col-3 col-sm-6  w-auto">
           
          {["Hals", "Arme", "Hüfte", "Nebenhand", "Finger", "Verbrauch"].map((name)=>(
              <div className="row pb-5" key={name}><EquippedItem category={name}/></div>
            ))} 
          </div>
        </div>
          </>
  )
}

export default EquipmentComponent