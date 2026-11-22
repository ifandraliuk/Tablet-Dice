import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Button, Modal } from "react-bootstrap";
import { getOriginAccentStyle } from "../../data/OriginColors";
import "../../Styles/ThemedModal.css";

const LevelUp = ({ level, newLevel, fraction }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const nextLevel = level + 1;

  const closeConfirmation = () => {
    if (!submitting.current) {
      setShowConfirmation(false);
      setError("");
    }
  };

  const confirmLevelUp = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      await newLevel();
      setShowConfirmation(false);
    } catch (requestError) {
      setError(
        typeof requestError === "string"
          ? requestError
          : requestError?.message || "Der Stufenaufstieg ist fehlgeschlagen."
      );
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };
  const variants = {
    active: {
      scale: [0.5, 1],
      borderRadius: "50%", 
      transition: {
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
        repeat: Infinity,
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
  };
  return (
    <>
      <motion.button
        type="button"
        className={`round-btn ${fraction}`}
        variants={variants}
        animate="active"
        onClick={() => setShowConfirmation(true)}
        disabled={!Number.isInteger(level) || level < 1}
        aria-label={`Stufe ${level} erreicht. Stufe erhöhen`}
        aria-haspopup="dialog"
        title="Stufe erhöhen"
      >
        {level}
        <strong className={`${fraction}-text`}>
          <FontAwesomeIcon icon={faPlus} />
        </strong>
      </motion.button>
      <Modal
        show={showConfirmation}
        onHide={closeConfirmation}
        centered
        className="themed-modal dashboard-level-modal"
        style={getOriginAccentStyle(fraction)}
        aria-labelledby="dashboard-level-title"
        backdrop={isSubmitting ? "static" : true}
        keyboard={!isSubmitting}
      >
        <Modal.Header closeButton={!isSubmitting} closeLabel="Schließen">
          <Modal.Title id="dashboard-level-title">Stufe erhöhen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Du steigst von Stufe <strong>{level}</strong> auf Stufe{" "}
            <strong>{nextLevel}</strong> auf. Bitte stimme den Aufstieg zuerst
            mit deinem Gamemaster (GM) ab.
          </p>
          <p>
            {nextLevel % 5 === 0
              ? "Auf der nächsten Stufe darfst du 1 Attributspunkt verteilen."
              : "Auf der nächsten Stufe darfst du 2 weitere Talentpunkte verteilen und 1 neue Fertigkeit lernen."}
          </p>
          <p>
            Zur Erinnerung: Auf jeder fünften Stufe (5, 10, 15 usw.) darfst du
            1 Attributspunkt verteilen. Auf allen anderen Stufen darfst du jeweils
            2 weitere Talentpunkte verteilen und 1 neue Fertigkeit lernen.
          </p>
          {error && <p className="dashboard-level-modal__error" role="alert">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" className="dashboard-level-modal__button" onClick={closeConfirmation} disabled={isSubmitting}>
            Abbrechen
          </Button>
          <Button type="button" className="dashboard-level-modal__button dashboard-level-modal__button--confirm" onClick={confirmLevelUp} disabled={isSubmitting}>
            {isSubmitting ? "Wird erhöht …" : "Stufe erhöhen"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LevelUp;
