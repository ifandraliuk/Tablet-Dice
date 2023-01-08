import React, {useState, useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useNavigate, } from 'react-router-dom';
import {login, register,  reset} from '../features/auth/AuthSlice'
import {useSelector, useDispatch} from 'react-redux'
import Alert from 'react-bootstrap/Alert';
import { getPlayer} from '../features/player/playerSlice';
function Login() {
    const [formData, setFormData] = useState({name:"", pwd:""})
    const {name, pwd} = formData
    const [registering, setRegistered] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user,registered, isError, isSuccess, message} = useSelector((state)=>state.auth)
    
    const handleSubmit = e => {
        e.preventDefault()
        dispatch(reset())
        const userData = {
            name,
            pwd,
        }
        dispatch(login(userData))
    }

    useEffect(()=>{
        if(isError) {
            
            console.log(message, isError)
        }
        if(( user) && !registered) {
            dispatch(getPlayer())
            navigate('/player')
        } else if( user && registered){
            navigate("/register")
        }
            else {
            navigate('/')
        }
        // Set everything to false

    }, [user,registered,  isError, isSuccess, message, navigate, dispatch])

    const onChange = e => {
        setFormData((prev) =>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleRegister = e => {
        dispatch(reset())
        const userData = {
            name,
            pwd,
        }
        dispatch(register(userData))
        if(isSuccess){
            setRegistered(true)
           
        }
    }
  return (
   
    <div style={{backgroundImage:"url(/dragonlangs-landscape.svg)", backgroundSize:"cover", height: "100vh",
}}>
        <div style={{backgroundColor:"rgba(0, 0, 0, 0.6)", height: "100vh"}}> 
    <Container style={{color:"white"}} className="col-md-12 col-sm-12 col-lg-5 d-flex align-items-center h-100 g-0">
        {/* style={loginContainer}*/}
            <Container className="justify-content-center border border-2 rounded">
            <h2 className='text-center pt-5  border-bottom'><strong>Willkommen in den Dragonlands</strong></h2>
                <Form className="p-5">
                    <Form.Group className='pb-2'controlId='formName'>
                        <Form.Control name="name" type="text" placeholder='Name deines Charakters' onChange={onChange} value={name}></Form.Control>
                    </Form.Group>
                    <Form.Group className=''controlId='formPassword'>
                        <Form.Control name="pwd" type="password" placeholder='Passwort' onChange={onChange} value={pwd}></Form.Control>
                    </Form.Group>
                    {isError && <Alert variant="danger">{message}</Alert>}
                    <Button  variant='dark mt-2 col-12' type="submit" onClick={handleSubmit}>Einloggen</Button>
                    <Button variant='outline-light mt-2 col-12' onClick={handleRegister}>Neuen Charakter erstellen</Button>
                </Form>
            </Container>
</Container>
</div>
</div>
 )
}

export default Login;