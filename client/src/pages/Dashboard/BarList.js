import React, { useState } from "react";
import Bar from "./Bar";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseBar,
  increaseBar,
  resetBars,
} from "../../features/player/playerSlice";
import { germanAttr } from "../../data/ConstVariables";
import MathButtonGroup from "../../components/MathButtonGroup";

function BarList() {
  const { attributes } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [damage, setDamage] = useState({ type: "Vitalität", val: 0 });
  const bar = Object.keys(germanAttr);

  const add = (e) => {
    const category = Object.keys(germanAttr).find(
      (el) => germanAttr[el] === damage.type
    );
    const value = parseInt(damage.val);
    dispatch(increaseBar({ category, value }));
  };
  const subtract = (e) => {
    const category = Object.keys(germanAttr).find(
      (el) => germanAttr[el] === damage.type
    );
    const value = parseInt(damage.val);
    dispatch(decreaseBar({ category, value }));
  };
  const onChange = (e) => {
    setDamage((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onReset = (e) => {
    dispatch(resetBars());
  };
  return (
    <div className="mt-2">
      {bar.map(
        (name, i) =>
          attributes &&
          attributes[name] > 0 && <Bar category={name} key={name} />
      )}

      <div className="bar-adjustment-controls mt-2 mb-2">
        <select
          className="form-select dark-filter-control bar-adjustment-type"
          value={damage.type}
          name="type"
          onChange={onChange}
          aria-label="Ressource anpassen"
        >
          {bar.map(
            (name) =>
              attributes &&
              attributes[name] > 0 && (
                <option id={name} key={name}>
                  {germanAttr[name]}
                </option>
              )
          )}
        </select>
        <input
          type="number"
          className="form-control dark-filter-control bar-adjustment-value"
          value={damage.val}
          name="val"
          onChange={onChange}
          aria-label={`Wert für ${damage.type}`}
        />
        <MathButtonGroup
          add={add}
          subtract={subtract}
          onReset={onReset}
          className="bar-adjustment-buttons resource-adjustment-buttons"
        />
      </div>
    </div>
  );
}

export default BarList;
