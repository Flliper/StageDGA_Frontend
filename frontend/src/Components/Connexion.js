import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import '../Styles/Connexion.css';
import { AuthContext } from './AuthContext';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';

function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [inputInvalid, setInputInvalid] = useState(false);
  const { isLoggedIn, logIn } = useContext(AuthContext);
  const navigate = useNavigate();


   useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:8000/api/login', {
      username,
      password,
    });

    if (response.data.status === "success") {
        logIn({username, token: response.data.token});
        setMessage("Opération réussie");
        setTimeout(() => setMessage(''), 3000);
    } else {
         setMessage("Erreur d'authentification");
         setInputInvalid(true);
         setTimeout(() => {
             setMessage('');
             setInputInvalid(false);
        }, 3000);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Connectez-vous</h2>
      <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
        className={`login-input ${inputInvalid ? 'invalid-border' : ''}`}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className={`login-input ${inputInvalid ? 'invalid-border' : ''}`}
      />

        <button type="submit" className="login-button">Se connecter</button>
        { message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
              {message}
            </div> }
      </form>
      {/*<Link to="/connexion/test">*/}
      {/*   <button> test connexion </button>*/}
      {/*</Link>*/}
    </div>

  );
}

export default Connexion;
