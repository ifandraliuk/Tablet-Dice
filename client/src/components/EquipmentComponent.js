import React from 'react'
import {useSelector} from 'react-redux';
import EquippedItem from '../components/EquippedItem';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
function EquipmentComponent() {
  const {player, isLoading,  equipmentError, armor} = useSelector((state)=>state.player)
  console.log("re-rendering equipment")
    if(isLoading){
        return (<h4>Is loading...</h4>)
    }
  return (
    <>
      <Row className=" justify-content-center" style={{color:"black"}}>{`Rüstwert: ${armor}`}</Row>
      <Row>{equipmentError && <Alert variant={equipmentError.variant}>{equipmentError.msg}</Alert>}</Row>
        <Row className=" justify-content-center m-3">
          <Col className="col-3 w-auto h-auto">
            {["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].map((name)=>(
              <Row className="pb-5" key={name}><EquippedItem category={name}/></Row>
            ))}
          </Col>
          <Col className="col-6 w-auto h-auto  align-self-start"><Image src={`/classes_img/${player?.userclass?.name}xxhdpi.png`}></Image></Col>
          <Col className="col-3  w-auto">
           
          {["Hals", "Arme", "Hüfte", "Nebenhand", "Finger", "Verbrauch"].map((name)=>(
              <Row className="pb-5" key={name}><EquippedItem category={name}/></Row>
            ))} 
          </Col>
        </Row>
          </>
  )
}

export default EquipmentComponent