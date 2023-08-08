import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import '../Styles/ForeignKeys.css';

function ForeignKeys({allForeignKeys, allTableColumns, allPrimaryKeys}) {


    const navigate = useNavigate();

    const { bdd, table, columnName , columnValue } = useParams();
    const [foreignTables, setForeignTables] = useState([]);
    const [foreignData, setForeignData] = useState({});

    useEffect(() => {

       if (Object.keys(allForeignKeys).length > 0) {

           const newForeignTables = {};
           // Parcourir les clés étrangères
           for (let [key, value] of Object.entries(allForeignKeys)) {
               for (let innerArray of value) {
                   if (innerArray[1] === table && innerArray[2] === columnName) {
                       newForeignTables[key] = innerArray[0];
                   }
               }
           }

            // Parcourir les clés primaires
            for (let [key, value] of Object.entries(allPrimaryKeys)) {
                if (value === columnName) {
                    newForeignTables[key] = value;
                }
}
           // On ajoute la table initiale dans tous les cas
           newForeignTables[table] = columnName;
           setForeignTables(newForeignTables)
           console.log(newForeignTables)

       }
    }, [table]);


    useEffect(() => {
      (async () => {
        try {
          const promises = Object.entries(foreignTables).map(([foreignTable, foreignColonne]) =>
            axios.get(`http://localhost:8000/api/${bdd}/${foreignTable}/colonne/${foreignColonne}/${columnValue}`)
          );

          const responses = await Promise.all(promises);

          const newForeignData = {};
          responses.forEach((response, index) => {
            const [foreignTable] = Object.entries(foreignTables)[index];
            newForeignData[foreignTable] = response.data;
          });

          setForeignData(newForeignData);

        } catch (error) {
          console.error('Error fetching foreign data', error);
        }
      })();
    }, [foreignTables, columnValue]);



    return (
      <div>
        {Object.entries(foreignData).map(([tableName, tableData]) => {
          // Ne rend rien si la tableData est vide
          if (tableData.length === 0) {
            return null;
          }

          return (
            <div key={tableName} className="block-table">
              <h2 className="table-title"> Table : {tableName}</h2>
              <table className="table">
                <thead>
                  <tr>
                      {(allTableColumns[tableName] || []).map((columnName, i) => (
                          <th key={i}>{columnName}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} className="case-table" onClick={() => {const primaryKeyValue = allPrimaryKeys[tableName].trim();
                        navigate(`/${bdd}/row/${tableName}/${primaryKeyValue}/${row[0]}`)}}>
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

export default ForeignKeys;