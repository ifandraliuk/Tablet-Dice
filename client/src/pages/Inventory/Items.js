import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCircleInfo,
  } from "@fortawesome/free-solid-svg-icons";
  import { itemNames } from "../../data/ConstVariables";
import ItemIcon from '../../components/ItemIcon';
  
function Items({items, addItem, itemSelected, getDetails}) {
  const els = items()
    const {genus, rarity} = itemNames
  return (
    <table
    className="w-100 custom-table"
    style={{ textAlign: "left" }}
  >
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Typ</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {els?.map((item, ind) => {
        const r = rarity[item.rarity];
        const g = genus && genus[item.genus];
      
          return (
            <tr key={item._id}>
              <td className="pb-0">
{/*                 <img
                  alt="icon"
                  name={item._id}
                  src={`/icons/${r}/${g}xhdpi.png`}
                  onClick={itemSelected}
                /> */}
                <ItemIcon item={item} enchantment={null}/>
              </td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>
                <div className='button-group'>
                  <button
                    variant="outline-secondary"
                    name={ind}
                    onClick={getDetails}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                  <button
                    variant="outline-success"
                    name={ind}
                    onClick={addItem}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div >
              </td>
            </tr>
          );
      })}
    </tbody>
  </table>
  )
}

export default Items