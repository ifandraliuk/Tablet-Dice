import React from 'react'

function SalePopup(props) {
  return (props.trigger?
    <div className="blur-bg">
        <div className="popup border">
            <div className='row'>
                <div className='col-8 '>
                    <h3>Massenverkauf</h3>
                </div>
            </div>
            <br/>
            <div className="row">
                <h5>{`Angebot: `}<strong>{props.sellPrice}</strong></h5>
                
            </div>
            <br/>
            <div className='row'>
                <div className="col-auto m-auto"><h5>Feilschen:</h5></div>
                {
                    ["5%", "10%", "15%", "20%"].map((multiplier)=>(
                        <div className="col" key={multiplier}>
                            <button id={multiplier} className="btn-edit">{multiplier}</button>
                        </div>
                    ))
                }
            </div>
            <div className="row"><h5>Ergebnis:</h5></div>
            <div className='row mt-3'>
                <div className='col'></div>
                <div className='col-auto'><button className="btn-save">Verkaufen</button></div>
                <div className='col-auto'><button className="btn-remove">Abbrechen</button></div>
            </div>
        
        </div> 
    </div>
    :""
  )
}

export default SalePopup