import React, { useState, useEffect } from "react";
import "../../Styles/Login.css";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../features/auth/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import originColors from "../../data/OriginColors";

const originGradient = `linear-gradient(90deg, ${Object.values(originColors).join(", ")})`;

function Login() {
  const [formData, setFormData] = useState({ name: "", pwd: "" });
  const { name, pwd } = formData;
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
      localStorage.clear()
    }
    if (user && !registered) {
      //dispatch(getPlayer());
      navigate("/player");
    } else if (user && registered) {
      navigate("/register");
    } else {
      navigate("/");
      localStorage.clear()

    }
    // Set everything to false
  }, [user, registered, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="login-page">
      <div className="background">
        <div className="vignette">
          <section className="login-card" aria-labelledby="login-title" style={{ "--login-origins": originGradient }}>
            <header className="login-card__header">
              <span className="login-card__eyebrow">Tablet &amp; Dice</span>
              <h1 id="login-title">Willkommen in den Dragonlands</h1>
              <p>Dein Abenteuer wartet. Melde dich mit deinem Charakter an.</p>
            </header>
            <Form className="login-form" onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Charaktername</Form.Label>
                <Form.Control name="name" type="text" placeholder="Name deines Charakters" autoComplete="username" onChange={onChange} value={name} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Passwort</Form.Label>
                <Form.Control name="pwd" type="password" placeholder="Passwort" autoComplete="current-password" onChange={onChange} value={pwd} />
              </Form.Group>
              {isError && <div className="login-form__error" role="alert">{message}</div>}
              <button className="login-btn" type="submit"><span>Einloggen</span><span className="login-btn__arrow" aria-hidden="true">→</span></button>
            </Form>
            <div className="login-card__register">
              <span>Noch keinen Charakter?</span>
              <button className="register-btn" type="button" onClick={() => navigate("/create")}>Neuen Charakter erstellen <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;
