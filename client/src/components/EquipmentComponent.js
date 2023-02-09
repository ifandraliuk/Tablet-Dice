import React from 'react'
import {useSelector} from 'react-redux';
import EquippedItem from '../components/EquippedItem';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image'
import Figure from 'react-bootstrap/Figure'
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
          <div className="col-3 order-lg-1 order-md-1 col-md-3 col-sm-6 w-auto h-auto ">
            {["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].map((name)=>(
              <div className="row pb-4" key={name}><EquippedItem category={name}/></div>
            ))}
          </div>
          <div className="col-md-2 col-lg-6 order-lg-2 order-md-3 col-sm-12 w-auto  align-self-start">
            
          <Figure><Figure.Image src={`/classes_img/${player?.userclass?.name}xhdpi.png`}/></Figure>
             
     
          </div>
          <div className="col-3 order-lg-3 order-md-2 col-sm-6  w-auto">
           
          {["Hals", "Arme", "Hüfte", "Nebenhand", "Finger", "Verbrauch"].map((name)=>(
              <div className="row pb-4" key={name}><EquippedItem category={name}/></div>
            ))} 
          </div>
        </div>
          </>
  )
}

export default EquipmentComponent