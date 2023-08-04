import React, {useEffect, useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import tabColumns from "../Data/donnees.json";
import "../Styles/Onglet2.css"



function Onglet({tableColumns, setTableColumns}) {
    const { bdd, table, column,  id } = useParams();
    const [rowData, setRowData] = useState(null);


    useEffect(() => {
      if (tableColumns && tableColumns.length) {
        axios.get(`http://localhost:8000/api/${bdd}/${table}/ligne/${id}`)
          .then(response => {
            console.log(response.data)
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


    if (!rowData || !tabColumns) {
        return <div className="loading">Loading...</div>;
    }



    const columnsForTable = tabColumns[bdd][table];
    const tabs = Object.keys(columnsForTable);

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
