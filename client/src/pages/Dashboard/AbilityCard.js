import React from 'react'
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faBolt,faGhost, faHeart, faDiceD20} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'


function AbilityCard(props) {
   const {_id, name, description,price, type, dice} = props.ability
   const uclass = props.userclass
  return (
    <div className="row h-100" style={{color:"white",backgroundColor:"#3c3c3c", borderStyle:"double",}}>
        <div className="row " style={{textTransform:"uppercase",textAlign:"center",}}>
            <div className='col-auto'>
                {type==="stamina"? (<FontAwesomeIcon icon={faBolt}/>): 
                type==="mana"? (<FontAwesomeIcon icon={faStar}/>):
                type==="spirit"? (<FontAwesomeIcon icon={faGhost}/>) : (<FontAwesomeIcon icon={faHeart}/>) }{` ${price}`}
            </div>
            <div className='col-auto ms-auto'>
            <FontAwesomeIcon icon={faDiceD20}/>{` ${dice}`}
            </div>
        </div>
        <div className="row m-0 p-0 "><Image  src={`/abilities/${uclass && uclass}/${_id}xhdpi.png`}></Image></div>
        <div className="row m-auto" style={{textTransform:"uppercase",textAlign:"center",}}>
            <div style={{ letterSpacing:"2px"}}>{name}</div>
        </div>
        <div className="row"  style={{textAlign:"center", fontSize:"14px", marginLeft:"2px", marginRight:"2px", marginTop:"5px"}}>{description}</div >
        <div className="row"><div className='col-auto ms-auto me-auto mb-1'><Button size="sm" variant="outline-light" name={_id} onClick={props.useAbility}>Verwenden</Button></div></div >
    </div>
  )
}

export default AbilityCard