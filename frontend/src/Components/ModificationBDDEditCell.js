import {AuthContext} from "./AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import '../Styles/ModificationBDDEditCell.css';
import axios from "axios";
function ModificationBDDEditCell()
{
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const { bdd, table, primaryColumn,  primaryValue, column, value } = useParams();

    const [newValue, setNewValue] = useState('');
    const [message, setMessage] = useState('');
    const [viewValue, setViewValue] = useState(value);
    const [fadeOut, setFadeOut] = useState(false);


  useEffect(() => {
    if (!authContext.isLoggedIn) {
      navigate('/connexion');
    }
  }, [authContext.isLoggedIn, navigate]);


    // Penser à regarder comment les tables ont été créé pour gérer les modifications de clé primaires
    // ( ON CASCADE, etc ... ), ICI ON A AUCUN POUVOIR POUR LE CHANGER ET AUCUNE VERIFICATION NE PEUT ETRE FAITE
    const handleUpdate = () => {
        axios.post(`http://localhost:8000/api/${bdd}/updateCell`, {
            bdd: bdd,
            table: table,
            primaryColumn: primaryColumn,
            primaryValue: primaryValue,
            column: column,
            newValue: newValue
        },{
        headers: {
            'Authorization': `Token ${authContext.user.token}`
        }
    })
        .then(response => {
            if (response.data.status === "success") {
            setViewValue(newValue)
            setNewValue('')
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


    return (
        <div className="edit-container">
            <h2>Modifier la cellule</h2>
            <div className="cell-details">
                <p><strong>Table :</strong> {table}</p>
                <p><strong>Colonne :</strong> {column}</p>
                <p><strong>Valeur actuelle :</strong> {viewValue}</p>
            </div>
            <div className="edit-input">
                <input type="text" placeholder="Nouvelle valeur" value={newValue} onChange={e => setNewValue(e.target.value)} />
                <button onClick={handleUpdate}>Mettre à jour</button>
            </div>
            { message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'} ${fadeOut ? 'fade-out' : ''}`}>
                {message}
            </div>}
        </div>


    )
}

export default ModificationBDDEditCell;