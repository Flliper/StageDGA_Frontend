import { Link } from "react-router-dom";
import '../Styles/Navbar.css';
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Navbar() {
    const authContext = useContext(AuthContext);

    // console.log(authContext.isLoggedIn)

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
            // handle error
        }
    } catch (error) {
        // handle error
    }
}



    return (
    <nav className="navbar">
        <div className="navbar-item">
            <Link to="/">Accueil</Link>
        </div>
        {authContext.isLoggedIn ?
            <>
                {authContext.user && authContext.user.username &&
                    <div className="navbar-item">
                        {authContext.user.username}
                    </div>
                }

                <div className="navbar-item">
                    <Link to="/modification">Modifier les tables</Link>
                </div>

                <button className="button-deconnexion" onClick={authContext.logOut}> Déconnexion </button>
            </>
            :
            <div className="navbar-item">
                <Link to="/connexion">Connexion</Link>
            </div>
        }
    </nav>
);

}

export default Navbar;
