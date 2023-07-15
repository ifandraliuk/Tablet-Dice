import React, {useState} from 'react'
import Bar from './Bar';
import {useSelector, useDispatch} from 'react-redux';
import {decreaseBar, increaseBar, resetBars} from '../../features/player/playerSlice'
import {germanAttr} from '../../data/ConstVariables';
import MathButtonGroup from '../../components/MathButtonGroup';


function BarList() {
    const {player} = useSelector((state)=>state.player) 
    const dispatch = useDispatch()
    const {attributes} = player
    const [damage, setDamage] = useState({type: 'Vitalität', val: 0})
    const bar = Object.keys(germanAttr)
    
    const add = e => {
      const category = Object.keys(germanAttr).find(el=>germanAttr[el]===damage.type)
      const value = parseInt(damage.val)
      dispatch(increaseBar({category, value}))
    }
    const subtract = e => {
      const category = Object.keys(germanAttr).find(el=>germanAttr[el]===damage.type)
      const value = parseInt(damage.val)
      dispatch(decreaseBar({category, value}))
    }
    const onChange = e => {
        setDamage((prev)=> ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const onReset = e => {
        dispatch(resetBars())
    }
  return (
    <div className='mt-2'>
      {bar.map((name, i)=>(
        attributes && attributes[name]>0 && <Bar category={name} key={name}/>
      ))}
   
      <div className="row mb-2 mt-2">
        <div className="col-auto pe-0">
        
          <select className="text-capitalize" value={damage.type} name="type"  onChange={onChange}>
            {bar.map((name)=>(
              attributes && attributes[name]>0 && <option id={name} key={name}>{germanAttr[name]}</option>
            ))}
            </select>

          </div>
        <div className="col-auto">
          <input type="number" value={damage.val} name="val" onChange={onChange}></input>
        </div>
        <div>
            <MathButtonGroup add={add} subtract={subtract} onReset={onReset} />
        </div>
      </div>


    </div>
  )
}

export default BarList