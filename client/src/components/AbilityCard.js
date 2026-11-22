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
import MotionButton from "./MotionButton";
import { germanAttr } from "../data/ConstVariables";

function AbilityCard(props) {
  const { _id, name, description, price, type, dice } = props.ability;
  const { userclass } = props;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const hasLongDescription = (description?.length || 0) > 140;

  const [toAnimate, setAnimate] = useState(false)
  const animateCard = {
    init: {
      y: 0,
      scale: 1,
    },
    hover: {
      y: -4,
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
  const resourceName = germanAttr[type] || type;
  return (
    <motion.div
      className={`ability-card${props.selected ? " ability-card--selected" : ""}`}
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
      <div className="ability-card__meta">
        <span className="ability-card__meta-item">
          <span className="ability-card__meta-label">Kosten</span>
          <span className="ability-card__meta-value">
            {type === "stamina" ? (
              <FontAwesomeIcon icon={faBolt} aria-hidden="true" />
            ) : type === "mana" ? (
              <FontAwesomeIcon icon={faStar} aria-hidden="true" />
            ) : type === "spirit" ? (
              <FontAwesomeIcon icon={faGhost} aria-hidden="true" />
            ) : (
              <FontAwesomeIcon icon={faHeart} aria-hidden="true" />
            )}
            {` ${price} ${resourceName}`}
          </span>
        </span>
        <span className="ability-card__meta-item ability-card__meta-item--check">
          <span className="ability-card__meta-label">Probe</span>
          <span className="ability-card__meta-value">
            <FontAwesomeIcon icon={faDiceD20} aria-hidden="true" />
            {` ${dice}`}
          </span>
        </span>
      </div>
      <Image
        className="ability-card__image"
        src={`/abilities/${userclass && userclass}/${_id}.svg`}
        alt={name}
      />
      <h3 className="ability-card__title">{name}</h3>
      <div className="ability-card__description">
        <p
          className={
            props.isDashboard && hasLongDescription && !descriptionExpanded
              ? "is-collapsed"
              : undefined
          }
        >
          {description}
        </p>
        {props.isDashboard && hasLongDescription && (
          <button
            type="button"
            className="ability-card__description-toggle"
            aria-expanded={descriptionExpanded}
            onClick={() => setDescriptionExpanded((expanded) => !expanded)}
          >
            {descriptionExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          </button>
        )}
      </div>
      <div className="ability-card__actions">
        <MotionButton 
              name={_id}
              content={props.buttonText ? props.buttonText : "Verwenden"}
              onClick={props?.customClick ? props.customClick : onClick}
              theme=""
              className="ability-card__use-button"
              ariaPressed={props.selected}
              ariaLabel={props.selectionLabel}
              hoverScale={1}
            />

      </div>
    </motion.div>
  );
}

export default AbilityCard;
