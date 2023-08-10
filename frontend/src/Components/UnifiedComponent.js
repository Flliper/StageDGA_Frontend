import React, {useEffect, useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import tabColumns from "../Data/donnees.json";
import "../Styles/UnifiedComponent.css"
import ForeignKeysBis from "./ForeignKeysBis";
import Tests from "./Tests";


function UnifiedComponent({tableColumns, setTableColumns, allForeignKeys, allTableColumns, allPrimaryKeys}) {

    const navigate = useNavigate();
    const { bdd, table, column,  id } = useParams();

    const [rowData, setRowData] = useState(null);

    const [ongletTable, setOngletTable] = useState(null);
    const [ongletColumn, setOngletColumn] = useState(null);
    const [ongletValue, setOngletValue] = useState(null);
    const [selected, setSelected] = useState(false);

    //FROM FOREIGNKEYS.JS
    const [foreignTables, setForeignTables] = useState([]);
    const [foreignData, setForeignData] = useState({});
    //


    useEffect(() => {
      if (tableColumns && tableColumns.length) {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
          .then(response => {
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


    useEffect(() => {
        setSelected(false);
    }, [table, column, id]);


    const columnsForTable = tabColumns[bdd][table];
    const tabs = Object.keys(columnsForTable);

    // FROM FOREIGNKEYS.JS

    useEffect(() => {

       if (Object.keys(allForeignKeys).length > 0) {

           const newForeignTables = {};

           for (let [key, value] of Object.entries(allForeignKeys)) {
               for (let innerArray of value) {
                   if (innerArray[1] === table && innerArray[2] === ongletColumn) {
                       newForeignTables[key] = innerArray[0];
                   }
               }
           }

            // Parcourir les clés primaires
            for (let [key, value] of Object.entries(allPrimaryKeys)) {
                if (value === ongletColumn) {
                    newForeignTables[key] = value;
                }
}
           // On ajoute la table initiale dans tous les cas
           newForeignTables[table] = ongletColumn;
           setForeignTables(newForeignTables)

       }
    }, [table, ongletTable, ongletColumn, ongletValue]);


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
          console.error('Error fetching foreign data', error);
        }
      })(); }
    }, [foreignTables, ongletValue]);

    // CODE AJOUTÉ



    if (!rowData || !tabColumns) {
            return <div className="loading">Loading...</div>;
        }

    return (
        <div className="global">
            <div className="tab-container-onglet">
                <div className="titre-onglet">
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
                                    <div className="clickable-element-onglet" key={column} onClick={
                                        () => {
                                            setOngletTable(table);
                                            setOngletColumn(column);
                                            setOngletValue(rowData[column]);
                                            setSelected(true)
                                        }
                                    }>
                                        <strong>{column} :</strong>
                                        {rowData[column]}
                                    </div>

                            ))}
                        </TabPanel>
                    ))}
                </Tabs>
            </div>

            <div className="div-foreign-keys">

            {selected &&
              Object.entries(foreignData).map(([tableName, tableData]) => {
                // Ne rend rien si la tableData est vide
                if (tableData.length === 0) {
                  return null;
                }

                return (
                  // <div key={tableName} className="block-table">
                    <ForeignKeysBis originalTable={table} table={tableName} columnName={ongletColumn} columnValue={ongletValue}
                                    allTableColumns={allTableColumns} allPrimaryKeys={allPrimaryKeys}
                                    ForeignKeysTable={allForeignKeys[tableName]} allForeignKeys={allForeignKeys}  />
                  // </div>

                );
              })
            }

            </div>

        </div>
    );
}

export default UnifiedComponent;


