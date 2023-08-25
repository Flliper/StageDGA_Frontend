import React, {useContext, useEffect, useState} from 'react';
import "../Styles/SignUp.css"
import axios from "axios";
// Import du contexte d'authentification pour obtenir le token de l'utilisateur
import {AuthContext} from "./AuthContext";

function SignUp() {
    // État pour gérer l'action actuelle (ajout ou suppression d'utilisateur)
    const [action, setAction] = useState('');

    // États pour gérer les champs du formulaire d'inscription
    const [username, setUsername] = useState('');
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    // État pour afficher les messages à l'utilisateur
    const [message, setMessage] = useState('');

    // Récupération du contexte d'authentification
    const authContext = useContext(AuthContext);

    // Fonction pour valider le format de l'e-mail
    const validateEmail = (email) => {
        const regex = /^(.+)@(gmail\.com|intradef\.gouv\.fr)$/;
        return regex.test(email);
    }

    // Gestion de l'opération (ajout/suppression)
    const handleOperation = () => {
        const userData = {
            username: username,
            usernameToDelete: usernameToDelete,
            email: email,
            password: password1,
            action: action
        };

        // Appel API pour s'inscrire
        axios.post('http://localhost:8000/api/signup', userData, {
            headers: {
                'Authorization': `Token ${authContext.user.token}`
            }
        })
        .then(response => {
            if (response.data && response.status === 201) {
                // Réinitialisation des champs après succès
                action === "add" ? setMessage("Inscription réussie") : setMessage("Suppression réussie");
                setUsername('');
                setUsernameToDelete('');
                setEmail('');
                setPassword1('');
                setPassword2('');
            } else {
                action === "add" ? setMessage("Inscription échouée") : setMessage("Suppression échouée");
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    // Écouteur d'effet pour effacer le message après un certain temps
    useEffect(() => {
        let timeoutId;
        if (message !== '') {
            timeoutId = setTimeout(() => setMessage(''), 3000);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [message]);

    // JSX pour le rendu
    return (
        <div className="container-formulaire-user">
            <div className="block-formulaire-user">
                <h2>Que voulez-vous faire?</h2>
                <div className="user-buttons">
                    {/* Boutons pour choisir l'action */}
                    <button
                        className={`user-button ${action === 'add' ? 'active' : ''}`}
                        onClick={() => setAction(action === 'add' ? '' : 'add')}>
                        Ajouter un utilisateur
                    </button>
                    <button
                        className={`user-button ${action === 'delete' ? 'active' : ''}`}
                        onClick={() => setAction(action === 'delete' ? '' : 'delete')}>
                        Supprimer un utilisateur
                    </button>
                </div>
            </div>

            {/* Formulaire d'ajout */}
            {action === 'add' && (
                <div>
                    {/* Inputs pour les détails de l'utilisateur */}
                    <button className="button-submit" onClick={ () => {
                        if (action === 'add' && !validateEmail(email)) {
                            setMessage("L'adresse e-mail doit être soit de type '@gmail.com' soit '@intradef.gouv.fr'");
                        } else {
                            handleOperation();
                        }
                    }}>
                        Ajouter
                    </button>
                </div>
            )}

            {/* Formulaire de suppression */}
            {action === 'delete' && (
                <div>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={usernameToDelete}
                        onChange={e => setUsernameToDelete(e.target.value)}
                    />
                    <button className="button-submit" onClick={handleOperation}>
                        Supprimer
                    </button>
                </div>
            )}

            {/* Affichage des messages */}
            { message &&
                <div className={`message ${message === 'Inscription réussie' ? 'success' : 'error'}`}>
                  {message}
                </div>
            }
        </div>
    );
}

export default SignUp;
