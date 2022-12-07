import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {setEnchantment, deleteItem} from '../features/player/playerSlice';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
function Enchantment(props) {
  const {player} = useSelector((state)=>state.player) 
  const dispatch = useDispatch()
  const [requirement, setRequirement] = useState()
  const [gem, setGem] = useState("")
  const [tool, setTool] = useState("")
  const [bonus, setBonus] = useState("")
  
  const findRequirements = () => {
      let gems = [], tools = []
      player?.inventory.map((el)=>(
        !gems.includes(el.item._id) && el.item.genus==="Sonstige" ? gems.push(el.item.name) : el
      ))
      player?.inventory.map((el)=>(
        !tools.includes(el.item._id) && el.item.genus==="Werkzeug" && el.item.name.includes("Verzauberung") && tools.push(el.item.name)
      ))
      console.log(gems, tools)
      setGem(gems[0])
      setTool(tools[0])
      return {gems:gems, tools: tools}
   }
  useEffect(()=>{
    if(player?.inventory){
      const req =  findRequirements()
      setRequirement(req)
      console.log("useEffect is active")
    }
  },[player?.inventory])

  const handleChange = e => {
    if(e.target.id === "gem"){
      setGem(e.target.value)
    } else if (e.target.id === "tool"){
      setTool(e.target.value)
    } else {
      setBonus(e.target.value)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(gem)
    console.log(requirement.gems[0])
    const gemsId = player?.inventory.findIndex(el=>el.item.name===gem)
    console.log(player?.inventory[gemsId].item.rarity)
    const gemsRarity = player?.inventory[gemsId].item?.rarity
    console.log(player?.inventory[gemsId].item.rarity)
    if(!gemsRarity){
      console.log("rarity not found")
    } else {
      console.log(player?.inventory[gemsId].item.rarity)
      console.log("to delete: ", player?.inventory[gemsId])
      const enchantment = {
        id: props.id,
        rarity: gemsRarity,
        bonuses: bonus
      }
      console.log(enchantment)
      dispatch(setEnchantment(enchantment))
      dispatch(deleteItem(player?.inventory[gemsId]._id))
      props.handleModify()
    }

  }
  return (
    <>
    
      {requirement?.gems.length > 0 ? (
        <Form.Group>
          <Form.Label>Edelstein</Form.Label>
          <Form.Select id="gem" value={gem} onChange={handleChange}>
            {player?.inventory.filter(el=>requirement.gems.includes(el.item.name)).map((el)=>(
              <option key={el._id} style={{color: el.item.rarity==="selten" ? "orange" :
                el.item.rarity==="magisch"? "green" :
                el.item.rarity==="episch" ? "blue":
                el.item.rarity==="legendär"? "red" :
                el.item.rarity==="einzigartig"? "deep-purple" : "gray"}}>{el.item.name}</option>
            ))}
          </Form.Select>
          <Form.Text>Ändert die Wertigkeit deines Items</Form.Text>
          </Form.Group>          
      ): (<Alert variant='danger'>Keine Edelsteine im Inventar</Alert>)}
      {requirement?.tools.length > 0 ? (
        <Form.Group>
          <Form.Select id="tool"  value={tool} onChange={handleChange}>
            {player?.inventory.filter(el=>requirement.tools.includes(el.item.name)).map((el)=>(
              <option key={el._id}>{el.item.name}</option>
            ))}
          </Form.Select> 
          <Form.Text>Es wird ein magisches Buch benötigt</Form.Text>
          </Form.Group>       
      ): (
        <Alert variant='danger'>Keine Werkzeuge im Inventar</Alert>
      )}
      <Form.Group>
        <Form.Label>Bonus</Form.Label>
      <Form.Control type="String" id="bonus" placeholder="Charisma +5" value={bonus} onChange={handleChange}></Form.Control>
      <Form.Text>Füge gewünschtes Boni ein</Form.Text>
      </Form.Group>
    <Button className={requirement?.gems.length>0 && requirement?.tools.length>0 && bonus.length>0 ? "":"disabled"}  variant="warning" onClick={handleSubmit}>Verzaubern</Button>
    </>
  )
}

export default Enchantment