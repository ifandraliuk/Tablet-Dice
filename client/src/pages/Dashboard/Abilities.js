import React from 'react'
import  Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {decreaseBar} from '../../features/player/playerSlice'
import {useSelector, useDispatch} from 'react-redux';
import AbilityCard from './AbilityCard';



function ClassList() {
  const {player} = useSelector((state)=>state.player)
  const abilities = player?.userclass.abilities
  const spec=[]
  const counts = {};
    // count the amount of cards for each specialization
    Object.keys(abilities).map((ind) => {
      return spec.push(abilities[ind].specialization)})
    spec.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });  

  const dispatch = useDispatch()

  const useAbility = e => {
    console.log("I was called")
    console.log(e.target.name)
    const ability = abilities?.find(el=>el._id===e.target.name)
    console.log(ability)
    //const abilityIndex = e.target.name
    const category =ability.type
    const value = ability.price
    dispatch(decreaseBar({category,value}))
  }
  return (
    <Container style={{color:"black"}}>
        <Tabs justify>
          {Object.keys(counts).map((el)=>(
            <Tab eventKey={el} title={el} key={el}>
              <div  className=" mt-3 mb-2 ">
                <div className="row">
                {Object.keys(abilities).map((ind)=>{                
                  return abilities[ind].specialization === el && (            
                <div className={counts[el] > 3 ? 'col col-md-3 col-12': 'col-md-4 col-12'} key={abilities[ind].name}>
                  <AbilityCard key={abilities[ind]._id} ability={abilities[ind]} userclass={player?.userclass?._id} useAbility={useAbility}/>
                </div>
                )})}
            </div>
            </div>
            </Tab>
          ))}        
        </Tabs>
    </Container>
  )
}

export default ClassList