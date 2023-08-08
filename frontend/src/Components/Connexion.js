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
        // L'authentification a réussi, vous pouvez rediriger l'utilisateur ici.
        logIn({username, token: response.data.token}); // Update your login function to take a token
        setMessage("Vous êtes connecté. Voici votre token : " + response.data.token);
    } else {
      // L'authentification a échoué, vous pouvez afficher un message d'erreur ici.
        setMessage("Erreur d'authentification");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Connectez-vous</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" className="login-input" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="login-input" />
        <button type="submit" className="login-button">Se connecter</button>
        <div className="login-message">{message}</div>
      </form>
      {/*<Link to="/connexion/test">*/}
      {/*   <button> test connexion </button>*/}
      {/*</Link>*/}
    </div>

  );
}

export default Connexion;
