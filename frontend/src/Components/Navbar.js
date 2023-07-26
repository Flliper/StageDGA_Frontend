import {Link} from "react-router-dom";
import '../Styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-item">
              <Link to="/">Accueil</Link>
            </div>
            <div className="navbar-item">
              <Link to="/">Connexion</Link>
            </div>
        </nav>
    );
}

export default Navbar;

