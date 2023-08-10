import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import {Link, useNavigate, useParams} from 'react-router-dom';
import '../Styles/ModificationBDD.css'

function ModificationBDD() {

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { bdd, table, primaryColumn,  primaryValue, column, value } = useParams();

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      navigate('/connexion');
    }
  }, [authContext.isLoggedIn, navigate]);



  return (
        <div className="container">
            <h1>Bienvenue sur la page de modification des Bases de donnée</h1>
            <Link className="redirection-button" to="/">Modifier une case</Link>
            <Link className="redirection-button" to="/modification/manageTable" > Créer / Renommer / Supprimer une table </Link>
            <Link className="redirection-button" to="/modification/manageColumn" > Ajouter / Renommer / Supprimer une colonne </Link>
            <Link className="redirection-button" to="/modification/manageRow" > Ajouter / Supprimer une ligne </Link>
        </div>
    );
}

export default ModificationBDD;
