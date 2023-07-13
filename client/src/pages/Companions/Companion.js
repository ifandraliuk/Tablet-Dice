import { faArrowsToCircle, faDice, faHeart, faShield, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Companion({ data, slots, slotOnClick }) {
  const { name, level, creature } = data;
  const {  picture, capacity, hitpoints, hitchance, armor } = creature;
  return (
    <div className="companion-list border-pattern repeat">
        <div className="row">
            <div className="col-auto">
            <FontAwesomeIcon icon={faHeart} />
            {hitpoints}
        </div>
        <div className="col-auto ms-auto">
        <FontAwesomeIcon icon={faDice} />
            {hitchance}
        </div>
        <div className="col-auto ms-auto me-auto">
        <FontAwesomeIcon icon={faWeightHanging} />
            {capacity}
        </div>
        <div className="col-auto ms-auto">
        <FontAwesomeIcon icon={faShield} />
            {armor}
        </div>
        </div>

      <div className="row">
        <div className="col-2 level-div">
            {level}
        </div>
        <div className="col-10">
            <h3>{name}</h3>
            <div className={`line ${picture}`}></div>
            {creature?.name}
        </div>
        <div className='row ms-2'>
                {
                    slots.map((slot, i)=>(
                        <div className='col-auto' key={slot}>
                            <button className="slot-number" name={slot} onClick={(e)=>slotOnClick(e.currentTarget.name)}>{i+1}</button>
                        </div>
                    ))
                }
            </div>
      </div>
    </div>
  );
}

export default Companion;
