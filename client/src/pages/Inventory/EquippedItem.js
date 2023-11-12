import React from "react";
import { useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { itemNames } from "../../data/ConstVariables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function EquippedItem({ category, delayValue }) {
  const { player, equipped, fractionTheme } = useSelector(
    (state) => state.player
  );
  const { genus, rarity } = itemNames;

  if (equipped && player) {
    const i = player && equipped?.findIndex((el) => el.category === category);
    const eqId = equipped[i]?.equipment;
    const id = player?.inventory?.findIndex((el) => el._id === eqId);
    //console.log(player?.inventory[player?.inventory.findIndex(el=>el._id===equipped[id?.equipment])])
    if (id >= 0) {
      const equipment = player?.inventory[id];
      const { item, enchantment } = equipment;
      const place = [
        "Kopf",
        "Rücken",
        "Brust",
        "Haupthand",
        "Beine",
        "Füße",
      ].includes(equipment?.item.genus)
        ? "left"
        : "right";
      const r = enchantment?.rarity
        ? rarity[enchantment.rarity]
        : rarity[item.rarity];
      const g = genus[item.genus];
      const fullInfo = equipment && (
        <Popover id="full">
          <Popover.Header bg="success">{item.name}</Popover.Header>
          <Popover.Body>
            <ListGroup>
              {item.bonuses && (
                <ListGroup.Item>
                  {item?.bonuses && `Boni: ${item.bonuses}`}
                </ListGroup.Item>
              )}
              {enchantment?.bonuses && (
                <ListGroup.Item>{`Verzauberung:  ${enchantment.bonuses}`}</ListGroup.Item>
              )}
              {equipment.dice && (
                <ListGroup.Item>
                  {item?.dice && `Widerstand: ${item.dice}`}
                </ListGroup.Item>
              )}
              {item.dice && (
                <ListGroup.Item>{`${
                  item.category === "Waffe" ? "Schaden" : "Widerstand"
                }: ${item.dice}`}</ListGroup.Item>
              )}
              <ListGroup.Item>{`${
                item.category === "Waffe" ? "Reichweite" : "Rütungswert"
              }: ${item.value}`}</ListGroup.Item>
              <ListGroup.Item>
                {item?.weight && `Gewicht: ${item.weight}`}
              </ListGroup.Item>
            </ListGroup>
          </Popover.Body>
        </Popover>
      );
      return (
        <motion.div
          initial={{ translateY: -90 }}
          animate={{ translateY: 0 }}
          transition={{
            duration: 2,
            type: "spring",
            bounce: 0.5,
            delay: delayValue ? delayValue * 0.1 : 0.1,
          }}
        >
          <OverlayTrigger trigger="click" placement={place} overlay={fullInfo}>
            <button className={`items-btn ${fractionTheme}`}>
              <img
                className="mb-0"
                src={`/icons/${r}/${g}xhdpi.png`}
                onError={(event) => {
                  console.log(g);
                  event.target.src = "/icons/common/" + g + "xhdpi.png";
                  event.onerror = null;
                }}
              />
            </button>
          </OverlayTrigger>
        </motion.div>
      );
    } else
      return (
        <div className="align-items-center col-3">
          <FontAwesomeIcon icon={faRectangleXmark} />
        </div>
      );
  } else return <h6>is Loading..</h6>;
}

export default EquippedItem;
