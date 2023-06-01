import React, { useState, useEffect } from "react";
import "../../Styles/Login.css";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { login, register, reset } from "../../features/auth/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { buttonAnimation } from "../../data/Animations";
import { getPlayer } from "../../features/player/playerSlice";
import { motion } from "framer-motion";

function Login() {
  const [formData, setFormData] = useState({ name: "", pwd: "" });
  const { name, pwd } = formData;
  const [setRegistered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, registered, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(reset());
    const userData = {
      name,
      pwd,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      console.log(message, isError);
    }
    if (user && !registered) {
      dispatch(getPlayer());
      navigate("/player");
    } else if (user && registered) {
      navigate("/register");
    } else {
      navigate("/");
    }
    // Set everything to false
  }, [user, registered, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (e) => {
    dispatch(reset());
    const userData = {
      name,
      pwd,
    };
    dispatch(register(userData));
    if (isSuccess) {
      setRegistered(true);
    }
  };

  return (
    <div className="login-page">
      <div className="background">

        <motion.div className="vignette"
          animate={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",

          }}
          initial={{ 
            backgroundColor: "rgba(0, 0, 0, 1)",
          }}
          transition={{ duration: 2 }}
        >
        <motion.h2 className="loading-text"
        animate={{opacity:0, top:"50%"}}
        initial={{ opacity:1, top:"10%"}}
        transition={{ duration: 3 }}
        >
          Dein Abenteuer beginnt jetzt....
        </motion.h2>
          <div
           
            className=""
          >
            <motion.div
              className="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration:1.5 }}
              
            >
              <motion.h2
                animate={{
                  textShadow:"0px 0px 8px rgb(255,255,255)",
                  y:0,
                  
                }}
                transition={{ 
                  duration:1.4, 
                  delay: 4.1,
                }}
                initial={{ y:-100,  textShadow:"0px 0px 8px rgb(251, 255, 0)",}}
                className="header"
              >
                Willkommen in den Dragonlands
              </motion.h2>
              <Form className="p-5 login-form">
                <Form.Group className="pb-2" controlId="formName">
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Name deines Charakters"
                    onChange={onChange}
                    value={name}
                  ></Form.Control>
                </Form.Group>
                <Form.Group className="" controlId="formPassword">
                  <Form.Control
                    name="pwd"
                    type="password"
                    placeholder="Passwort"
                    onChange={onChange}
                    value={pwd}
                  ></Form.Control>
                </Form.Group>
                {isError && 
                <div className="alert error">{message}</div>
                }
                <motion.button
                  className="login-btn"
                  whileHover="hover"
                  variants={buttonAnimation}
                  animate="result"
                  initial="init"
                  transition={{ delay: 4.2 }}
          
                  type="submit"
                  onClick={handleSubmit}
                >
                  Einloggen
                </motion.button>
                <motion.div />
                <motion.button
                  className="register-btn"
                  animate={{ scale: 1 }}
                  initial={{ scale: 0.1 }}
                  transition={{ delay: 4.3 }}
                  onClick={handleRegister}
                >
                  Neuen Charakter erstellen
                </motion.button>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
