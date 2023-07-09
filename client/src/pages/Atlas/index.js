import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHabitat } from "../../features/habitats/habitatSlice";

const Atlas = () => {
  const dispatch = useDispatch();
  const { habitat } = useSelector((state) => state.habitat);
  useEffect(() => {
    dispatch(getHabitat());
  }, []);
  return (
    <div className="dark-bg">
      {habitat.length > 0 && habitat.map((h) => 
      <div key={h._id}>
        <h4>{h.name}</h4>
        <ul>
          {h.ressource?.map((r)=>(
            <li key={r._id}><strong>{r.id?.name}</strong> dice: ${r.dice}</li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

export default Atlas;
