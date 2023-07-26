import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import dataiku from "../Assets/dataiku-logo.svg";
import microsoft from "../Assets/microsoft-access-logo.svg";
import sqlite from "../Assets/sqlite-logo.svg";
import '../Styles/Accueil.css';

function Accueil({setSelectedTable}) {

    useEffect(() => {
        setSelectedTable("");
    }, [setSelectedTable]);

    return (
        <div className="accueil-container">
            <Link to="/northwind">
                <div className="bdd-container" style={{backgroundImage: `url(${sqlite})`}}></div>
            </Link>
            <Link to="/chinook">
                <div className="bdd-container" style={{backgroundImage: `url(${microsoft})`}}></div>
            </Link>
            <Link to="/bdd3">
                <div className="bdd-container" style={{backgroundImage: `url(${dataiku})`}}></div>
            </Link>
        </div>
    );
}

export default Accueil;
