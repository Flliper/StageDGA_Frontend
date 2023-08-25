// Importation des dépendances nécessaires
import React, {useEffect, useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; // Composants pour gérer les onglets
import 'react-tabs/style/react-tabs.css'; // Styles pour les onglets
import axios from "axios"; // Bibliothèque pour les requêtes HTTP
import {Link, useParams} from "react-router-dom"; // Liens et gestion des paramètres d'URL
import tabColumns from "../Data/donnees.json"; // Données de configuration pour les onglets
import "../Styles/Onglet2.css"; // Styles pour ce composant

function Onglet({tableColumns, setTableColumns}) {
    // Extraction des paramètres d'URL
    const { bdd, table, column,  id } = useParams();

    // Initialisation de l'état pour les données de la ligne
    const [rowData, setRowData] = useState(null);

    // Premier useEffect pour récupérer les données de la ligne spécifique
    useEffect(() => {
        // Vérification si les colonnes de la table ont été définies
        if (tableColumns && tableColumns.length) {
            axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
            .then(response => {
                const dataWithColumnNames = {};
                // Associe chaque valeur à sa colonne respective
                response.data.forEach((value, index) => {
                    dataWithColumnNames[tableColumns[index]] = value;
                });
                setRowData(dataWithColumnNames);
            })
            .catch(error => {
                console.error('Error fetching row data', error);
            });
        }
    }, [table, id, tableColumns]);

    // Deuxième useEffect pour récupérer les noms des colonnes de la table
    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/colonnes`)
        .then(response => {
            setTableColumns(response.data);
        })
        .catch(error => {
            console.error('Error fetching column names', error);
        });
    }, [table]);

    // Affichage de chargement si les données ne sont pas encore disponibles
    if (!rowData || !tabColumns) {
        return <div className="loading">Loading...</div>;
    }

    // Détermination des colonnes à afficher pour la table actuelle
    const columnsForTable = tabColumns[bdd][table];
    const tabs = Object.keys(columnsForTable);

    // Rendu du composant avec les onglets
    return (
        <div className="tab-container">
            <div className="titre">
                <h1>Table : {table}</h1>
                <h2>Identifiant : {tableColumns[0]} = {id}</h2>
            </div>
            <Tabs>
                <TabList>
                    {tabs.map(tab => (
                        <Tab key={tab}>{tab}</Tab>
                    ))}
                </TabList>

                {tabs.map(tab => (
                    <TabPanel key={tab}>
                        {columnsForTable[tab].map(column => (
                            <Link
                                key={column}
                                to={`/${bdd}/occurrences/${table}/${column}/${rowData[column]}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}>
                                <div className="clickable-element" key={column}>
                                    <strong>{column} :</strong>
                                    {rowData[column]}</div>
                            </Link>
                        ))}
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
}

export default Onglet;
