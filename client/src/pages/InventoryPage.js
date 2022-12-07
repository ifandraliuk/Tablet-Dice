import React, { useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPenToSquare, faFloppyDisk, faHandSparkles, faCircleInfo} from '@fortawesome/free-solid-svg-icons'
import NavbarComp from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import { getItem, reset } from '../features/item/itemSlice';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import { Button, ButtonGroup, Container, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { getPlayer, filterEquipment, getArmor, getBonis, toInventory, updateInventory, deleteItem } from '../features/player/playerSlice';
import CloseButton from 'react-bootstrap/CloseButton';
import Image from 'react-bootstrap/Image'
import EquipmentComponent from '../components/EquipmentComponent';
import Enchantment from '../components/Enchantment'
import InfoListComponent from '../components/InfoListComponent';


function InventoryPage() {
  const {items, isLoading, isError, message} = useSelector((state)=>state.items)
  const {player, equipped} = useSelector((state)=>state.player)
  const {user} = useSelector((state)=>state.auth)
  const [modify, setModify] = useState(false) // activate enchantment
  const [selected, setSelected] = useState({state: false, item:""}) // show additional info in the inventory

  const [toUpdate, setUpdate] = useState([])
  const [isLoad, setLoad] = useState(false)
  const [edit, activeEdit] = useState(false)
  const [detailsId, setId] = useState(-1)
  let categories = []
  let genus = []
  items.map((item) => {
    return !categories.includes(item.category) && categories.push(item.category)})  
  items.map((item) => {
      return !genus.includes(item.genus) && genus.push(item.genus)})  
  const [filter, setFilter] = useState({category: categories, genus: genus})
  const navigate = useNavigate()
  const dispatch = useDispatch()
 useEffect(()=>{
    console.log("useffect render")
    if(player.inventory){
      dispatch(filterEquipment())
      dispatch(getArmor())
    }

  },[player.inventory])
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
    setFilter({category: categories, genus: genus})
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
    setId(parseInt(e.target.name))
  }

  const addItem = e => {
    let id = e.target.name
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

  return (
    <>
     <Container style={{color:"white"}} fluid>
    <NavbarComp/>
    <Row className="mt-3">
      <Col className="h-auto">
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
        <Form>
          <ButtonGroup>
            <Button variant={edit? "info": "dark"} className={modify? "disabled": ""} onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></Button>
            <Button variant={modify? "info": "secondary"} className={edit? "disabled": ""} onClick={handleModify}><FontAwesomeIcon icon={faHandSparkles} /></Button>
            <Button className={edit ? "":"disabled"} variant="outline-secondary"  onClick={handleSave} type="submit"><FontAwesomeIcon icon={faFloppyDisk} /></Button>
            </ButtonGroup>
        {modify && <Alert variant="info">Verzaubern: zum Verzaubern eines Gegenstandes klicke auf das Icon</Alert> } 
        <Table hover>
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
            {player?.inventory && player.inventory.map((invElement)=>(
                  <tr key={invElement._id} name={invElement._id} onClick={itemSelected}>
                  
                   <td className='pb-0'><Image name={invElement.item.name} src={`/icons/${invElement.enchantment? invElement.enchantment.rarity : invElement.item.rarity}/${invElement.item.genus}xhdpi.png`} onClick={itemSelected}></Image></td>
                   
                    <td>{invElement.item.name}
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
                          (<td>{invElement.status}</td>)}
                    <td><CloseButton name={invElement._id} onClick={toDelete}/></td>
                  </tr>
                )
              
            )}
          </tbody>
        </Table>
        </Form>
       )
    }
      </Col>
      <Col className="h-auto" >
       <EquipmentComponent/>
      </Col>
    </Row>
    <Button className={edit? "disabled mb-2":"mb-2"} variant="dark" onClick={showItems} >{isLoad ? "Schließen": "Item hinzufügen"}</Button>
    {isLoad &&
    <>
    <Row>
      <Col> 
      <ButtonGroup>
      {categories.map((category)=>(  
        <Button key={category} type="radio" variant="dark" name={category} onClick={e=>{setFilter({...filter, category: [e.target.name]})}}>{category}</Button>
      ))} 
      <Button variant="outline-secondary" type="reset" onClick={clear}>Löschen</Button> 
    </ButtonGroup>
    <ButtonGroup>
    {filterGenuses(filter.category).map((genus)=>{
        return(
        <Button key={genus} variant="secondary" name={genus} onClick={e=>{setFilter({...filter, genus: [e.target.name]})}}>{genus}</Button>
      )})}
    </ButtonGroup>
      </Col>
    </Row>
    <Form>
      <Row>
        <Col>
          <Table striped hover>
          <thead>
            <tr>
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
                        <Button variant="outline-secondary" name = {ind} onClick = {getDetails}>Erweitern</Button>
                        <Button variant="outline-success" name = {ind} onClick = {addItem}>Hinzufügen</Button>
                      </ButtonGroup>
                    </td>
                  </tr>  
            ))}
          </tbody>
        </Table>
        </Col>
        <Col>
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
        </Col>
        
      </Row>
    </Form>
    </> 
    }
    </Container>
    </>
  )

}

export default InventoryPage