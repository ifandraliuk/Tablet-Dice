import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allAttributes } from "../../data/ConstVariables";
import { updateAttribute } from "../../features/player/playerSlice";
import ExclamationMark from "../../components/ExclamationMark";

function Attributes() {
  const { player } = useSelector((state) => state.player);
  const { attributes } = player;
  const [difference, setDifference] = useState(0);
  const dispatch = useDispatch();
  const keys = Object.keys(allAttributes);
  console.log(keys)
  useEffect(() => {
    let out = 0;
    keys.forEach((key) => {let value = typeof(attributes[key]) === "number" ?  attributes[key] : 0; out = out +value});
    const diff = player?.pointsLeft - out;
    setDifference(diff);
    console.log(player?.pointsLeft, out, attributes, diff)
  }, [player?.pointsLeft, keys, attributes]);

  const onClick = (e) => {
    dispatch(updateAttribute(e.currentTarget.id));
  };
  return (
    <div>
      {difference !== 0 ? (
        <div className="row mt-2">
          <div className="col-auto">
            <ExclamationMark />
          </div>
          <div className="col-auto">
            <h3>{`Attribute: + ${difference}`} </h3>{" "}
          </div>
        </div>
      ) : (
        <h3>Attribute</h3>
      )}
      <div className="row info-div border-pattern-top">
        {keys.map(
          (key) =>
            attributes[key] > 0 && (
              <div key={key} className="col me-0 w-auto">
                <h6>{`${allAttributes[key]}:`}</h6>
                <strong>{attributes[key]}</strong>
               
                {difference !== 0 && (
                  <button id={key} className="" onClick={onClick}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Attributes;
