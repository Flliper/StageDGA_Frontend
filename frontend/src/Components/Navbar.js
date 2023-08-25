import { Link } from "react-router-dom";
import '../Styles/Navbar.css';
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Navbar() {
    // Utilisation du contexte d'authentification pour accéder à l'état de connexion et aux détails de l'utilisateur.
    const authContext = useContext(AuthContext);

    // Fonction pour gérer la déconnexion de l'utilisateur.
    const handleLogOut = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authContext.user.token}`
                }
            });
            const data = await response.json();
            if (data.detail === 'Success') {
                authContext.logOut();
            } else {
                // Gestion d'erreur en cas de déconnexion échouée
            }
        } catch (error) {
            // Gestion d'erreur pour toute autre erreur (par exemple, un problème réseau)
        }
    }

    return (
        <nav className="navbar">
            {/* Lien vers la page d'accueil */}
            <div className="navbar-item">
                <Link to="/">Accueil</Link>
            </div>

            {/* Si l'utilisateur est connecté, affichez ces éléments */}
            {authContext.isLoggedIn ?
                <>
                    {/* Affiche le nom d'utilisateur s'il est disponible */}
                    {authContext.user && authContext.user.username &&
                        <div className="navbar-item">
                            {authContext.user.username}
                        </div>
                    }

                    {/* Lien vers la page de modification des tables */}
                    <div className="navbar-item">
                        <Link to="/modification">Modifier les tables</Link>
                    </div>
                    {/* Bouton de déconnexion */}
                    <button className="button-deconnexion" onClick={handleLogOut}>Déconnexion</button>
                </>
                :
                // Si l'utilisateur n'est pas connecté, affichez ce lien
                <div className="navbar-item">
                    <Link to="/connexion">Connexion</Link>
                </div>
            }
        </nav>
    );
}

export default Navbar;
