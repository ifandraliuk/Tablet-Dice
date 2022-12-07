import React from 'react'
import Container  from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Figure from 'react-bootstrap/Figure'
import ListGroup from 'react-bootstrap/ListGroup'
import {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button'

//TO DELETE

function CharacterSheet() {
    const MAX = 70
    const AllClasses = ['Waffenschmied', 'Schildwache', 'Waldläufer', 
    'Assasine', 'Arkan Magier', 'Druide', 'Monk', 'Kleriker']
    //const ManaClasses = ['Arkan Magier', 'Druide'] //Nekromant
    //const SpiritClasses = ['Monk', 'Kleriker']
    const AttributeNames = ['Stärke', 'Gechicklichkeit', 'Intelligenz', 'Vitalität', 'Ausdauer', 'Charisma', 'Mana', 'Spirituelle Kraft']
    const [stamina, setStamina] = useState(0)
    const [vitality, setVitality] = useState(0)
    const [mana, setMana] = useState(0)
    const [spirit, setSpirit] = useState(0)
    const [pointsLeft, setPointsLeft] = useState(MAX)
    const [kind, setKind] = useState("")
    const [type, setType] = useState("")
    const [attr, setAttr] = useState([
        {
            id: 0,
            name: "strength",
            val: 0
        },
        {
            id: 1,
            name: "dexterity",
            val: 0
        },
        {
            id: 2,
            name: "intelligent",
            val: 0
        },
        {
            id: 3,
            name: "vitality",
            val: 0
        },
        {
            id: 4,
            name: "stamina",
            val: 0
        },
        {
            id: 5,
            name: "charm",
            val: 0
        },
        {
            id: 6,
            name: "mana",
            val: 0
        },
        {
            id: 7,
            name: "spirit",
            val: 0
        }
    ])
    const [mainInfos, setMainInfos] = useState({
            name: '', age: 0, haircolor: '', sex:'männlich', eyecolor: '', origin: '', more: '', haircut: ''
        })
    useEffect(() => {
        let sumofAttr = 0
        attr.forEach(els =>{
            if(els.val)
                sumofAttr += parseInt(els.val)
        })
        setPointsLeft(MAX - sumofAttr)
        console.log(sumofAttr)
    }, [attr]) 

    useEffect(()=>{
        //let manaId = attr.map(v=>v.name).indexOf('mana')
        let spiritId = attr.map(v=>v.name).indexOf('spirit')
        if(!document.getElementById("spiritLabel").classList.contains('disabled')){
            setSpirit(parseInt(attr[spiritId].val)*10)
            console.log("spirit was changed")
        } 

    }, [kind, type])

/*     const changeType = e => {
        console.log(e.target.id)
        let id = e.target.id
        let mana =  document.getElementById("manaLabel")
        let spirit = document.getElementById("spiritLabel")
        if(ManaClasses.includes(id)){
            console.log("It's a mana class")
            let manaEls = document.getElementById("manaLabel")
            console.log(manaEls)
            if(mana.classList.contains("disabled")){ 
                mana.classList.remove("disabled")
            }
            spirit.classList.add("disabled")
        } else if (SpiritClasses.includes(id)) {
            console.log("It's a spirit class")
            if(spirit.classList.contains("disabled")){
                spirit.classList.remove("disabled")
            }
            mana.classList.add("disabled")
        } else{
            console.log("It's a non-magic class")
            if(!spirit.classList.contains("disabled")){
                spirit.classList.add("disabled")
            }
            if(!mana.classList.contains("disabled")){
                mana.classList.add("disabled")
            }           
        }
    } */
    const updateAttrs = id => e => {
        console.log(id)
        console.log(e.target.value)
        let newData = [...attr]
        //newData[id] = {prev => ({val: e.target.value})
        newData[id].val = parseInt(e.target.value)
        setAttr(newData)
        if (id === attr.map(v=>v.name).indexOf('vitality')){
            console.log("vitality was changed")
            setVitality(parseInt(newData[id].val)*10)
        } else if(id === attr.map(v=>v.name).indexOf('stamina')){
            console.log("stamina was changed")
            setStamina(parseInt(newData[id].val)*10)
        } else if (id === attr.map(v=>v.name).indexOf('mana')){
            let mana = document.getElementById("manaLabel")
            if(!mana.classList.contains('disabled')){
                setMana(parseInt(newData[id].val)*10)
                console.log("mana was changed")
            }
        } else if(id === attr.map(v=>v.name).indexOf('spirit')){
            let spirit = document.getElementById("spiritLabel")
            if(!spirit.classList.contains('disabled')){
                setSpirit(parseInt(newData[id].val)*10)
                console.log("spirit was changed")
            }
        }
        console.log(attr)
    }

    const handleSubmit = (event) => {
        console.log("it's running")
        event.preventDefault()
        console.log(kind)
        console.log(type)
        console.log(attr)
        console.log(mainInfos)
    }

    const set = key => {
        return ({target: {value}}) => setMainInfos(prev => ({...prev, [key]: value}))
            
    }
  return (
    <Container className="mt-3 mb-3">
        <Row>
            <Col className="border-red col-8">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" value={mainInfos.name} onChange={set("name")} placeholder="..."/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="age">
                            <Form.Label>Alter</Form.Label>
                            <Form.Control type="number" value={mainInfos.age} onChange={set("age")} placeholder="..."/>
                        </Form.Group>
                        
                    </Row>
                    <Row>
                    <Form.Group as={Col} controlId="haircolor">
                            <Form.Label>Haarfarbe</Form.Label>
                            <Form.Control type="text" value={mainInfos.haircolor} onChange={set("haircolor")}placeholder="..."/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="sex">
                            <Form.Label>Geschlecht</Form.Label>
                            <Form.Select value={mainInfos.sex} onChange={set("sex")}>
                                <option>männlich</option>
                                <option>weiblich</option>
                            </Form.Select>
                        </Form.Group>                        
                    </Row>
                    <Row>
                    <Form.Group as={Col} controlId="eyes">
                            <Form.Label>Augenfarbe</Form.Label>
                            <Form.Control type="text" value={mainInfos.eyecolor} onChange={set("eyecolor")}placeholder="..."/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="origin">
                            <Form.Label>Herkunft</Form.Label>
                            <Form.Control value={mainInfos.origin} onChange={set("origin")} placeholder="..."/>
                        </Form.Group>                        
                    </Row>
                    <Row>
                    <Form.Group as={Col} controlId="more">
                            <Form.Label>Besondere Merkmale</Form.Label>
                            <Form.Control type="text" value={mainInfos.more} onChange={set("more")}placeholder="..."/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="haircut">
                            <Form.Label>Frisur</Form.Label>
                            <Form.Control value={mainInfos.haircut} onChange={set("haircut")} placeholder="..."/>
                        </Form.Group>      
                                          
                    </Row>
                    <Row className="mt-2">
                        <Col  className="col-4">
                        <h4>Klasse</h4>
                        {AllClasses.map((type) => (
                            <div key={`${type}`} className="mb-3">
                            <Form.Check 
                                type="radio"
                                id={`${type}`}
                                name="class-names"
                                label={`${type}`}
                                onChange={e=>{setType(e.target.id)}}
                            />
                            </div>
                        ))}
                        </Col>
                        <Col  className="col-4">
                        <h4>Art</h4>
                        {['Mensch', 'Zwerg', 'Elf', 
                        'Ork', 'Halbling', 'Gnom', 'Kobold'].map((type) => (
                            <div key={type} className="mb-3">
                            <Form.Check 
                                type="radio"
                                id={`${type}`}
                                name="kind-names"
                                label={`${type}`}
                                required
                                onChange={e => {setKind(e.target.id)}}
                            />
                            </div>
                        ))}                 
                        </Col>
                        <Col  className="col-4">
                            <ListGroup>
                                <ListGroup.Item>Gold: 0</ListGroup.Item>
                                <ListGroup.Item>Trefferpunkte: {`${vitality}`}</ListGroup.Item>
                                <ListGroup.Item>Ausdauer: {`${stamina}`}</ListGroup.Item>
                                <ListGroup.Item id="manaLabel" disabled>Mana: {`${mana}`}</ListGroup.Item>
                                <ListGroup.Item id="spiritLabel" disabled>Spirituelle Kraft: {`${spirit}`}</ListGroup.Item>
                                <ListGroup.Item>Rüstungswert: </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <h4>Attribute {`(${pointsLeft})`}</h4>
                        {attr.map((attribute, index) => (
                            <Form.Group controlId={attribute.name} key={index}>
                                <Form.Label>{AttributeNames[parseInt(index)]}</Form.Label>
                                <Form.Control type="number" placeholder="0" value={attr.val} onChange={updateAttrs(index)}/>
                            </Form.Group>
                        ))}


                    </Row>
                    <Button className="outline-primary justify-content-end" type="submit">Speichern</Button> 
                </Form>
            </Col>
            <Col className="bg-blue"><Figure><Figure.Image width={300} height={400} src="character_default_img.png" ></Figure.Image> </Figure></Col>
        </Row>

    </Container>
  )
}

export default CharacterSheet