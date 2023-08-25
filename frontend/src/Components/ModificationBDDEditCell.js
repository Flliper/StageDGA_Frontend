// Importations des dépendances, contextes, hooks et styles.
import { AuthContext } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import '../Styles/ModificationBDDEditCell.css';
import axios from "axios";

function ModificationBDDEditCell() {
    // Utilisation du contexte d'authentification pour accéder à l'état de connexion et aux détails de l'utilisateur.
    const authContext = useContext(AuthContext);

    // Hook pour naviguer entre les routes.
    const navigate = useNavigate();

    // Extraction des paramètres de l'URL pour accéder à la base de données, à la table, etc.
    const { bdd, table, primaryColumn, primaryValue, column, value } = useParams();

    // États locaux pour gérer la nouvelle valeur, le message affiché et la valeur actuelle.
    const [newValue, setNewValue] = useState('');
    const [message, setMessage] = useState('');
    const [viewValue, setViewValue] = useState(value);
    const [fadeOut, setFadeOut] = useState(false);

    // Redirection des utilisateurs non connectés vers la page de connexion.
    useEffect(() => {
        if (!authContext.isLoggedIn) {
            navigate('/connexion');
        }
    }, [authContext.isLoggedIn, navigate]);

    // Fonction pour gérer la mise à jour de la cellule.
    const handleUpdate = () => {
        axios.post(`http://localhost:8000/api/${bdd}/updateCell`, {
            bdd, table, primaryColumn, primaryValue, column, newValue
        }, {
            headers: {
                'Authorization': `Token ${authContext.user.token}`
            }
        })
        .then(response => {
            if (response.data.status === "success") {
                setViewValue(newValue);
                setNewValue('');
                setMessage("Opération réussie");
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage("Opération échouée");
                setTimeout(() => setMessage(''), 3000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Rendu du composant.
    return (
        <div className="edit-container">
            <h2>Modifier la cellule</h2>
            <div className="cell-details">
                <p><strong>Table :</strong> {table}</p>
                <p><strong>Colonne :</strong> {column}</p>
                <p><strong>Valeur actuelle :</strong> {viewValue}</p>
            </div>
            <div className="edit-input">
                <input 
                   type="text" 
                   placeholder="Nouvelle valeur" 
                   value={newValue} 
                   onChange={e => setNewValue(e.target.value)} 
                />
                <button onClick={handleUpdate}>Mettre à jour</button>
            </div>
            {message && 
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'} ${fadeOut ? 'fade-out' : ''}`}>
                {message}
            </div>}
        </div>
    )
}

export default ModificationBDDEditCell;
