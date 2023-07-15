import React from "react";
import AttributesList from "./AttributesList";

function Companion({
  data,
  slots,
  slotOnClick,
  fractionTheme,
  slotsAllowed,
  msg,
}) {
  const { _id, name, level, creature } = data;
  const { picture, art, capacity, hitpoints, hitchance, armor } = creature;
  return (
    <div className="companion-list border-pattern repeat">
      <AttributesList
        hitpoints={hitpoints}
        capacity={capacity}
        hitchance={hitchance}
        armor={armor}
      />

      <div className="row">
        <div className="col-2 level-div">{level}</div>
        <div className="col-10">
          <h3>{name}</h3>
          <div className={`line ${picture}`}></div>
          {creature?.name}
        </div>
        <div className="row ms-2">
          {slots.map((slot, i) => {
            const slotRequirementFlag = 
            i=== 0 && hitpoints <=60 ? true : 
            i===1 && hitpoints > 80 ? true :
            i===2 ? true :
            i===3 && art === "Humanoid" ? true :
            i===4 && art === "Drache" ? true : false
            return (
              <div className="col-auto" key={slot}>
                {i + 1 <= slotsAllowed && slotRequirementFlag ? (
                  <button
                    id={slot}
                    className={`slot-number ${fractionTheme}`}
                    name={_id}
                    onClick={(e) =>
                      slotOnClick(e.currentTarget.id, e.currentTarget.name)
                    }
                  >
                    {i + 1}
                  </button>
                ) : (
                  <button disabled>{i + 1}</button>
                )}
              </div>
            );
          })}
        </div>
        {msg?.id === _id && msg?.text.length > 0 && (
          <div className="alert error">{msg.text}</div>
        )}
      </div>
    </div>
  );
}

export default Companion;
