import React, { useEffect, useCallback, useState} from 'react'
import "../Styles/Inventory.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPenToSquare, faFloppyDisk, faPaw, faPlus, faRefresh,faSearch, faShield, faSuitcase, faHammer, faSeedling, faPerson, faHandSparkles, faCoins, faCircleInfo, faTrash} from '@fortawesome/free-solid-svg-icons'
import NavbarComp from '../components/Navbar';
import {useSelector, useDispatch} from 'react-redux';
import { getItem, reset, search, getGenuses } from '../features/item/itemSlice';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup,  Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { filterEquipment, getWeight, newBalance, toInventory,  updateInventory, deleteItem } from '../features/player/playerSlice';
import Image from 'react-bootstrap/Image'
import EquipmentComponent from '../components/EquipmentComponent';
import Enchantment from '../components/Enchantment'
import InfoListComponent from '../components/InfoListComponent';
import {itemNames} from '../components/ConstVariables';

function InventoryPage() {
  const {items, isLoading, loaded, armorGenuses, weaponGenuses, ressourceGenuses, isError, message} = useSelector((state)=>state.items)
  const {player, weight, loadCapacity} = useSelector((state)=>state.player)
  const {user} = useSelector((state)=>state.auth)
  const [modify, setModify] = useState(false) // activate enchantment
  const [selected, setSelected] = useState({state: false, item:""}) // show additional info in the inventory
  const {genus, rarity} = itemNames
  const [toUpdate, setUpdate] = useState([])
  const [newMoney, updateMoney] = useState(player?.money)
  const [isLoad, setLoad] = useState(false)
  const [searchName, setSearch] = useState("")
  const [edit, activeEdit] = useState(false)
  const [detailsId, setId] = useState(-1)
  const [iFilter, setInventoryFilter] = useState("")
  const origin = player?.general?.origin.split(" ")
  const originName = origin && origin[origin.length-1]
  const [filter, setFilter] = useState("Brust")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
const weightBarCallback = useCallback(()=>{
  console.log("callback - weight changed: ", weight)
  move(weight)
}, [weight])

  const filteredCallback = useCallback(()=>{
    dispatch(filterEquipment())
  }, [dispatch])

  const weightCallback = useCallback(()=>{
    console.log("weightCallback")
    dispatch(getWeight())
    move(weight)
  }, [dispatch])

  const onClickFilter = e => {
    e.preventDefault()
    const filterName = e.currentTarget.name
    console.log(filterName)
    if(filterName === "all"){
      setInventoryFilter("")
    } else {
      setInventoryFilter(filterName)
    }
  }
 useEffect(()=>{
    if(player.inventory){
      console.log("filter useeffect")
      filteredCallback()
      weightCallback()
    }
  },[filteredCallback, player.inventory])

  useEffect(()=>{
    weightBarCallback()
  }, [weight])

  useEffect(()=>{
    console.log("useffect")
    dispatch(getWeight())
  },[dispatch, weight, modify])
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
    }
    if(isLoad){
      dispatch(getItem())
      dispatch(getGenuses())
      
    } else dispatch(reset() )

  }, [user, isLoad, items.length, message, isError, navigate, dispatch])
  // Dismount general info
  const clear = () => {
    setFilter("")
  }

  const getDetails = e => {
    setId(parseInt(e.currentTarget.name))
  }

  const addItem = e => {
    let id = e.currentTarget.name
    dispatch(toInventory({item: items[id].name, amount: 1, status: user.name}))
  }
  const toDelete = e => {
    let id = e.currentTarget.name
    //dispatch(deleteItem(player.inventory[id]._id))
    dispatch(deleteItem(id))
    //dispatch(getPlayer())
  }

  const handleEdit = e => {
    activeEdit(edit => !edit)
    updateMoney(player?.money)
    console.log(newMoney)
  }
  const handleSave = e => {
    e.preventDefault()
    console.log(toUpdate)
    if(toUpdate?.length>0){
      toUpdate.forEach((item)=>dispatch(updateInventory(item)))
    }
    console.log(newMoney, player.money)
    if(newMoney[0]!==player?.money[0] || newMoney[1]!==player?.money[1] || newMoney[2]!==player?.money[2]){
      //console.log("update money")
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
    const value = parseInt(e.target.value)
    updateMoney(newMoney?.map((currency, i)=>(
      i === id ? value : currency
    )))
    console.log(newMoney)
  }
  const move = (weight) =>{
    var elem = document.getElementById("curr-weight");   
    var height = 0;
    const currPercentage = weight / (loadCapacity/100)
    console.log(currPercentage)
    var id = setInterval(frame, 100);
    function frame() {
      if (height >= currPercentage) {
        clearInterval(id);
      } else {
        height++; 
        elem.style.height = height + '%'; 
        //elem.innerHTML = height * 1  + '%';
        elem.innerHTML = `${weight} <br>/<br>${loadCapacity}`
        if(height>=75 && height<90){
          elem.style.backgroundColor = '#f3722c'
        } else if(height>=90 && height<100){
            elem.style.backgroundColor = '#f3722c'
        } else if(height===100){
          elem.style.backgroundColor = '#f94144'
        } else {
          elem.style.backgroundColor = '#90be6d'
        }
      }
    }    
    
  }


  const handleSearch = e => {
    console.log(e.target.value)
    //setSearch(e.target.value)
  }
  const onClickSearch = e => {
    const searchbar = document.getElementById("searchbar")
    if(searchbar.value.length>0){
      setSearch(searchbar.value)
    }
  }

  const clearSearch = () => {
    document.getElementById("Brust").focus()
    document.getElementById("searchbar").value = ""
    setFilter("Brust")
    setSearch("")
  }
  return (
    <div className="dark-bg">
      <div className={`bg ${originName}-bg`}>
    <NavbarComp/>
    <div  className="container-fluid g-5 inventory-page">
    <div className="row mt-3 ">
    <div className="col-lg-auto col-md-12 col-sm-12 h-auto">
      <div className="row mt-5"><button name={user.name} onClick={onClickFilter}><FontAwesomeIcon icon={faSuitcase}/></button></div>
      <div className="row"><button name="Ausgerüstet" onClick={onClickFilter}><FontAwesomeIcon icon={faPerson}/></button></div>
      <div className="row"><button name="Rüstung" onClick={onClickFilter}><FontAwesomeIcon icon={faShield}/></button></div>
      <div className="row"><button name="Waffe" onClick={onClickFilter}><FontAwesomeIcon icon={faHammer}/></button></div>
      <div className="row"><button name="Ressource" onClick={onClickFilter}><FontAwesomeIcon icon={faSeedling}/></button></div>
      <div className="row"><button name="all" onClick={onClickFilter}><FontAwesomeIcon icon={faRefresh}/></button></div>
      <div className="row">
        <div id='weight-progressbar'>
            <div id='curr-weight' style={{height:"0px", backgroundColor: "#90be6d"}}>0</div>
        </div>
      </div>
    </div>
      <div className="col-lg-5 col-md-12 col-sm-12  h-auto">
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
        <div >
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
              const filterCheck = iFilter?.length > 0 && invElement.status === iFilter ? true : iFilter === "" ? true : false
              const categoryCheck = iFilter === "Rüstung" && iFilter === invElement.item.category ? true : iFilter==="Waffe" && iFilter === invElement.item.category ? true :
              iFilter === "Ressource" && iFilter === invElement.item.category ? true : false
              const showElement = filterCheck || categoryCheck
              return r && g && showElement && (
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
                    {edit ? (<td><input id="amount" name={invElement._id} type="number" onChange={handleChange} defaultValue={invElement.amount}/></td>)
                          : <td>{invElement.amount}</td>}
                    {edit ? 
                          (
                          <td>
                            <select id="status" name={invElement._id} defaultValue={invElement.status} onChange={handleChange}>
                              <option>{user.name}</option>
                              <option>Ausgerüstet</option>
                              <option>Begleiter</option>
                            </select>
                          </td>
                          ):
                          (<td>{invElement.status === user.name ? <FontAwesomeIcon icon={faSuitcase} />: invElement.status === "Ausgerüstet" ? <FontAwesomeIcon icon={faPerson}/>: <FontAwesomeIcon icon={faPaw}/>}</td>)}
                    <td><button className="btn-remove" name={invElement._id} onClick={toDelete}><FontAwesomeIcon icon={faTrash}/></button></td>
                  </tr>
              )}
              
              )}
          </tbody>
        </table>
        <div className="row justify-content-end mb-2 col-12">
          {edit? (<div  className="col col-auto border border-2">
                    <div className="row p-2">
                      <div className="col col-2 p-0">
                        <input id="0" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[0]}/>
                      </div>
                      <div className="col" style={{color:"#FF9D00"}}>Gold</div>
                      <div className="col col-2 p-0"><input id="1" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[1]}/></div>
                      <div  className="col" style={{color:"grey"}}>Silber</div>
                      <div className="col col-2 p-0"><input id="2" name="gold" type="number" onChange={moneyChange} defaultValue={player?.money[2]}/></div>
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
        </div>
       )
        }
      </div>
      <div className="col-lg-5 col-md-12 col-sm-12  h-auto" >
       <EquipmentComponent/>
      </div>
    </div>
    <Button className={edit? "disabled mb-2":"mb-2"} variant="dark" onClick={showItems} >{isLoad ? "Schließen": "Item hinzufügen"}</Button>
    {
      loaded? (
        <div className="row">
            <div className="col-12">  
              <input id="searchbar" name="search" type="text"  defaultValue="" onChange={handleSearch}/>
              <button className={originName} onClick={onClickSearch}><FontAwesomeIcon icon={faSearch} /></button>
              <button className={originName} onClick={clearSearch}><FontAwesomeIcon icon={faRefresh} /></button>
             </div>
            <div className="col-12">
              <FontAwesomeIcon icon={faShield}/>
              {armorGenuses?.map((type)=>(
                <button key={type} className={originName} id={type} onClick={(e)=>setFilter(e.target.id)}>{type}</button>
              ))}
              </div>
              <div className="col-12">
                <FontAwesomeIcon icon={faHammer}/>
                {weaponGenuses?.map((type)=>(
                <button  key={type} className={originName} id={type} onClick={(e)=>setFilter(e.target.id)}>{type}</button>
              ))}
              </div>
              <div className="col-12">
                <FontAwesomeIcon icon={faSeedling}/>
                {ressourceGenuses?.map((type)=>(
                <button key={type} className={originName} id={type} onClick={(e)=>setFilter(e.target.id)}>{type}</button>
              ))}
              </div>
              {loaded && <div className="col-lg-4 col-sm-12">
                <table className="w-100" style={{textAlign:"left"}}>
                    <thead>
                      <tr >
                        <th>#</th>
                        <th>Name</th>
                        <th>Typ</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.map((item, ind)=>{
                        const r = rarity[item.rarity]
                        const g = genus && genus[item.genus]
                        const itemGenus = item.genus
                        const filterCheck = filter?.length > 0 && itemGenus === filter && searchName.length===0 ? true : false
                        const searchCheck = searchName?.length>0 && item.name.includes(searchName) ? true : false               
                        const showElement = filterCheck || searchCheck
                        if(showElement){
                          return(
                            <tr key={item._id}>
                              <td className='pb-0'><Image name={item._id} src={`/icons/${r}/${g}xhdpi.png`} onClick={itemSelected}></Image></td>
                              <td >{item.name}</td>
                              <td>{item.type}</td>
                            <td>
                              <ButtonGroup>
                                <Button variant="outline-secondary" name = {ind} onClick = {getDetails}><FontAwesomeIcon icon={faCircleInfo} /></Button>
                                <Button variant="outline-success" name = {ind} onClick = {addItem}><FontAwesomeIcon icon={faPlus} /></Button>
                              </ButtonGroup>
                            </td>
                          </tr>  
                          )
                        } 
                      })}
                    </tbody>
                  </table>
              </div>}
              <div className="col-3">
        {items[detailsId] && detailsId >= 0 && 

          <InfoListComponent item={items[detailsId]}/>
        
      }   
      </div>
        </div>
      ) : (
        <div className="row">
        
      </div>
      )
    }
    </div>
    </div>
    </div>
  )

}

export default InventoryPage