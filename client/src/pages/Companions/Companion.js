import React from "react";
import AttributesList from "./AttributesList";

function Companion({
  data,
  slots,
  slotOnClick,
  fractionTheme,
  slotsAllowed,
  companions,
  msg,
}) {
  const { _id, name, creature } = data;
  const { art, capacity, hitpoints, hitchance, armor } = creature;
  const eligibleSlots = slots.filter((slot, i) => {
    const meetsCreatureRequirement =
      (i === 0 && hitpoints <= 60) ||
      (i === 1 && hitpoints > 80) ||
      i === 2 ||
      (i === 3 && art === "Humanoid") ||
      (i === 4 && art === "Drache");
    return i + 1 <= slotsAllowed && meetsCreatureRequirement;
  });

  return (
    <div className="companion-list">
      <div className="row">
        <div className="col-12">
          <div className="companion-card__heading">
            <h3 className="companion-card__name">
              {name}
              {creature?.name && (
                <span className="companion-card__creature-type">
                  {" "}({creature.name})
                </span>
              )}
            </h3>
          </div>
          <AttributesList
            hitpoints={hitpoints}
            capacity={capacity}
            hitchance={hitchance}
            armor={armor}
          />
        </div>
        <div
          className="companion-slot-actions"
          role="group"
          aria-label={`Zuweisung für ${name}`}
        >
          <h4 className="companion-slot-actions__title">Zuweisen</h4>
          {eligibleSlots.map((slot) => {
            const assignedCompanion = companions.find(
              (companion) => companion.status === slot
            );

            return (
              <button
                type="button"
                id={slot}
                key={slot}
                className={`companion-slot-action ${fractionTheme}`}
                name={_id}
                onClick={(e) =>
                  slotOnClick(e.currentTarget.id, e.currentTarget.name)
                }
              >
                <span>Als {slot} zuweisen</span>
                {assignedCompanion && (
                  <small>Belegt: {assignedCompanion.name}</small>
                )}
              </button>
            );
          })}
          {eligibleSlots.length === 0 && (
            <p className="companion-slot-actions__empty">
              Keine freigeschalteten Slots passen zu diesem Begleiter.
            </p>
          )}
        </div>
        {msg?.id === _id && msg?.text.length > 0 && (
          <div className="alert error">{msg.text}</div>
        )}
      </div>
    </div>
  );
}

export default Companion;
