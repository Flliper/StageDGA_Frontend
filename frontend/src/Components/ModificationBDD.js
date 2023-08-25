// Importation des bibliothèques, hooks, contexte et styles nécessaires.
import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../Styles/ModificationBDD.css';

function ModificationBDD() {

  // Utilisation du contexte pour obtenir l'état de connexion de l'utilisateur.
  const authContext = useContext(AuthContext);

  // Hook pour naviguer entre les routes.
  const navigate = useNavigate();

  // Extraction des paramètres de l'URL.
  const { bdd, table, primaryColumn, primaryValue, column, value } = useParams();

  // Side effect pour rediriger les utilisateurs non connectés vers la page de connexion.
  useEffect(() => {
    if (!authContext.isLoggedIn) {
      navigate('/connexion');
    }
  }, [authContext.isLoggedIn, navigate]);

  // Le rendu du composant.
  return (
        <div className="container">
            {/* Titre de la page */}
            <h1>Bienvenue sur la page de modification des Bases de donnée</h1>

            {/* Bouton pour naviguer vers la page de modification d'une cellule de la base de données. */}
            <Link className="redirection-button" to="/">Modifier une case</Link>

            {/* Bouton pour naviguer vers la page de gestion des tables (création, renommage, suppression). */}
            <Link className="redirection-button" to="/modification/manageTable" > Créer / Renommer / Supprimer une table </Link>

            {/* Bouton pour naviguer vers la page de gestion des colonnes (ajout, renommage, suppression). */}
            <Link className="redirection-button" to="/modification/manageColumn" > Ajouter / Renommer / Supprimer une colonne </Link>

            {/* Bouton pour naviguer vers la page de gestion des lignes (ajout, suppression). */}
            <Link className="redirection-button" to="/modification/manageRow" > Ajouter / Supprimer une ligne </Link>
        </div>
    );
}

// Exportation du composant pour une utilisation ailleurs dans l'application.
export default ModificationBDD;
