import React, {useEffect, useState} from 'react'
import { Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Figure from 'react-bootstrap/Figure';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {races, racesList, classList, classDescription, originList, countries} from '../components/ConstVariables';
import {useSelector, useDispatch} from 'react-redux';
import {setInfo, getClass, uploadPicture, createCharacter} from '../features/creation/creationSlice'
import {registationFullfilled} from '../features/auth/AuthSlice'
import {addClass, createGeneral,createAttributes, reset, getPlayer} from '../features/player/playerSlice'
import { useNavigate } from 'react-router-dom';
import Attributes from '../components/Attributes';

function CreateCharacter() { 
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {data, classes, attributes, attrTotal, imageUploaded, dataFilled} = useSelector((state)=>state.creation)
    const {user, registered} = useSelector((state)=>state.auth)
    const [image, targetImage] = useState("")
    useEffect(()=>{
        console.log("data changed: get classes")
        dispatch(getClass())
    }, [data, dispatch])
    useEffect(()=>{
        if(!user|| !registered){
            navigate("/")
        }
    },[])
    useEffect(()=>{
        console.log("data or image status was changed")
        if(dataFilled && imageUploaded){
            dispatch(registationFullfilled())
            dispatch(getPlayer())
            navigate("/player")
        }
    }, [dataFilled, imageUploaded])
    const onChange = e => {
        const name = e.target.name
        if(["age", "haircut", "haircolor", "eyecolor", "more"].includes(name)){
            console.log(name, e.target.value)
            const value = e.target.value
            dispatch(setInfo({name,value}))
        } else{
            console.log(name, e.target.id)
            const value = e.target.id
            dispatch(setInfo({name, value}))
        } 
    }
    
    const setImage = e=> {
        console.log(e.target.files)
        targetImage(e.target.files[0])
    }

    const onSubmit = e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("img",image, `${user.name}.jpeg`)
        const fullInfo = {
            //fullinfo
            age: data.age,
            haircolor: data.haircolor,
            sex: data.sex,
            eyecolor: data.eyecolor,
            origin: data.origin,
            haircut: data.haircut,
            kind: data.kind,
            //userclass
            userclass: data.userclass,
            attributes:attributes,
        }
        console.log(fullInfo)
        dispatch(createCharacter(fullInfo))
        console.log(dataFilled, imageUploaded)
        dispatch(uploadPicture(formData))
        console.log(dataFilled, imageUploaded)

    }
  return (
    <>
    
    <div style={{backgroundImage:"linear-gradient(to right, #0e1c26, #2a454b, #294861)",backgroundPosition:"center", backgroundRepeat: "no-repeat", backgroundAttachment:"fixed", overflow:"auto", backgroundSize:"cover",}}>
        <div style={{backgroundColor:"rgba(0, 0, 0, 0.3)", overflow:"auto", height: "100vh"}}>
            <Form>
            <Container style={{color:"white"}} className=" border border-2 rounded"> 
            <Row>{`Charakter: ${user?.name}`}</Row>  
            {imageUploaded.toString()}{ dataFilled.toString()}
    
            <Row className="m-2"><h5>Du erwachst vom Kitzeln eines Sonnenstrahls auf deiner Haut, du stehst auf und schaust in den Spiegel, welches Gesicht siehst du? (1/5)</h5></Row>    
            <Row>
                <Tabs>
                {racesList.map((art)=>(
                    <Tab  eventKey={art} title={art} key={art}>
                    <Row className="">
                        <Col className="col-3">
                        
                        <Row className='border-radius-2'><Figure><Figure.Image  width={300} height={500} src={`/race/${data.sex ==="männlich"? "m":"w"}/${art}.jpg`}/></Figure></Row>
                        <Row className="m-2"><Button id={art} variant={data?.kind === art ? "warning" : "dark"} name="kind" onClick={onChange}>{data?.kind === art ? "Ausgewählt" : "Wählen"}</Button> </Row>
                        </Col>
                        <Col>
                            <Row className="border-bottom">
                                <Form.Label>Geschlecht</Form.Label>
                                <Form.Check style={{color:`${data.sex==="männlich"? "yellow":""}`}} type="radio" label="männlich" id="männlich" name="sex" onChange={onChange}/>
                                <Form.Check style={{color:`${data.sex==="weiblich"? "yellow":""}`}} type="radio" label="weiblich"  id="weiblich"  name="sex" onChange={onChange}/>
                            </Row>
                            <Row className="mt-2">
                                <h4>Beschreibung</h4>
                                <Container>{races[art].descr}</Container></Row>
                            <Row className="border-top mt-2"><h4>Spezielle Fertigkeit</h4><u>{`${races[art].ability.name}: `}</u>
                            <Container>{races[art].ability.descr}</Container></Row>
                        </Col>
                    </Row>
                </Tab>
                                   
                ))}
                </Tabs>
            </Row>   
            </Container>
            <Container style={{color:"white"}}  className=" border border-2 rounded mt-3">
                <Row className="m-2"><h5>Du denkst zurück an deine Ausbildung, all die Übungsstunden die du verbracht hast, wie hast du dich spezialisiert? (2/5)</h5></Row>
                <Tabs>
                    {classList.map((userclass)=>(
                        <Tab eventKey={userclass} title={userclass} key={userclass}>
                            <Row>
                                <Col className="col-3">
                                <Row><Figure><Figure.Image  src={`/classes_img/${userclass}xxhdpi.png`}/></Figure></Row>
                                <Row className="m-2"><Button id={userclass} variant={data?.userclass === userclass ? "warning" : "dark"} name="userclass" onClick={onChange}>{data?.userclass === userclass ? "Ausgewählt" : "Wählen"}</Button> </Row>
                                </Col>
                                <Col>
                                    <Row className="border-bottom mb-2 mt-2">
                                        <h4>Beschreibung</h4>
                                        <Container>{classDescription[userclass]}</Container>
                                    </Row>
                                    <Row>
                                    <h4>Fertigkeiten</h4>
                                        {classes?.find(el=>el.name===userclass)?.abilities.map((ability)=>(

                                            <Container key={ability.name}><h5>{ability.name}</h5></Container>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                        </Tab>
                    ))}
                </Tabs>
            </Container>
            <Container style={{color:"white"}}  className=" border border-2 rounded mt-3">
                <Row className="m-2"><h5>Du schreitest ans Fenster und siehst hinaus in deine Heimat, vor dir erstreckt sich die Landschaft von? (3/5)</h5></Row>
                <Tabs>
                    {originList.map((country)=>(
                        <Tab eventKey={country} title={country} key={country}>
                            <Row>
                                <Col className="col-4">
                                <Row><Figure><Figure.Image  src={`/origin/${countries[country].img}xhdpi.png`}/></Figure></Row>
                                <Row className="m-2"><Button id={country} variant={data?.origin === country ? "warning" : "dark"} name="origin" onClick={onChange}>{data?.origin === country ? "Ausgewählt" : "Wählen"}</Button> </Row>
                                </Col>
                                <Col><Figure><Figure.Image src="weltkarte.jpg"/></Figure></Col>
                            </Row>
                            <Row><h4>Beschreibung</h4>
                            <Container>{countries[country].descr}</Container></Row>
                        </Tab>
                    ))}
                </Tabs>
            </Container>
            <Container style={{color:"white"}} className=" border border-2 rounded mt-3">
                <Row  className="m-2"><h5>Nach dem Frühstück gehst du noch einmal zum Spiegel um dich für deine Reise fertig zu machen, wie siehst du aus?</h5></Row>
                <Row>
                    <Col className="col-6">
                    <Form.Group>
                    <Form.Label>Alter</Form.Label>
                    <Form.Control type="number" name="age" onChange={onChange}></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Label>Augenfarbe</Form.Label>
                        <Form.Control type="text" name="eyecolor" onChange={onChange}></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-6">
                        <Form.Group>
                            <Form.Label>Frisur</Form.Label>
                            <Form.Control type="text" name="haircut"  onChange={onChange}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-6">
                        <Form.Group>
                            <Form.Label>Haarfarbe</Form.Label>
                            <Form.Control type="text" name="haircolor"  onChange={onChange}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-6">
                        <Form.Group>
                            <Form.Label>Besondere Merkmale</Form.Label>
                            <Form.Control type="text" name="more"  onChange={onChange}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-6">
                        <Form.Group>
                            <Form.Label>Profilbild</Form.Label><br/>
                            <input type="file" name="img" onChange={setImage} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <Container style={{color:"white"}} className=" border border-2 rounded mt-3">
                <Row  className="m-2"><h5>Als du dich auf den Weg machst, um dein Abenteuer zu beginnen, denkst du dir, dass du bestens vorbereitet bist, denn deine Talente sind? (5/5)</h5></Row>
            <Attributes/>
            </Container>
            {/*attrTotal===0 && data.userclass.length>0 && data.origin.length>0 && data.kind.length>0 && */ <Container className="mt-2 mb-3" ><Button type="submit" onClick={onSubmit}>Charakter erstellen</Button></Container>}
            </Form>
        </div>
    </div>
    </>
  )
}

export default CreateCharacter