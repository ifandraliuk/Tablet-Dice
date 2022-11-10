import React, {Fragment, useEffect, useMemo, useState} from 'react'
import NavbarComp from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import { getItem, reset } from '../features/item/itemSlice';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import { Button, ButtonGroup, Container, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { getPlayer, toInventory, updateInventory, deleteItem } from '../features/player/playerSlice';
import CloseButton from 'react-bootstrap/CloseButton';
import Figure from 'react-bootstrap/Figure';
import Collapse from 'react-bootstrap/Collapse';
import EquippedItem from '../components/EquippedItem';

function InventoryPage() {
  const {items, isLoading, isError, message} = useSelector((state)=>state.items)
  const {player} = useSelector((state)=>state.player)
  const {user} = useSelector((state)=>state.auth)
  const [equipped, setEquipment] = useState([{category: "Kopf", max: 1, equipment: {}}, {category: "Beine", max: 1, equipment: {}},{category: "Hals", max: 1, equipment: {}}, {category: "Brust", max: 1, equipment: {}}])
  const [toUpdate, setUpdate] = useState([])
  const [isLoad, setLoad] = useState(false)
  const [toExpand, setExpand] = useState({kopf: false, beine:false}) // expand info about equipped item
  const [edit, activeEdit] = useState(false)
  const [detailsId, setId] = useState(-1)
  let categories = []
  let genus = []
  Object.keys(items).map((ind) => {
    return !categories.includes(items[ind].category) && categories.push(items[ind].category)})  
  Object.keys(items).map((ind) => {
      return !genus.includes(items[ind].genus) && genus.push(items[ind].genus)})  
  const [selected, setSelect] = useState({category: categories, genus: genus})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
    }
    dispatch(getPlayer())
    if(isLoad){
      dispatch(getItem())
    } else dispatch(reset() )

    return () => {
      dispatch(reset())
    } 
  }, [user, isLoad, message, isError, navigate, dispatch])
  useEffect(()=>{
    if(player?.inventory && player.inventory.findIndex(el=>el.status === "Ausgerüstet")>=0){
        player?.inventory && player.inventory.forEach((invItem)=> {
          if(invItem.status === "Ausgerüstet"){
            console.log(invItem)
            console.log("found the element to equip")
            if(equipped.length > 0){
              const equipmentId = equipped.findIndex(el=>el.category === invItem.item.genus)
              console.log(equipmentId)
            if(equipmentId >= 0 && equipped[equipmentId].max === 1){
              console.log("only one element in this category allowed: update value")
              setEquipment(e=>e.map((item, id)=>{
                if(id === equipmentId){
                  const newItem = {category: item.category, max: item.max, equipment:invItem}
                  console.log("found where to change")
                  console.log(newItem)
                  return newItem
                } else return item
              }))
            }}
          }
          
        })
  }
  }, [player.inventory])
  // Dismount general info
  const clear = () => {
    setSelect({category: categories, genus: genus})
  }
  const filterGenuses = (category) => {
    let out = []
    if(selected.category.length < categories.length){
    Object.keys(items).map((index)=>{
      return !out.includes(items[index].genus) && category.includes(items[index].category) && out.push(items[index].genus)
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
    isLoad(false)
    
  }
  const handleChange = e => {
    console.log(`id: ${e.target.id} value: ${e.target.value} name: ${e.target.name}`)
    let flag = false
    if(toUpdate.length > 0) {
      console.log("searching for an item...")
      let id = toUpdate.findIndex(item=>item.name===e.target.name)
      console.log(id)
      console.log(toUpdate[id])
      if(id >= 0){
        setUpdate(toUpdate.map((item, i)=>{
          if(i === id){
            console.log("found! ", item)
            flag = true
            let newItem = {
              item: item.name, 
              amount: e.target.id === "amount"? e.target.value : item.amount,
              status: e.target.id === "status" ? e.target.value : item.status
            }
            console.log(`new item: ${newItem}`)
            return newItem
          } else return item
        }))
      }
      if(!flag){
        setUpdate(toUpdate => [...toUpdate, {item:e.target.name,  [e.target.id]: e.target.value}])
        console.log("new element...")
        console.log(toUpdate)
      }
    }  else {
      setUpdate([{item:e.target.name, [e.target.id]: e.target.value}])
      console.log(toUpdate)
    }
    //const id = selected.findIndex(el=>el.name === e.target.id)
    if(isLoading || player.isLoading){
      return <Spinner  animation="border"/>
    }
    
  }
  const showItems = () => {
    setLoad(isLoad=>!isLoad)
  }
  return (
    <Container fluid>
    <NavbarComp/>
    <Row className="mt-3">
      <Col>
      {player?.inventory && player.inventory.length < 0 ?
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
            <Button variant="dark" onClick={handleEdit}>Bearbeiten</Button>
            <Button className={edit? "":"disabled"} variant="secondary"  onClick={handleSave} type="submit">Speichern</Button>
            </ButtonGroup>
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
                  <tr key={invElement._id}>
                   <td className='pb-0'><Figure ><Figure.Image className='mb-0' src={`/icons/${invElement.item.genus}xhdpi.png`}/></Figure></td>
                    <td>{`${invElement.item.name}`}</td>
                    {edit ? (<td><Form.Control id="amount" name={invElement.item.name} type="number" onChange={handleChange} defaultValue={invElement.amount}></Form.Control></td>)
                          : <td>{invElement.amount}</td>}
                    {edit ? 
                          (
                          <td>
                            <Form.Select id="status" name={invElement.item.name} defaultValue={invElement.status} onChange={handleChange}>
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
      <Col className="border border-2 h-auto">
        <Row className="justify-content-around ">
        <Col className="col-3 w-auto border border-primary">Rücken</Col>
              <Col className="col-3 w-auto border border-primary p-0">
                <EquippedItem  equipment={equipped[equipped.findIndex(el=>el.category==="Kopf")].equipment?.item}/>              
              </Col>
          <Col className="col-3 w-auto  border p-0 border-primary"><EquippedItem  equipment={equipped[equipped.findIndex(el=>el.category==="Hals")].equipment?.item}/></Col>
        </Row>
        <Row className="justify-content-between">
          <Col className="col-3 align-self-start border border-primary"><EquippedItem  equipment={equipped[equipped.findIndex(el=>el.category==="Brust")].equipment?.item}/></Col>
          <Col className="col-3 align-self-end border border-primary">Arme</Col>
        </Row>
        <Row className="justify-content-between">
          <Col className="col-3 align-self-start border border-primary">Haupthand</Col>
          <Col className="col-3 align-self-end border border-primary">Nebenhand</Col>
        </Row>
        <Row className="justify-content-center">
        <Col className="col-3 border border-primary">Füße</Col>
          <Col className="col-3 border border-primary"><EquippedItem  equipment={equipped[equipped.findIndex(el=>el.category==="Beine")].equipment?.item}/></Col>
          <Col className="col-3 border border-primary">Hüfte</Col>
        </Row>
        <Row className="justify-content-center">
        <Col className="col-3 border border-primary">Finger 1</Col>
          <Col className="col-3 border border-primary">Finger 2</Col>
        </Row>
      </Col>
    </Row>
    <Button className={edit? "disabled mb-2":"mb-2"} variant="dark" onClick={showItems} >{isLoad ? "Schließen": "Item hinzufügen"}</Button>
    {isLoad &&
    <>
    <Row>
      <Col> 
      <ButtonGroup>
      {categories.map((category)=>(  
        <Button key={category} type="radio" variant="dark" name={category} onClick={e=>{setSelect({...selected, category: [e.target.name]})}}>{category}</Button>
      ))} 
      <Button variant="outline-secondary" type="reset" onClick={clear}>Löschen</Button> 
    </ButtonGroup>
    <ButtonGroup>
    {filterGenuses(selected.category).map((genus)=>{
        return(
        <Button key={genus} variant="secondary" name={genus} onClick={e=>{setSelect({...selected, genus: [e.target.name]})}}>{genus}</Button>
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
                (selected.genus.includes(item.genus)  || selected.category.includes(item.category)) && 
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
            <ListGroup variant="flush">
              <ListGroup.Item>{`Kategorie: ${items[detailsId].category}`}</ListGroup.Item>
              <ListGroup.Item>{`Gattung: ${items[detailsId].genus}`}</ListGroup.Item>
              <ListGroup.Item>{`Typ: ${items[detailsId].type}`}</ListGroup.Item>
               <ListGroup.Item>{`Preis: ${items[detailsId].price}`}</ListGroup.Item>
               <ListGroup.Item>{`Boni: ${items[detailsId].bonuses}`}</ListGroup.Item>
               <ListGroup.Item>{`Wertigkeit: ${items[detailsId].rarity}`}</ListGroup.Item>
               <ListGroup.Item>{`${items[detailsId].category === "Waffe" ? "Schaden" : "Widerstand"}: ${items[detailsId].dice}`}</ListGroup.Item>
              <ListGroup.Item>{`${items[detailsId].category === "Waffe" ?  "Reichweite" : "Rütungswert"}: ${items[detailsId].value}`}</ListGroup.Item>
              <ListGroup.Item>{`Gewicht: ${items[detailsId].weight}`}</ListGroup.Item>
            </ListGroup>
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
  )
}

export default InventoryPage