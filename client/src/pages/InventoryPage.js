import React, { useEffect, useCallback, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPenToSquare, faFloppyDisk, faPaw, faPlus, faSuitcase, faPerson, faHandSparkles, faCoins, faCircleInfo} from '@fortawesome/free-solid-svg-icons'
import NavbarComp from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import { getItem, reset } from '../features/item/itemSlice';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup,  Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { filterEquipment, getArmor, newBalance, toInventory, updateInventory, deleteItem } from '../features/player/playerSlice';
import CloseButton from 'react-bootstrap/CloseButton';
import Image from 'react-bootstrap/Image'
import EquipmentComponent from '../components/EquipmentComponent';
import Enchantment from '../components/Enchantment'
import InfoListComponent from '../components/InfoListComponent';
import {itemNames} from '../components/ConstVariables';

function InventoryPage() {
  const {items, isLoading, isError, message} = useSelector((state)=>state.items)
  const {player, equipped} = useSelector((state)=>state.player)
  console.log(equipped)
  const {user} = useSelector((state)=>state.auth)
  const [modify, setModify] = useState(false) // activate enchantment
  const [selected, setSelected] = useState({state: false, item:""}) // show additional info in the inventory
  const {genus, rarity} = itemNames
  const [toUpdate, setUpdate] = useState([])
  const [newMoney, updateMoney] = useState([0,0,0])
  const [isLoad, setLoad] = useState(false)
  const [edit, activeEdit] = useState(false)
  const [detailsId, setId] = useState(-1)
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  let categories = []
  let genuses = []
  items.map((item) => {
    return !categories.includes(item.category) && categories.push(item.category)})  
  items.map((item) => {
      return !genuses.includes(item.genuses) && genuses.push(item.genuses)})  
  const [filter, setFilter] = useState({category: categories, genus: genuses})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const filteredCallback = useCallback(()=>{
    dispatch(filterEquipment())
  }, [dispatch])

  const armorCallback = useCallback(()=>{
    dispatch(getArmor())
  }, [dispatch])


 useEffect(()=>{
    console.log("useffect render")
    if(player.inventory){
      filteredCallback()
    }

  },[filteredCallback, player.inventory])
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
    }
    if(isLoad){
      dispatch(getItem())
    } else dispatch(reset() )

  }, [user, isLoad, message, isError, navigate, dispatch])
  // Dismount general info
  const clear = () => {
    setFilter({category: categories, genus: genuses})
  }
  const filterGenuses = (category) => {
    let out = []
    if(filter.category.length < categories.length){
    items?.map((item)=>{
      return !out.includes(item.genus) && category.includes(item.category) && out.push(item.genus)
    })
  }
    return out
  }
  const getDetails = e => {
    setId(parseInt(e.currentTarget.name))
  }

  const addItem = e => {
    let id = e.currentTarget.name
    dispatch(toInventory({item: items[id].name, amount: 1, status: user.name}))
    //dispatch(getPlayer())
  }
  const toDelete = e => {
    let id = e.target.name
    //dispatch(deleteItem(player.inventory[id]._id))
    dispatch(deleteItem(id))
    //dispatch(getPlayer())
  }

  const handleEdit = e => {
    activeEdit(edit => !edit)
  }
  const handleSave = e => {
    e.preventDefault()
    console.log(toUpdate)
    if(toUpdate){
      toUpdate.forEach((item)=>dispatch(updateInventory(item)))
    }
    if(newMoney[0]!==0 || newMoney[1]!==0 || newMoney[2]!==0){
      console.log("update money")
      dispatch(newBalance(newMoney))
    }
    if(!player.isError)
      activeEdit(edit=>!edit)
    setLoad(false)
    
  }
  const handleChange = e => {
    console.log(`id: ${e.target.id} value: ${e.target.value} name: ${e.target.name}`)
    let flag = false
    if(toUpdate.length > 0) {
      console.log("searching for an item...")
      let id = toUpdate.findIndex(item=>item.item===e.target.name)
      console.log(id)
      console.log(toUpdate[id])
      if(id >= 0){
        setUpdate(toUpdate.map((item, i)=>{
          if(i === id){
            console.log("found! ", item)
            flag = true
            let newItem = {
              item: e.target.name, 
              amount: e.target.id === "amount"? e.target.value : item.amount,
              status: e.target.id === "status" ? e.target.value : item.status
            }
            console.log(`new item: ${newItem}`)
            console.log(newItem)
            return newItem
          } else return item
        }))
      }
      if(!flag){
        setUpdate(toUpdate => [...toUpdate, {item:e.target.name,  [e.target.id]: e.target.value}])
        console.log("new element...")
  
      }
    }  else {
      setUpdate([{item:e.target.name, [e.target.id]: e.target.value}])

    }
    //const id = selected.findIndex(el=>el.name === e.target.id)
    if(isLoading || player.isLoading){
      return <Spinner  animation="border"/>
    }
  }
  const itemSelected = e => {
    console.log(e.target.name)
    if(e.target.name){
      setSelected({state:!selected.state, item:e.target.name})
    }
    
  }
  const showItems = e => {
    e.preventDefault()
    setLoad(isLoad=>!isLoad)
  }
  const handleModify = () => {
    setModify(modify=>!modify)
  }
  const moneyChange = e => {
    console.log(e.target.id, e.target.value)  
    const id = parseInt(e.target.id)
    const value = e.target.value
    updateMoney(newMoney.map((currency, i)=>(
      i === id ? value : currency
    )))
  }

  return (
    <div className="dark-bg">
      <div className={`bg ${originName}-bg`}>
    <NavbarComp/>
    <div  className="container-fluid g-5">
    <div className="row mt-3">
      <div className="col-lg-6 col-md-12 col-sm-12  h-auto">
      {player?.inventory && player.inventory.length === 0 ?
       (
        <Card>
        <Card.Header>Inventar</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>...</ListGroup.Item>
        </ListGroup>
      </Card>
       ) : 
       (
        <Form >
          <ButtonGroup>
            <Button variant={edit? "info": "dark"} className={modify? "disabled": ""} onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></Button>
            <Button variant={modify? "info": "secondary"} style={{hoverOverlay:"#8685EF"}} className={edit? "disabled": ""} onClick={handleModify}><FontAwesomeIcon icon={faHandSparkles} /></Button>
            <Button className={edit ? "":"disabled"} variant="outline-secondary"  onClick={handleSave} type="submit"><FontAwesomeIcon icon={faFloppyDisk} /></Button>
            </ButtonGroup>
        {modify && <Alert variant="info">Verzaubern: zum Verzaubern eines Gegenstandes klicke auf das Icon</Alert> } 
        <table className='w-100 text-align-left'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Anzahl</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {player?.inventory && player.inventory.map((invElement)=>{
              const r = invElement.enchantment? rarity[invElement.enchantment.rarity] : rarity[invElement.item.rarity]
              const g = genus && genus[invElement.item.genus]
              return r && g && (
                  <tr key={invElement._id} name={invElement._id} onClick={itemSelected}>
                  
                   <td className='pb-0'><Image name={invElement.item.name} src={`/icons/${r}/${g}xhdpi.png`} onClick={itemSelected}></Image></td>
                   
                    <td><strong>{invElement.item.name}</strong>
                    {modify ? (
                            selected?.state && selected.item === invElement.item.name &&
                       <Enchantment id={invElement._id} handleModify={handleModify}/>
                    ) : (
                      selected?.state && selected.item === invElement.item.name &&

                  <InfoListComponent item={invElement.item} enchantment={invElement.enchantment}/>
                    ) 
                    }
                    </td>
                    {edit ? (<td><Form.Control id="amount" name={invElement._id} type="number" onChange={handleChange} defaultValue={invElement.amount}></Form.Control></td>)
                          : <td>{invElement.amount}</td>}
                    {edit ? 
                          (
                          <td>
                            <Form.Select id="status" name={invElement._id} defaultValue={invElement.status} onChange={handleChange}>
                              <option>{user.name}</option>
                              <option>Ausgerüstet</option>
                              <option>Begleiter</option>
                            </Form.Select>
                          </td>
                          ):
                          (<td>{invElement.status === user.name ? <FontAwesomeIcon icon={faSuitcase} />: invElement.status === "Ausgerüstet" ? <FontAwesomeIcon icon={faPerson}/>: <FontAwesomeIcon icon={faPaw}/>}</td>)}
                    <td><CloseButton name={invElement._id} onClick={toDelete}/></td>
                  </tr>
              )}
              
              )}
          </tbody>
        </table>
        <div className="row justify-content-end mb-2 col-12">
          {edit? (<div  className="col col-auto border border-2">
                    <div className="row p-2">
                      <div className="col col-2 p-0">
                        <Form.Control id="0" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[0]}></Form.Control>
                      </div>
                      <div className="col" style={{color:"#FF9D00"}}>Gold</div>
                      <div className="col col-2 p-0"><Form.Control id="1" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[1]}></Form.Control></div>
                      <div  className="col" style={{color:"grey"}}>Silber</div>
                      <div className="col col-2 p-0"><Form.Control id="2" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[2]}></Form.Control></div>
                      <div  className="col" style={{color:"#B34219"}}>Kupfer</div>
                    </div>
          </div>) :
          (<div className="col col-auto me-0 ">
            <div className="row p-2">
              <div className="col-auto pe-1"><FontAwesomeIcon icon={faCoins} /></div>
              <div className="col-auto p-0" style={{color:"#FF9D00"}} >{`${player?.money ? player.money[0] : 0} Gold`}</div>
              <div className="col-auto p-0" style={{color:"grey"}}>{`, ${player?.money ? player.money[1] : 0} Silber`}</div>
              <div className="col-auto p-0" style={{color:"#B34219"}}>{`, ${player?.money ? player.money[2] : 0} Kupfer`}</div>
             </div></div>)}
        </div>
        </Form>
       )
        }
      </div>
      <div className="col-lg-6 col-md-12 col-sm-12  h-auto" >
       <EquipmentComponent/>
      </div>
    </div>
    <Button className={edit? "disabled mb-2":"mb-2"} variant="dark" onClick={showItems} >{isLoad ? "Schließen": "Item hinzufügen"}</Button>
    {isLoad &&
    <>
    <div className="row">
      <div className="col-lg-8 col-sm-12 col-md-12"> 
      <ButtonGroup>
      {categories.map((category)=>(  
        <Button key={category} type="radio" variant="dark" name={category} onClick={e=>{setFilter({...filter, category: [e.target.name]})}}>{category}</Button>
      ))} 
      <Button variant="outline-secondary" type="reset" onClick={clear}>Löschen</Button> 
    </ButtonGroup>
    <ButtonGroup >
    {filterGenuses(filter.category).map((genus)=>{
        return(
        <Button key={genus} variant="secondary" name={genus} onClick={e=>{setFilter({...filter, genus: [e.target.name]})}}>{genus}</Button>
      )})}
    </ButtonGroup>
      </div>
    </div>
    <Form>
      <div className='row'> 
        <div className="col-lg-4 col-md-12 col-sm-12"> 
          <table className="w-100">
          <thead>
            <tr >
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item,ind)=>(
              /*if (selected.genus.includes(items[ind].genus) && selected.category.includes(items[ind].category)){*/
                (filter.genus.includes(item.genus)  ) && 
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                      <ButtonGroup>
                        <Button variant="outline-secondary" name = {ind} onClick = {getDetails}><FontAwesomeIcon icon={faCircleInfo} /></Button>
                        <Button variant="outline-success" name = {ind} onClick = {addItem}><FontAwesomeIcon icon={faPlus} /></Button>
                      </ButtonGroup>
                    </td>
                  </tr>  
            ))}
          </tbody>
        </table>
        </div>
        <div className="col">
          {items[detailsId] && detailsId >= 0 ? (
            <Card style={{ width: '18rem' }} >
            <Card.Header>{items[detailsId].name}</Card.Header>
            <InfoListComponent item={items[detailsId]}/>
          </Card>
          ) : (<Card style={{ width: '18rem' }}>
            <Card.Header>Erweitert</Card.Header>
            <ListGroup variant="flush">
            <ListGroup.Item>...</ListGroup.Item>
            </ListGroup>
          </Card>)
          
        }   
        </div>
        
      </div>
    </Form>
    </> 
    }
    </div>
    </div>
    </div>
  )

}

export default InventoryPage