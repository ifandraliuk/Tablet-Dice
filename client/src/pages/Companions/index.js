import React, { useEffect, useState } from "react";
import "../../Styles/Companions.css";
import Companion from "./Companion";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { pageTransition } from "../../data/Animations";
import { slots, slotInfo } from "../../data/ConstVariables";
import Slot from "./Slot";
import { Button, Modal } from "react-bootstrap";
import { getOriginAccentStyle } from "../../data/OriginColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  updateCompanionStatus,
  equipToCompanion,
  unequipCompanionItem,
  getCompanion,
  getSlotsAvailable,
  reset,
  getEquipable,
} from "../../features/companion/companionSlice";
function Companions() {
  const {fractionTheme} = useSelector(
    (state) => state.player
  );

  const [msg, setMsg] = useState({ id: "", text: "" });
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [showStallInfo, setShowStallInfo] = useState(false);
  const [showSlotsInfo, setShowSlotsInfo] = useState(false);
  const dispatch = useDispatch();
  const { companions, slotsAllowed, equipable } =  useSelector(
    (state) => state.companion
  );
  useEffect(() => {
    dispatch(getCompanion())
    dispatch(getSlotsAvailable())
    dispatch(getEquipable())
    return () => {
      console.log("reset");
      dispatch(reset());
    };
  },[dispatch])
  const slotOnClick = (status, id, confirmed = false) => {
    const assignedCompanion = companions.find(
      (companion) => companion.status === status
    );
    if (
      status !== "Stall" &&
      assignedCompanion &&
      assignedCompanion._id !== id &&
      !confirmed
    ) {
      const newCompanion = companions.find((companion) => companion._id === id);
      setPendingAssignment({
        id,
        status,
        slot: status,
        newCompanionName: newCompanion?.name,
        currentCompanionName: assignedCompanion.name,
      });
      return;
    }

    dispatch(updateCompanionStatus({ id, status })).then((result) => {
      if (updateCompanionStatus.fulfilled.match(result)) {
        setPendingAssignment(null);
        setMsg({ id: "", text: "" });
      } else {
        setMsg({
          id,
          text: result.payload || "Der Begleiter konnte nicht zugewiesen werden.",
        });
      }
    });
  };
  const equipItem = (companionId, genus, itemId ) => {
        console.log(companionId, genus, itemId)
        const data = {
          id: companionId,
          genus: genus,
          itemId: itemId
        }
        console.log(data)
       dispatch(equipToCompanion(data))
  }
  const clearSlot = (companion, slotName) => {
    console.log(companion)
    const data = {
      id: companion._id,
      itemId: companion.slot1?._id,
      slotName: slotName
    }
    console.log(data)
    dispatch(unequipCompanionItem(data))
  }
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className={`${fractionTheme}-bg`}>
        <div className="dark-bg container-fluid g-5 companions-page">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="companions-section-heading">
                  <h3>Begleiter-Slots</h3>
                  <button
                    type="button"
                    className="companions-info-button"
                    aria-label="Informationen zu den Begleiter-Slots"
                    title="Informationen zu den Begleiter-Slots"
                    onClick={() => setShowSlotsInfo(true)}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                </div>
                <AnimatePresence wait>
                  {slots?.map((category, i) => (
                    <motion.div
                      key={category}
                      layout
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Slot
                        key={category}
                        category={category}
                        data={slotInfo[i]}
                        slotFilter={equipable}
                        usedBy={companions?.filter(
                          (c) => c.status === category
                        )}
                        slotOnClick={slotOnClick}
                        equipItem={equipItem}
                        clearSlot={clearSlot}
                        unlocked={i + 1 <= slotsAllowed ? true : false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="col-12 col-lg-4">
                  <div className="companions-section-heading">
                    <h3>Stall</h3>
                    <button
                      type="button"
                      className="companions-info-button"
                      aria-label="Informationen zur Stallzuweisung"
                      title="Informationen zur Stallzuweisung"
                      onClick={() => setShowStallInfo(true)}
                    >
                      <FontAwesomeIcon icon={faCircleInfo} />
                    </button>
                  </div>
                <AnimatePresence wait>
                  {companions?.map(
                    (companion, i) =>
                      companion.status === "Stall" && (
                        <motion.div
                          layout
                          key={companion._id}
                          initial={{
                            scale: 0,
                            x: -100,
                          }}
                          animate={{
                            scale: 1,
                            x: 0,
                          }}
                          exit={{
                            opacity: 0,

                            transition: {
                              duration: i * 0.2,
                            },
                          }}
                        >
                          <Companion
                            data={companion}
                            slots={slots}
                            slotOnClick={slotOnClick}
                            fractionTheme={fractionTheme}
                            slotsAllowed={slotsAllowed}
                            companions={companions}
                            msg={msg}
                          />
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </div>
        </div>
        <Modal
        show={Boolean(pendingAssignment)}
        onHide={() => setPendingAssignment(null)}
        centered
        className="companions-slot-confirm-modal"
        style={getOriginAccentStyle(fractionTheme)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Slot neu belegen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingAssignment && (
            <>
              <strong>{pendingAssignment.currentCompanionName}</strong> ist
              derzeit dem Slot <strong>{pendingAssignment.slot}</strong>{" "}
              zugewiesen. Soll stattdessen{" "}
              <strong>{pendingAssignment.newCompanionName}</strong> diesen Slot
              übernehmen? Der bisherige Begleiter kommt zurück in den Stall.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="companions-confirm-button companions-confirm-button--cancel"
            onClick={() => setPendingAssignment(null)}
          >
            Abbrechen
          </Button>
          <Button
            type="button"
            className="companions-confirm-button companions-confirm-button--replace"
            onClick={() =>
              slotOnClick(
                pendingAssignment.slot,
                pendingAssignment.id,
                true
              )
            }
          >
            Begleiter ersetzen
          </Button>
        </Modal.Footer>
        </Modal>
        <Modal
          show={showSlotsInfo}
          onHide={() => setShowSlotsInfo(false)}
          centered
          className="companions-info-modal"
          style={getOriginAccentStyle(fractionTheme)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Informationen zu den Begleiter-Slots</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Hier siehst du die Slots deiner aktiven Begleiter. Ein freier
              Slot kann über eine passende Begleiterkarte im Stall belegt
              werden. Für einen bereits belegten Slot wirst du vor dem
              Ersetzen um Bestätigung gebeten.
            </p>
            <p>
              Gesperrte Slots werden mit der nötigen Charisma-Stufe
              gekennzeichnet. Die Beschreibung jedes Slots erklärt seine
              Funktion:
            </p>
            <ul>
              {slots.map((slot, i) => (
                <li key={slot}>
                  <strong>{slot}</strong> – ab {slotInfo[i].charismaValue}{" "}
                  Charisma. {slotInfo[i].info}
                </li>
              ))}
            </ul>
          </Modal.Body>
        </Modal>
        <Modal
        show={showStallInfo}
        onHide={() => setShowStallInfo(false)}
        centered
        className="companions-info-modal"
        style={getOriginAccentStyle(fractionTheme)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Informationen zum Stall</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Im Stall stehen deine aktuell nicht zugewiesenen Begleiter. Über
            die Aktion auf einer Karte kannst du einen Begleiter einem
            passenden, freigeschalteten Slot zuweisen.
          </p>
          <p>Welche Slots angezeigt werden, richtet sich nach dem Begleiter:</p>
          <ul>
            <li>Schulterpet: bis zu 60 Lebenspunkte</li>
            <li>Reittier: mehr als 80 Lebenspunkte</li>
            <li>Begleiter 1: für alle Begleiter geeignet</li>
            <li>Begleiter 2: nur für Humanoide</li>
            <li>Drache: nur für Drachen</li>
          </ul>
          <p>
            Slots werden erst angezeigt, wenn sie durch ausreichend Charisma
            freigeschaltet sind. Ist ein passender Slot bereits belegt, kannst
            du ihn trotzdem auswählen. Vor dem Ersetzen wirst du gefragt; der
            bisherige Begleiter kommt dann zurück in den Stall.
          </p>
        </Modal.Body>
        </Modal>
      </div>
    </motion.div>
  );
}

export default Companions;
