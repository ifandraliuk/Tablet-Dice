import React, {useState, useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, Link } from 'react-router-dom';
import {login, reset} from '../features/auth/AuthSlice'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({name:"", pwd:""})
    const {name, pwd} = formData
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, msg} = useSelector((state)=>state.auth)
    
    //styles
    const loginContainer = {
       // backgroundColor: "red",
        marginTop: 5,
        padding: 10,
        display: "grid",
        alignItems: "center",

    }
    
    const handleSubmit = e => {
        e.preventDefault()
        const userData = {
            name,
            pwd,
        }
        dispatch(login(userData))
    }

    useEffect(()=>{
        if(isError) {
            toast.error(msg)
        }
        if(isSuccess || user) {
            navigate('/player')
        } else {
            navigate('/')
        }
        // Set everything to false
        dispatch(reset())
    }, [user, isError, isSuccess, msg, navigate, dispatch])

    const onChange = e => {
        setFormData((prev) =>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
  return (
    
    <Container className="col-md-12 col-sm-12 col-lg-5 rounded mt-5 d-flex justify-content-center align-items-center bg-light">
        {/* style={loginContainer}*/}
        <Row>
            <Col>
            <h4>Willkommen in Dragonlands!</h4>
                <Form className="">
                    <Form.Group className=''controlId='formName'>
                        <Form.Label>Gib deinen Namen ein</Form.Label>
                        <Form.Control name="name" type="text" placeholder='...' onChange={onChange} value={name}></Form.Control>
                    </Form.Group>
                    <Form.Group className=''controlId='formPassword'>
                        <Form.Label>Gib dein Passwort ein</Form.Label>
                        <Form.Control name="pwd" type="password" placeholder='...' onChange={onChange} value={pwd}></Form.Control>
                    </Form.Group>
                    <Button  variant='dark mt-2 col-12' type="submit" onClick={handleSubmit}>Einloggen</Button>
                    <Button as={Link} to="/register" variant='outline-dark mt-2 col-12'>Neuen Charakter erstellen</Button>
                </Form>
            </Col>
        </Row>
</Container>
 )
}

export default Login;