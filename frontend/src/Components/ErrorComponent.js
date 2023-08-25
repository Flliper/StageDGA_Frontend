// Importation des bibliothèques et des styles nécessaires
import React from 'react';
import "../Styles/ErrorComponent.css";

// Définition du composant ErrorComponent
function ErrorComponent(props) {
    return (
        // Container principal pour le composant d'erreur
        <div className="error-container">

            {/*Affiche le message d'erreur fourni via les props, sinon affiche "Page non trouvée"*/}
            <h2>{props.message || "Page non trouvée"}</h2>

            {/*Explication supplémentaire pour l'utilisateur*/}
            <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>

            {/*Bouton pour revenir à la page précédente*/}
            <button onClick={() => window.history.back()}>Retour</button>
        </div>
    );
}

// Exportation du composant pour qu'il puisse être utilisé ailleurs dans l'application
export default ErrorComponent;

