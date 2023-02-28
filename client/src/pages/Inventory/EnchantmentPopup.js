import React, { useEffect, useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faDiceD20, faGem, faHammer, faHandSparkles, faShield, faX } from '@fortawesome/free-solid-svg-icons';
import {itemNames} from '../../data/ConstVariables';
import Alert from '../../components/Alert';
import DiceInfo from './DiceInfo';
import Image from "react-bootstrap/Image"
function EnchantmentPopup(props) {
  const {trigger, setTrigger, talent, selector, inventory, attr, enchant, remove} = props
  const itemSelected = selector && inventory?.find(el=>el._id===selector[0] && ["Waffe", "Rüstung"].includes(el.item.category))
  const [requirement, setRequirement] = useState()
  const [disabledButton, setDisabled] = useState(false)
  const [gem, setGem] = useState("")
  const [tool, setTool] = useState("")
  const [bonus, setBonus] = useState("")
  const [diceBonus, setDiceBonus] = useState(0)
  const [newRarity, setRarity] = useState("")
  
  useEffect(()=>{
    if(trigger){
      const req =  findRequirements()
      setRequirement(req)
      console.log("useEffect is active")
    }
  },[trigger])


  useEffect(()=>{
    if(tool?.length>0 && trigger && itemSelected){
      const bookWords = tool.split(" ")
      const diceBoni = bookWords.pop()
      setDiceBonus(diceBoni)
      console.log(diceBonus)
    }
  },[tool, trigger, itemSelected])
  useEffect(()=>{
    if(!itemSelected || requirement?.gems.length===0 || requirement?.tools.length===0 || bonus?.length===0 || !talent){
      setDisabled(true)
      
    } else setDisabled(false)
    
  }, [requirement, bonus])

  const raritymemo = useMemo(()=>{
    if(gem && itemSelected){
      const gemRarity = itemNames.gems.find(el=>el.name===gem)
      const itemRarity= itemNames.gems.find(el=>el.rarity===itemSelected.item?.rarity)
      const result = itemRarity.value===gemRarity.value ? itemRarity.rarity : itemRarity.value>gemRarity.value ? itemRarity.rarity : gemRarity.rarity
      setRarity(result)
    }
  },[gem, itemSelected])

  const reset = () => {
    setGem("")
    setTool("")
    setDiceBonus(0)
    setBonus("")
    setRarity("")
    setTrigger(false)
  }
  const findRequirements = () => {
    let gems = [], tools = []
    inventory?.map((el)=>(
      !gems.includes(el.item._id) && itemNames.gems?.filter(gem=>gem.name===el.item.name)?.length>0 ? gems.push(el.item.name) : el
    ))
    inventory?.map((el)=>(
      !tools.includes(el.item._id) && el.item.genus==="Werkzeug" && el.item.name.includes("Verzauberung") && tools.push(el.item.name)
    ))
    setGem(gems[0])
    setTool(tools[0])

    return {gems:gems, tools: tools}
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(gem, tool, bonus)
    const enchantment = {
      id: itemSelected._id,
      rarity: newRarity,
      bonuses: bonus
    }
    const id = inventory.find(element=>element.item.name===gem)?._id
    if(id && enchantment){
      enchant(enchantment,id)
      reset()
    }
      
    console.log(enchantment)
  }
  return (
    trigger?
    <div className="blur-bg">
      <div className='popup border'>
        <div className='row justify-content-end m-0'>
          <div className="col-auto">
            <button onClick={reset}><FontAwesomeIcon icon={faX}/></button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>  
        <div className="row justify-content-center">
          <div className="col-auto border-bottom mb-2"><h3>Verzauberung</h3></div>
        </div>
          {
          itemSelected ? 
          (
            <div>
                  <h4 className='enchantment-text'><FontAwesomeIcon icon={faShield} /> Item:</h4>
                  <div className="row">
                    <div className='col-auto'>
                      <Image 
                      name={itemSelected.item.name} 
                      src={`/icons/${itemNames.rarity[newRarity]}/${itemNames.genus[itemSelected.item.genus]}xhdpi.png`}
                      />                  
                    </div>
                    <div className={`${itemNames.rarity[itemSelected.item.rarity]} col-auto`}>
                      <div>{itemSelected.item.name}</div>
                      <div className='row'>
                        <div className='col'>{`(${itemSelected.item.rarity} `}</div>
                        <div className='col'><FontAwesomeIcon icon={faArrowRight} /></div>
                        
                        <div className={`${itemNames.rarity[newRarity]} col`}>{`${newRarity})`}</div>
                        </div>
                    </div>
                  </div>
                
                  {requirement?.tools.length>0 ? 
                  (
                    <>
                      <h4  className='enchantment-text'><FontAwesomeIcon icon={faHammer} /> Werkzeug:</h4>
                      <p className='txt-info'>Verbessert deine Probe</p>
                      <select onChange={(e)=>setTool(e.target.value)}>
                        {requirement?.tools.map((el)=>(
                            <option key={el}>{el}</option>
                          ))}
                        </select>
                
                    </>
                  ):
                  (
                  <Alert msg="Kein Werkzeug im Inventar" type="error"/>
                  )
                  }
                {
                  requirement?.gems.length>0 ? (
                    <>
                      <h4  className='enchantment-text'><FontAwesomeIcon icon={faGem} /> Edelstein:</h4>
                      <p className="txt-info">Ändert die Wertigkeit deines Items</p>
                      <select  onChange={(e)=>setGem(e.target.value)}>
                        {requirement?.gems.map((el)=>(
                          <option key={el}>{el}</option>
                        ))}
                      </select>
                    </>

                  ) : (
                    <Alert msg="Kein Edelstein im Inventar" type="error"/>
                  )
                }

                <h4  className='enchantment-text'><FontAwesomeIcon icon={faHandSparkles} /> Boni:</h4>
                <p className='txt-info'>Füge gewünschtes Boni ein</p>
                <input type="text" onChange={(e)=>setBonus(e.target.value)} value={bonus} placeholder="+5 Charisma"/>
                <div className='row mt-2 border-top '>
                  <div className='col-auto mt-2'>
                    <h4  className='enchantment-text'><FontAwesomeIcon icon={faDiceD20}/> Probe:</h4>
                    <p className='txt-info'>Nicht geschafft? Drücke auf die Taste Misslungen</p>
                  </div>
                </div>
           </div>
          )  
            :
            <div>
              <p>
                Willkommen bei der Verzauberung! Hier kannst du deine Waffen und Rüstungsteile verbessern. <br/> 
                Dafür benötigst Du sowohl einen <strong>Edelstein</strong> als auch ein <strong>Buch der Verzauberung</strong> in deinem Inventar.<br/> 
                Um fortzufahren, schließe dieses Fenster und wähle ein Element zum Verzaubern aus.
              </p>
            </div>
        }
        {
          talent ? <DiceInfo talent={talent} bonus={diceBonus} attr={attr}/>
          : <Alert msg="Du hast keine Punkte in Verzaubern. Wende dich an einen Händler." type="warning"/>
        }
        <div className="row justify-content-center mt-3">
          <div className='col-auto '>
            {
            disabledButton ? 
              <button className='btn-enchantment' disabled>Verzaubern</button> 
              : <button type='submit' className='btn-enchantment'>Verzaubern</button>}</div>
          <div className='col-auto'>
            <button  className='btn-remove' onClick={()=>{
              const id = gem && inventory.find((el)=>el.item.name===gem)?._id
              remove(id)
              reset()
              }}>Misslungen</button></div>
        </div> 
        </form>
      </div>
    </div>
    : ""
  )
}

export default EnchantmentPopup