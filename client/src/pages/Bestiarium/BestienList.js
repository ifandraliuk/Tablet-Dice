import React from 'react'
import {memo} from "react"
const BestienList = memo(function BestienList({ creatures }) {
    console.log("bestien render")
  return (
    <div className="container bestiaria">
    {creatures?.map((creature)=>{
      const habitat = creature?.habitat
      return (
      <div className="row m-3" key={creature._id}>
        <div className="col-12 border"><h3>{creature.name}</h3>{` (Gattung: ${creature.art})`}</div>
        <div className="col-3 mt-3">
          <img className="img-creature" src={`creature/${creature._id}.png`}/>
          <h5 className={creature.picture}>{`Status: ${creature.picture}`}</h5>
          </div>
        
        <div className="col-9 border p-2">
          <h5>Beschreibung:</h5>
          <p>{creature.description}</p>
          <h5>Fertigkeiten:</h5>
          <p>{creature.ability}</p>
          <ul>
            <li>Trefferpunkte: <strong>{creature.hitpoints}</strong></li>
            <li>Rüstung: <strong>{creature.armor}</strong></li>
            <li>Schaden: <strong>{creature.damage}</strong></li>
            <li>Trefferchance: <strong>{creature.hitchance}</strong></li>
          </ul>
          <h5>Habitate:</h5>
          <ul>
          {habitat?.map((h)=>(
            <li className="row" key={h._id}>{h.name}</li>
          ))}
          </ul>

          </div>

      </div>  
      
    )})}
  </div>
  )
})

export default BestienList