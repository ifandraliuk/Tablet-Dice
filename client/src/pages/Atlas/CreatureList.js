import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getHabitatCreature,
  resetCreatures,
} from "../../features/atlas/atlasSlice";

const CreatureList = () => {
  const { activeHabitat, activeCreatures } = useSelector(
    (state) => state.atlas
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {
      habitat: activeHabitat._id,
      register: "creature",
    };
    dispatch(getHabitatCreature(data));

    return () => {
      dispatch(resetCreatures());
    };
  }, [dispatch]);

  return (
    <div className="container">
      {activeCreatures.length > 0 &&
        activeCreatures.map((creature) => (
          <div className="row mb-2">
            <div className="col-3 ">
              <img
                className="img-creature"
                src={`creature/${creature._id}.png`}
                alt="creature"
              />
              <h5 className={creature.status}>Status: {creature.status}</h5>
            </div>
            <div className="col-6">
              <h2>{creature.name}</h2>
              <ul>
          
                <li>Gattung: {creature.art}</li>
              
                <li>Material: {creature.material}</li>
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CreatureList;
