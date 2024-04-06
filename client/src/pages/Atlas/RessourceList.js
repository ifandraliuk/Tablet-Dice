import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ItemIcon from "../../components/ItemIcon";
const RessourceList = () => {
  const dispatch = useDispatch();
  const { activeHabitat } = useSelector((state) => state.atlas);
  const { ressource } = activeHabitat;
  return (
    <div className="container">
      {ressource?.map((ressource) => (
        <div className="row">
          <div className="col-auto">
            <ItemIcon item={ressource.id} enchantment={null} large={false}/>
          </div>
          <div className="col-auto">
            <h4>{ressource.id.name}</h4>
            <p>{ressource.id._id}</p>
            <strong>Verfügbarkeit: </strong>{ressource.dice}
          </div>
          <div className="col-2"></div>
        </div>
      ))}
    </div>
  );
};

export default RessourceList;
