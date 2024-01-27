import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faSuitcase,
  faPerson,
  faX,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  setPagination,
  getItem,
  selectedGenus,
  getGenuses,
} from "../../features/item/itemSlice";

import { motion } from "framer-motion";
import MotionButton from "../../components/MotionButton";
import ItemIcon from "../../components/ItemIcon";
import GenusList from "./GenusList";
import Slot from "./Slot";
const ItemsView = ({ setShowInfo, iFilter, setCustomInfo, addItemToInventory }) => {
  const dispatch = useDispatch();
  const { data, activeGenus, n, m } = useSelector(
    (state) => state.items
  );

  const forward = () => {
    const nextN = parseInt(n) + 10;
    const nextM = parseInt(m) + 10;
    console.log("next pages", nextN, nextM);

    dispatch(setPagination({ n: nextN, m: nextM }));
  };

  const back = () => {
    const backN = parseInt(n) - 10;
    const backM = parseInt(m) - 10;
    console.log("back pages", backN, backM);

    dispatch(setPagination({ n: backN, m: backM }));
  };

  const handleActiveGenus = (e) => {
    const genus = e.currentTarget.name;
    console.log(genus);
    dispatch(selectedGenus({ genus: genus }));
  };

  useEffect(() => {
    dispatch(getGenuses({ filter: iFilter }));
  }, [dispatch, iFilter]);
  useEffect(() => {
    console.log("useEffect request");
    console.log(iFilter, activeGenus)
    const data = {
      category: iFilter ? iFilter : "Rüstung", //iFilter
      genus: activeGenus ? activeGenus : "Kopf",
      n: n,
      m: m,
    };

    dispatch(getItem(data));
  }, [dispatch, n, m, iFilter, activeGenus]);

  return (
    <div className="row ">
      <div className="col-lg-4">
        <GenusList handleActiveGenus={handleActiveGenus} />
      </div>
      {/* Display your items here */}
      <div className="col-lg-8">
        {<div className="row"></div>}
        <div className="row">
          
            <div className="col-auto mt-2" >
              {/*<ItemIcon item={item} />*/}

      
              <Slot modus={true} setShowInfo={setShowInfo} setCustomInfo={setCustomInfo}/>
            </div>
          

          <div className="row mt-3">
            <div className="col-6">
              {n > 0 && (
                <MotionButton icon={faAnglesLeft} onClick={back} theme="" />
              )}
              <MotionButton icon={faAnglesRight} onClick={forward} theme="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemsView;
