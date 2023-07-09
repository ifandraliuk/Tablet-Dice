import React from "react";
import { useState } from "react";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBolt,
  faGhost,
  faHeart,
  faDiceD20,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function AbilityCard(props) {
  const { _id, name, description, price, type, dice } = props.ability;
  const uclass = props.userclass;
  const [toAnimate, setAnimate] = useState(false)
  const animateCard = {
    init: {
      y: 0,
      scale: 1,
    },
    hover: {
      y: -20,
    },
    animation: {
        scale: 0.8,
        duration: 0.3,
        transition:{
            ease: "easeInOut",
            scale: {
              type: "spring",
              damping: 6,
              stiffness: 100,
              restDelta: 0.001
            }
        }

    } 
  };
  const onClick = (e) => {
    props.useAbility(e)
    setAnimate(true)
    console.log(toAnimate)
  }
  return (
    <motion.div
      className="row h-100 ability-card"
      variants={animateCard}
      whileHover="hover"
    initial="init"
    animate={toAnimate ? "animation" : ""}
    onAnimationComplete={()=>{
        if(toAnimate){
            setAnimate(false)
        }
    }}
    >
      <div
        className="row "
        style={{ textTransform: "uppercase", textAlign: "center" }}
      >
        <div className="col-auto">
          {type === "stamina" ? (
            <FontAwesomeIcon icon={faBolt} />
          ) : type === "mana" ? (
            <FontAwesomeIcon icon={faStar} />
          ) : type === "spirit" ? (
            <FontAwesomeIcon icon={faGhost} />
          ) : (
            <FontAwesomeIcon icon={faHeart} />
          )}
          {` ${price}`}
        </div>
        <div className="col-auto ms-auto">
          <FontAwesomeIcon icon={faDiceD20} />
          {` ${dice}`}
        </div>
      </div>
      <div className="row m-0 p-0 ">
        <Image src={`/abilities/${uclass && uclass}/${_id}xhdpi.png`}></Image>
      </div>
      <div
        className="row m-auto"
        style={{ textTransform: "uppercase", textAlign: "center" }}
      >
        <div style={{ letterSpacing: "2px" }}>{name}</div>
      </div>
      <div
        className="row"
        style={{
          textAlign: "center",
          fontSize: "14px",
          marginLeft: "2px",
          marginRight: "2px",
          marginTop: "5px",
        }}
      >
        {description}
      </div>
      <div className="row">
        <div className="col-auto ms-auto me-auto mb-1">
          <button
            className={props.theme}
            name={_id}
            onClick={onClick}
          >
            Verwenden
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AbilityCard;
