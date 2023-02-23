import React from 'react'
import { floatToArray } from './CurrencyConverters.js'


function SalePopup(props) {
    const {multi, inventory, setHaggle, trigger, setTrigger, sellPrice, balanceToUpdate} = props
    const moneyOffer = floatToArray(sellPrice)
    const info = moneyOffer && `${moneyOffer[0]>0 ? `${moneyOffer[0]} Gold`: ""} ${moneyOffer[1]>0 ? ` ${moneyOffer[1]} Silber`: ""} ${moneyOffer[2]>0 ? `${moneyOffer[2]} Kupfer `: ""}`
    const elsToSell = inventory?.filter(el=>multi.includes(el._id))
    console.log(sellPrice)
    const haggleOptions = 
        [
            {
                name: "5%",
                value: 1.05,
            },
            {
                name: "10%",
                value: 1.1,
            },          
            {
                name: "15%",
                value: 1.15,
            },
            {
                name: "20%",
                value: 1.2,
            },
        ]
    
    const onClose = () => {
        setHaggle(1)
        setTrigger(false)
    }
    return (trigger?
    <div className="blur-bg">
        <div className="popup border">
            <div className='row justify-content-center'>
                <div className='col-auto mb-3 border-bottom'>
                    <h3>Massenverkauf</h3>
                </div>
            </div>
            <h5>Zum Verkaufen:</h5>
            {
                elsToSell?.map((el)=>(
                    <div className="row" key={el._id}>
                        <strong>{`x${el.amount} ${el.item.name}`}</strong>
                    </div>                    
                ))
  
            }
            <h5>{`Angebot: `}<strong>{info}</strong></h5>
            <div className='row'>
                <div className="col-auto m-auto"><h5>Feilschen:</h5></div>
                {
                    haggleOptions.map((haggle)=>(
                        <div className="col" key={haggle.name}>
                            <button id={haggle.name} className="btn-edit" onClick={()=>setHaggle(haggle.value)}>{haggle.name}</button>
                        </div>
                    ))
                }
            </div>
            <div className='row mt-3 justify-content-center'>
                <div className='col-auto'><button className="btn-save" onClick={balanceToUpdate}>Verkaufen</button></div>
                <div className='col-auto'><button className="btn-remove" onClick={onClose}>Abbrechen</button></div>
            </div>
        
        </div> 
    </div>
    :""
  )
}

export default SalePopup