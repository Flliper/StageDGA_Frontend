import React, {useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import dataiku from "../Assets/dataiku-logo.svg";
import microsoft from "../Assets/microsoft-access-logo.svg";
import sqlite from "../Assets/sqlite-logo.svg";
import '../Styles/Accueil.css';

function Accueil({setSelectedTable, setTableNames, setFilters, setSort}) {

    useEffect(() => {
        setSelectedTable("");
        setTableNames([]);
        setFilters({});
        setSort({column: null, order: null});
    }, [setSelectedTable, setTableNames]);

    return (
        <div className="accueil-container">
            <Link to="/northwind">
                <div className="bdd-container" style={{backgroundImage: `url(${sqlite})`}}></div>
            </Link>
            <Link to="/chinook">
                <div className="bdd-container" style={{backgroundImage: `url(${dataiku})`}}></div>
            </Link>
            <Link to="/northwindAccess">
                <div className="bdd-container" style={{backgroundImage: `url(${microsoft})`}}></div>
            </Link>
        </div>
    );
}

export default Accueil;
