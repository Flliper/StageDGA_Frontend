// Importation des bibliothèques, hooks et styles nécessaires
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import '../Styles/ForeignKeys.css';

function ForeignKeys({allForeignKeys, allTableColumns, allPrimaryKeys}) {

    // Hooks pour la navigation
    const navigate = useNavigate();

    // Récupération des paramètres de l'URL
    const { bdd, table, columnName , columnValue } = useParams();

    // État pour stocker les tables étrangères et les données étrangères
    const [foreignTables, setForeignTables] = useState([]);
    const [foreignData, setForeignData] = useState({});

    useEffect(() => {
       // Si les clés étrangères sont disponibles
       if (Object.keys(allForeignKeys).length > 0) {

           const newForeignTables = {};

           // Cherche les tables et colonnes qui sont des clés étrangères pointant vers la table et colonne spécifiées
           for (let [key, value] of Object.entries(allForeignKeys)) {
               for (let innerArray of value) {
                   if (innerArray[1] === table && innerArray[2] === columnName) {
                       newForeignTables[key] = innerArray[0];
                   }
               }
           }

            // Cherche la colonne dans les clés primaires
            for (let [key, value] of Object.entries(allPrimaryKeys)) {
                if (value === columnName) {
                    newForeignTables[key] = value;
                }
            }
            // Ajoute la table actuelle à la liste
            newForeignTables[table] = columnName;
            setForeignTables(newForeignTables)
       }
    }, [table]);

    useEffect(() => {
      // Fonction asynchrone pour récupérer les données des tables étrangères
      (async () => {
        try {
          // Exécute plusieurs requêtes pour obtenir les données des tables étrangères
          const promises = Object.entries(foreignTables).map(([foreignTable, foreignColonne]) =>
            axios.get(`http://localhost:8000/api/${bdd}/${foreignTable}/colonne/${foreignColonne}/${columnValue}`)
          );
          // Stocke toutes les données dans 'responses' une fois que toutes les promesses sont résolues
          const responses = await Promise.all(promises);

          const newForeignData = {};
          responses.forEach((response, index) => {
            const [foreignTable] = Object.entries(foreignTables)[index];
            newForeignData[foreignTable] = response.data;
          });

          setForeignData(newForeignData);

        } catch (error) {
          // En cas d'erreur lors de la récupération des données
          console.error('Error fetching foreign data', error);
        }
      })();
    }, [foreignTables, columnValue]);

    return (
      <div>
        {/* Itération sur les données des tables étrangères */}
        {Object.entries(foreignData).map(([tableName, tableData]) => {
          // Ne pas afficher les tables sans données
          if (tableData.length === 0) {
            return null;
          }

          return (
            <div key={tableName} className="block-table">
              <h2 className="table-title"> Table : {tableName}</h2>
              <table className="table">
                <thead>
                  <tr>
                      {/* Affiche les noms des colonnes */}
                      {(allTableColumns[tableName] || []).map((columnName, i) => (
                          <th key={i}>{columnName}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Itération sur les données de la table */}
                  {tableData.map((row, i) => (
                    <tr key={i} className="case-table" onClick={() => {const primaryKeyValue = allPrimaryKeys[tableName].trim();
                        navigate(`/${bdd}/row/${tableName}/${primaryKeyValue}/${row[0]}`)}}>
                      {/* Affichage des données de chaque cellule */}
                      {Object.values(row).map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
}

// Exportation du composant pour une utilisation ailleurs dans l'application
export default ForeignKeys;
