import {Link, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import '../Styles/RowDetails.css';

function RowDetails({tableColumns, setTableColumns}) {
  const { bdd, table, column,  id } = useParams();
  const [rowData, setRowData] = useState(null);

  console.log(tableColumns)

  useEffect(() => {
      // S'assurer que tableColumns existe et n'est pas vide
      if (tableColumns && tableColumns.length) {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
          .then(response => {
            // Convertir le tableau de valeurs en un objet avec des noms de colonnes
            const dataWithColumnNames = {};
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


    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/colonnes`)
            .then(response => {
                setTableColumns(response.data);
            })
            .catch(error => {
                console.error('Error fetching column names', error);
            });
    }, [table]);


  // Vérifiez si les données sont chargées avant de les afficher
  if (!rowData) {
    return <div className="loading">Loading...</div>;
  }


  return (
        <div className="row-details-container">
            <div className="titre">
                <h1>Table : {table}</h1>
                <h2>Clé primaire : {tableColumns[0]} = {id}</h2>
            </div>

            <ul>
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

export default RowDetails;
