import React, { memo } from "react";
import EquippedItem from "./EquippedItem";
import Alert from "react-bootstrap/Alert";
import Figure from "react-bootstrap/Figure";
import { motion } from "framer-motion";

const Equipment = memo(({ armor, err, uclass }) => {
  console.log("re-rendering equipment");

  return (
    <>
      <div
        className="row justify-content-center"
        style={{ color: "white" }}
      >{`Rüstwert: ${armor}`}</div>
      <div>{err && <Alert variant={err.variant}>{err.msg}</Alert>}</div>
      <div className="row justify-content-center m-3">
        <div className="col-3 order-lg-1 order-md-1 col-md-3 col-sm-6 w-auto h-auto ">
          {["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].map(
            (name, i) => (
              <motion.div className="row pb-4" key={name}
              >
                <EquippedItem category={name} delayValue={i} />
              </motion.div>
            )
          )}
        </div>
        <div className="col-md-2 col-lg-6 order-lg-2 order-md-3 col-sm-12 w-auto  align-self-start">
          <Figure>
            <Figure.Image src={`/classes_img/${uclass}xxhdpi.png`} />
          </Figure>
        </div>
        <div className="col-3 order-lg-3 order-md-2 col-sm-6  w-auto">
          {["Hals", "Arme", "Hüfte", "Nebenhand", "Finger", "Verbrauch"].map(
            (name, i) => (
              <div className="row pb-4" key={name}>
                <EquippedItem category={name} delayValue={i}/>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
});

export default Equipment;
