// Importation des bibliothèques et modules nécessaires
import React, {useContext, useEffect} from 'react';  // Importation de React, useContext (qui semble inutilisé ici) et useEffect
import { Link } from 'react-router-dom'; // Importation du composant Link de react-router-dom pour la navigation
import dataiku from "../Assets/dataiku-logo.svg";  // Importation du logo de Dataiku depuis les assets
import microsoft from "../Assets/microsoft-access-logo.svg";  // Importation du logo de Microsoft Access depuis les assets
import sqlite from "../Assets/sqlite-logo.svg";  // Importation du logo de SQLite depuis les assets
import '../Styles/Accueil.css';  // Importation des styles associés à ce composant

// Définition du composant Accueil
function Accueil({setSelectedTable, setTableNames, setFilters, setSort}) {

    // Ce useEffect est exécuté juste après le montage du composant dans le DOM
    useEffect(() => {
        // Initialisation des états à des valeurs par défaut lorsque le composant est monté
        setSelectedTable("");      // Réinitialisation de la table sélectionnée
        setTableNames([]);         // Réinitialisation des noms de tables
        setFilters({});            // Réinitialisation des filtres
        setSort({column: null, order: null});  // Réinitialisation du tri
    }, [setSelectedTable, setTableNames]);  // Les fonctions de mise à jour de l'état sont ajoutées comme dépendances (bien que techniquement elles ne changent jamais)

    // Rendu du composant
    return (
        <div className="accueil-container">
            {/* Lien vers la page "/northwind" avec un fond représentant SQLite */}
            <Link to="/northwind">
                <div className="bdd-container" style={{backgroundImage: `url(${sqlite})`}}></div>
            </Link>
            {/* Lien vers la page "/chinook" avec un fond représentant Dataiku */}
            <Link to="/chinook">
                <div className="bdd-container" style={{backgroundImage: `url(${dataiku})`}}></div>
            </Link>
            {/* Lien vers la page "/northwindAccess" avec un fond représentant Microsoft Access */}
            <Link to="/northwindAccess">
                <div className="bdd-container" style={{backgroundImage: `url(${microsoft})`}}></div>
            </Link>
        </div>
    );
}

// Exportation du composant pour qu'il puisse être utilisé ailleurs dans l'application
export default Accueil;
