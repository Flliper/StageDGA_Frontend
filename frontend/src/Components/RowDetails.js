// Importation des dépendances nécessaires et des styles
import {Link, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import '../Styles/RowDetails.css';

function RowDetails({tableColumns, setTableColumns}) {

  // Utilisation du hook useParams pour extraire les paramètres de l'URL
  const { bdd, table, column, id } = useParams();

  // Initialisation d'un état pour stocker les données détaillées de la ligne
  const [rowData, setRowData] = useState(null);

  // Affichage des noms de colonnes pour le débogage
  console.log(tableColumns)

  // Premier useEffect: Charger les données spécifiques d'une ligne en fonction de la table et de l'ID
  useEffect(() => {
      // Vérification de l'existence de tableColumns et qu'il ne soit pas vide
      if (tableColumns && tableColumns.length) {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
          .then(response => {
            // Conversion du tableau de valeurs en un objet avec les noms de colonnes comme clés
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

  // Deuxième useEffect: Charger les noms de colonnes pour la table spécifiée
  useEffect(() => {
      axios.get(`http://localhost:8000/api/${bdd}/${table}/colonnes`)
          .then(response => {
              setTableColumns(response.data);
          })
          .catch(error => {
              console.error('Erreur lors de la récupération des noms de colonnes', error);
          });
  }, [table]);

  // Affichage d'un message de chargement tant que les données de la ligne ne sont pas récupérées
  if (!rowData) {
    return <div className="loading">Chargement...</div>;
  }

  // Rendu du composant
  return (
      <div className="row-details-container">
          <div className="titre">
              {/* Affichage du nom de la table et de la clé primaire */}
              <h1>Table : {table}</h1>
              <h2>Clé primaire : {tableColumns[0]} = {id}</h2>
          </div>

          <ul>
              {/* Boucle sur les données de la ligne et rendu de chaque valeur de colonne */}
              {Object.entries(rowData).map(([columnName, columnValue], index) => (
                  <Link
                      key={index}
                      to={`/${bdd}/occurrences/${table}/${columnName}/${columnValue}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}>
                      <li className="clickable-li">
                          <strong>{columnName}</strong>: {columnValue}
                      </li>
                  </Link>
              ))}
          </ul>
      </div>
  );
}

// Exportation du composant RowDetails pour l'utiliser dans d'autres parties de l'application
export default RowDetails;
