import React, {useEffect, useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import tabColumns from "../Data/donnees.json";
import "../Styles/UnifiedComponent.css"
import ForeignKeysBis from "./ForeignKeysBis";
import Tests from "./Tests";


// Fonction représentant un composant unifié
function UnifiedComponent({tableColumns, setTableColumns, allForeignKeys, allTableColumns, allPrimaryKeys}) {

    // Utilisation du hook pour naviguer entre les routes
    const navigate = useNavigate();

    // Extraction des paramètres depuis l'URL de la route
    const { bdd, table, column,  id } = useParams();

    // État local pour les données d'une ligne
    const [rowData, setRowData] = useState(null);

    // États locaux pour les onglets
    const [ongletTable, setOngletTable] = useState(null);
    const [ongletColumn, setOngletColumn] = useState(null);
    const [ongletValue, setOngletValue] = useState(null);
    const [selected, setSelected] = useState(false);

    // États locaux pour les tables étrangères et leurs données
    const [foreignTables, setForeignTables] = useState([]);
    const [foreignData, setForeignData] = useState({});

    // Effet pour récupérer les données d'une ligne spécifique en fonction des colonnes fournies
    useEffect(() => {
      if (tableColumns && tableColumns.length) {
        // On n'effectue la requete que si une table a été séléctionnée
        axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
          .then(response => {
            const dataWithColumnNames = {};
            response.data.forEach((value, index) => {
              dataWithColumnNames[tableColumns[index]] = value;
            });
            setRowData(dataWithColumnNames);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des données de la ligne', error);
          });
      }
    }, [table, id, tableColumns]);

    // Effet pour récupérer les noms des colonnes pour une table spécifique
    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/colonnes`)
            .then(response => {
                setTableColumns(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des noms de colonnes', error);
            });
    }, [table]);

    // Réinitialise l'état `selected` lors d'un changement de table, colonne ou ID
    useEffect(() => {
        setSelected(false);
    }, [table, column, id]);

    const columnsForTable = tabColumns[bdd][table];
    const tabs = Object.keys(columnsForTable);

    // LOGIQUE POUR LES CLÉS ÉTRANGÈRES (de FOREIGNKEYS.JS)
    useEffect(() => {
       if (Object.keys(allForeignKeys).length > 0) {
           const newForeignTables = {};

           // Parcourir toutes les clés étrangères
           for (let [key, value] of Object.entries(allForeignKeys)) {
               for (let innerArray of value) {
                   if (innerArray[1] === table && innerArray[2] === ongletColumn) {
                       newForeignTables[key] = innerArray[0];
                   }
               }
           }

           // Parcourir toutes les clés primaires
           for (let [key, value] of Object.entries(allPrimaryKeys)) {
                if (value === ongletColumn) {
                    newForeignTables[key] = value;
                }
           }

           // Ajouter la table actuelle aux tables étrangères
           newForeignTables[table] = ongletColumn;
           setForeignTables(newForeignTables)
       }
    }, [table, ongletTable, ongletColumn, ongletValue]);

    // Effet pour récupérer des données étrangères pour une valeur d'onglet spécifique
    useEffect(() => {
        if (ongletValue) {
      (async () => {
        try {
          const promises = Object.entries(foreignTables).map(([foreignTable, foreignColonne]) =>
            axios.get(`http://localhost:8000/api/${bdd}/${foreignTable}/colonne/${foreignColonne}/${ongletValue}`)
          );

          const responses = await Promise.all(promises);

          const newForeignData = {};
          responses.forEach((response, index) => {
            const [foreignTable] = Object.entries(foreignTables)[index];
            newForeignData[foreignTable] = response.data;
          });

          setForeignData(newForeignData);

        } catch (error) {
          console.error('Erreur lors de la récupération des données étrangères', error);
        }
      })(); }
    }, [foreignTables, ongletValue]);

    // Si les données de la ligne ou les colonnes ne sont pas chargées, afficher un indicateur de chargement
    if (!rowData || !tabColumns) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        // Conteneur global
        <div className="global">
            {/* Conteneur pour les onglets */}
            <div className="tab-container-onglet">
                <div className="titre-onglet">
                    {/* Titre et identifiant actuel de la table */}
                    <h1>Table : {table}</h1>
                    <h2>Identifiant : {tableColumns[0]} = {id}</h2>
                </div>
                {/* Création des onglets */}
                <Tabs>
                    {/* Liste des onglets */}
                    <TabList>
                        {tabs.map(tab => (
                            <Tab key={tab}>{tab}</Tab>
                        ))}
                    </TabList>

                    {/* Contenu de chaque onglet */}
                    {tabs.map(tab => (
                        <TabPanel key={tab}>
                            {/* Boucle pour afficher chaque colonne dans l'onglet actuel */}
                            {columnsForTable[tab].map(column => (
                                    <div className="clickable-element-onglet" key={column} onClick={
                                        () => {
                                            setOngletTable(table);
                                            setOngletColumn(column);
                                            setOngletValue(rowData[column]);
                                            setSelected(true)
                                        }
                                    }>
                                        {/* Affichage du nom de la colonne et de sa valeur */}
                                        <strong>{column} :</strong>
                                        {rowData[column]}
                                    </div>

                            ))}
                        </TabPanel>
                    ))}
                </Tabs>
            </div>

            {/* Conteneur pour les données des clés étrangères */}
            <div className="div-foreign-keys">
            {/* On affiche cette partie que si on a cliqué sur une valeur dans les onglets, pour laquelle on veut
            regarder ses occurences dans les différentes tables */}
            {selected &&
              Object.entries(foreignData).map(([tableName, tableData]) => {
                // Ne rend rien si les données pour une table données sont nulles (c'est-à-dire pas d'occurrence dans cette table)
                if (tableData.length === 0) {
                  return null;
                }

                return (
                    // Composant pour afficher les données des clés étrangères
                    <ForeignKeysBis originalTable={table} table={tableName} columnName={ongletColumn} columnValue={ongletValue}
                                    allTableColumns={allTableColumns} allPrimaryKeys={allPrimaryKeys}
                                    ForeignKeysTable={allForeignKeys[tableName]} allForeignKeys={allForeignKeys}  />

                );
              })
            }

            </div>

        </div>
    );
}

export default UnifiedComponent;


