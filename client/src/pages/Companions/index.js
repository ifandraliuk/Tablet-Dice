import React, { useState } from "react";
import "../../Styles/Companions.css";
import Companion from "./Companion";
import { AnimatePresence,  motion} from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { pageTransition } from "../../data/Animations";
import { slots, slotInfo } from "../../data/ConstVariables";
import Slot from "./Slot";
import { updateCompanionStatus, equipToCompanion, unequipCompanionItem } from "../../features/companion/companionSlice";
function Companions() {
  const { player, fractionTheme, slotsAllowed } = useSelector(
    (state) => state.player
  );
  const [msg, setMsg] = useState({ id: "", text: "" });
  const dispatch = useDispatch();
  const { companions } = player;

  const slotOnClick = (status, id) => {
    const slotIsEmpty =
      companions.findIndex((el) => el.status === status) < 0 ||
      status === "Stall"
        ? true
        : false;
    console.log(status, id);
    if (slotIsEmpty) {
      const data = {
        id: id,
        status: status,
      };
      dispatch(updateCompanionStatus(data));
      setMsg({ id: "", text: "" });
    } else setMsg({ id: id, text: "Der Slot ist bereits besetzt" });
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
  console.log(companions);
  return (
    <div className={`${fractionTheme}-bg`}>
      <div className="dark-bg container-fluid g-5">
        <div className="companions-page">
          <motion.div
            variants={pageTransition}
            initial="init"
            animate="animate"
            exit="exit"
          >
            <div className="container-fluid g-5">
              <div className="row">
                <div className="col-8">
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
                          i={i + 1}
                          category={category}
                          data={slotInfo[i]}
                          slotFilter={player?.inventory?.filter(
                            (el) => el.item.category === "Begleiter"
                          )}
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
                <div className="col-4">
                  <div className="row">
                    <div className="col-auto ms-auto me-auto ">
                      <h3>Stall</h3>
                    </div>
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
                              msg={msg}
                            />
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Companions;
