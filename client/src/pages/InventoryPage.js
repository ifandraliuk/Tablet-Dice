import React, {Fragment, useEffect, useState} from 'react'
import NavbarComp from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import { getItem, reset } from '../features/inventory/inventorySlice';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { getPlayer, toInventory, updateInventory, deleteItem } from '../features/player/playerSlice';
import CloseButton from 'react-bootstrap/CloseButton';
import Figure from 'react-bootstrap/Figure';

function InventoryPage() {
  const {inventory, isLoading, isError, message} = useSelector((state)=>state.inventory)
  const {player} = useSelector((state)=>state.player)
  const {user} = useSelector((state)=>state.auth)
  const [toUpdate, setUpdate] = useState([])
  const [edit, activeEdit] = useState(false)
  const [detailsId, setId] = useState(-1)
  let categories = []
  let genus = []
  Object.keys(inventory).map((ind) => {
    return !categories.includes(inventory[ind].category) && categories.push(inventory[ind].category)})  
  Object.keys(inventory).map((ind) => {
      return !genus.includes(inventory[ind].genus) && genus.push(inventory[ind].genus)})  
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
    dispatch(getItem())

    return () => {
      dispatch(reset())
    } 
  }, [user, message, ])
  
  // Dismount general info
  const clear = () => {
    setSelect({category: categories, genus: genus})
  }
  const filterGenuses = (category) => {
    let out = []
    if(selected.category.length < categories.length){
    Object.keys(inventory).map((index)=>{
      return !out.includes(inventory[index].genus) && category.includes(inventory[index].category) && out.push(inventory[index].genus)
    })
  }
    return out
  }
  const getDetails = e => {
    setId(parseInt(e.target.name))
    console.log(e.target.name, detailsId)
  }

  const addItem = e => {
    let id = e.target.name
    dispatch(toInventory({item: inventory[id].name, amount: 1, status: user.name}))
    //dispatch(getPlayer())
  }
  const toDelete = e => {
    console.log(e.target.name)
    let id = e.target.name
    dispatch(deleteItem(player.inventory[id]._id))
    //dispatch(getPlayer())
  }

  const handleEdit = e => {
    activeEdit(edit => !edit)
  }
  const handleSave = e => {
    console.log(toUpdate)
    
  }
  const handleChange = e => {
    console.log(`id: ${e.target.id} value: ${e.target.value} name: ${e.target.name}`)
    if(toUpdate.length > 0) {
      console.log("searching for an item...")
    }  else {
      setUpdate([{name:e.target.name, [e.target.id]: e.target.value}])
    }
    //const id = selected.findIndex(el=>el.name === e.target.id)
    
  }
  return (
    <Container fluid>
    <NavbarComp/>
    <Row className="mt-3">
      <Col>
      {player && player.inventory && player.inventory.length < 0 ?
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
        <Table>
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
            {player && player.inventory && Object.keys(player.inventory).map((ind)=>{
              
                return (
                  <tr key={player.inventory[ind]._id}>
                    {player.inventory[ind].item.category === "Rüstung" && <td><Figure ><Figure.Image src="/icons/Helmxhdpi.png"/></Figure></td>}
                    
                    {player.inventory[ind].item.category==="Waffe" && <td className='pb-0'><Figure className='mb-0'><Figure.Image width={48} height={48} src={`/icons/${player.inventory[ind].item.genus}xhdpi.png`}/></Figure></td>}
                    {player.inventory[ind].item.category==="Ressource" && <td><Figure><Figure.Image src="/icons/ressource-framedxhdpi.png"/></Figure></td>}
                    <td>{player.inventory[ind].item.name}</td>
                    {edit ? (<td><Form.Control id="amount" name={player.inventory[ind].item.name} type="number" onChange={handleChange} defaultValue={player.inventory[ind].amount}></Form.Control></td>):<td>{player.inventory[ind].amount}</td>}
                    {edit? (<td>
                      <Form.Select id="status" name={player.inventory[ind].item.name} defaultValue={player.inventory[ind].status} onChange={handleChange}>
                        <option>{user.name}</option>
                        <option>Ausrüsten</option>
                        <option>Begleiter</option>
                      </Form.Select>
                      </td>):(<td>{player.inventory[ind].status}</td>)}
                    <td><CloseButton name={ind} onClick={toDelete}/></td>
                  </tr>
                )
              
            })}
          </tbody>
        </Table>
        </Form>
       )
    }
      </Col>
      <Col></Col>
    </Row>
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
          <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(inventory).map((ind)=>{
              if (selected.genus.includes(inventory[ind].genus) && selected.category.includes(inventory[ind].category)){
              
                return (
                  <tr key={ind}>
                    <td>{inventory[ind].name}</td>
                    <td>
                      <ButtonGroup>
                        <Button variant="outline-secondary" name = {ind} onClick = {getDetails}>Erweitern</Button>
                        <Button variant="outline-success" name = {ind} onClick = {addItem}>Hinzufügen</Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                )}
            })}
          </tbody>
        </Table>
        </Col>
        <Col>
          {inventory[detailsId] && detailsId >= 0 ? (
            <Card style={{ width: '18rem' }} >
            <Card.Header>{inventory[detailsId].name}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>{`Kategorie: ${inventory[detailsId].category}`}</ListGroup.Item>
              <ListGroup.Item>{`Gattung: ${inventory[detailsId].genus}`}</ListGroup.Item>
              <ListGroup.Item>{`Typ: ${inventory[detailsId].type}`}</ListGroup.Item>
              <ListGroup.Item>{`Preis: ${inventory[detailsId].price}`}</ListGroup.Item>
               <ListGroup.Item>{`${inventory[detailsId].category === "Waffe" ? "Schaden" : "Widerstand"}: ${inventory[detailsId].dice}`}</ListGroup.Item>
              <ListGroup.Item>{`${inventory[detailsId].category === "Waffe" ?  "Reichweite" : "Rütungswert"}: ${inventory[detailsId].value}`}</ListGroup.Item>
              <ListGroup.Item>{`Gewicht: ${inventory[detailsId].weight}`}</ListGroup.Item>
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
    </Container>
  )
}

export default InventoryPage