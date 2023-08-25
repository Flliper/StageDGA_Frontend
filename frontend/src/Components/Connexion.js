// Importations nécessaires pour ce composant
import React, {useContext, useEffect, useState} from 'react'; // Importation des Hooks de React
import axios from 'axios'; // Importation d'axios pour effectuer des requêtes HTTP
import '../Styles/Connexion.css'; // Importation des styles du composant
import { AuthContext } from './AuthContext'; // Importation du contexte d'authentification
import {Link, useNavigate} from 'react-router-dom'; // Importation des outils de navigation de 'react-router-dom'

function Connexion() {
  // Initialisation des états locaux du composant
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [inputInvalid, setInputInvalid] = useState(false);

  // Accès aux fonctions et valeurs du contexte d'authentification
  const { isLoggedIn, logIn } = useContext(AuthContext);

  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // useEffect qui vérifie si l'utilisateur est déjà connecté. Si c'est le cas, il est redirigé vers la page d'accueil
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    // Tentative de connexion via une requête POST vers le serveur
    const response = await axios.post('http://localhost:8000/api/login', {
      username,
      password,
    });

    // Traitement de la réponse du serveur
    if (response.data.status === "success") {
        logIn({username, token: response.data.token}); // Si la connexion réussit, mise à jour du contexte d'authentification
        setMessage("Opération réussie"); // Affichage d'un message de succès
        setTimeout(() => setMessage(''), 3000); // Effacement du message après 3 secondes
    } else {
         setMessage("Erreur d'authentification"); // En cas d'échec, affichage d'un message d'erreur
         setInputInvalid(true); // Indication que les entrées sont invalides
         setTimeout(() => {
             setMessage(''); // Effacement du message d'erreur après 3 secondes
             setInputInvalid(false); // Réinitialisation de l'état d'invalidité des entrées
        }, 3000);
    }
  };

  // Rendu JSX du composant
  return (
  // Container principal pour la page de connexion
  <div className="login-container">

    {/*Titre de la page de connexion*/}
    <h2 className="login-title">Connectez-vous</h2>

    {/*Formulaire de connexion*/}
    <form className="login-form" onSubmit={handleSubmit}>

      {/*Champ d'entrée pour le nom d'utilisateur*/}
      <input
        type="text" // Définit le type d'input comme étant du texte
        value={username} // La valeur actuelle du champ d'entrée est liée à l'état 'username'
        onChange={(e) => setUsername(e.target.value)} // Met à jour l'état 'username' à chaque modification de l'entrée
        placeholder="Nom d'utilisateur" // Texte affiché dans l'input quand il est vide
        className={`login-input ${inputInvalid ? 'invalid-border' : ''}`} // Ajoute une classe CSS en fonction de la validité de l'input
      />

      {/*Champ d'entrée pour le mot de passe*/}
      <input
        type="password" // Définit le type d'input comme étant un champ mot de passe (les caractères saisis sont masqués)
        value={password} // La valeur actuelle du champ d'entrée est liée à l'état 'password'
        onChange={(e) => setPassword(e.target.value)} // Met à jour l'état 'password' à chaque modification de l'entrée
        placeholder="Mot de passe" // Texte affiché dans l'input quand il est vide
        className={`login-input ${inputInvalid ? 'invalid-border' : ''}`} // Ajoute une classe CSS en fonction de la validité de l'input
      />

      {/*Bouton pour soumettre le formulaire*/}
      <button type="submit" className="login-button">Se connecter</button>

      {/*Affiche un message conditionnellement s'il est présent*/}
      { message &&
        <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
          {message}
        </div> }
    </form>

  </div>
);
}

// Exportation du composant pour utilisation ailleurs dans l'application
export default Connexion;
