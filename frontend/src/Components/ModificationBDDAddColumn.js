import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ModificationBDDAddColumn.css';

function ModificationBDDAddColumn() {
    const [selectedDB, setSelectedDB] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [operation, setOperation] = useState(null);
    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnName, setColumnName] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [dbs, setDbs] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/bdd")
              .then((response) => {
            setDbs(response.data);
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des bases de données: ", error);
        });
    }, []);

    useEffect(() => {
        if (selectedDB) {
            axios.get(`http://localhost:8000/api/${selectedDB}/tables`)
            .then(response => setTables(response.data))
            .catch(error => console.error('There was an error!', error));
        }
    }, [selectedDB]);


    useEffect(() => {
        if (selectedTable) {
            axios.get(`http://localhost:8000/api/${selectedDB}/${selectedTable}/colonnes`)
            .then(response => setColumns(response.data))
            .catch(error => console.error('There was an error!', error));
        }
    }, [selectedTable]);


    const handleColumnOperation = () => {
    axios.post(`http://localhost:8000/api/${selectedDB}/manageColumn`, {
        operation: operation,
        selectedTable: selectedTable,
        columnName: columnName,
        selectedColumn: selectedColumn
    })
    .then(response => {
        if (response.data.status === "success") {
            setMessage("Opération réussie");
            setSelectedDB(null);
            setOperation(null);
            setSelectedTable(null);
            setColumnName('');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage("Opération échouée");
            setTimeout(() => setMessage(''), 3000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

    return (
        <div className="container-formulaire-column">
            {dbs &&
                <div className="block-formulaire-column">
                    <h2> Choisissez une BDD à modifier </h2>
                <div className="db-buttons">
                    {Object.keys(dbs).map(dbType => (
                    dbs[dbType].map(db => (
                        <button
                            key={db}
                            className={`db-button ${db === selectedDB ? 'active' : ''}`}
                            onClick={() => {setSelectedDB(selectedDB === db ? null : db);
                                setSelectedTable(null); setOperation(null); setColumnName('');
                                setSelectedColumn(null);}}
                        >
                            {db}
                        </button>
                    ))
                ))}
                </div>
                </div>
            }
            {selectedDB && (
                <select className="select-colonne-formulaire" onChange={e => setSelectedTable(e.target.value)}>
                    <option value="">Sélectionnez une table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            )}

            {selectedTable && selectedDB && (
                <div className="block-formulaire-column">
                    <h2> Que voulez vous faire ? </h2>
                    <div className="db-buttons">
                        <button className={`db-button ${operation === 'add' ? 'active' : ''}`} onClick={() => setOperation(operation === 'add' ? null : 'add')}>Ajouter une colonne</button>
                        <button className={`db-button ${operation === 'delete' ? 'active' : ''}`} onClick={() => setOperation(operation === 'delete' ? null : 'delete')}>Supprimer une colonne</button>
                    </div>
                </div>
            )}

            {operation === 'add' && selectedTable && (
                <input
                    type="text"
                    placeholder="Nom de la colonne"
                    value={columnName}
                    onChange={e => setColumnName(e.target.value)}
                />
            )}
            {operation === 'delete' && selectedTable && (
                <select className="select-colonne-formulaire" onChange={e => setSelectedColumn(e.target.value)}>
                    <option value="">Sélectionnez une colonne</option>
                    {columns.map(colonne => (
                        <option key={colonne} value={colonne}>{colonne}</option>
                    ))}
                </select>
            )}
            {((operation === 'add' && columnName) || (operation === 'delete' && selectedColumn)) && (
                <button className="button-submit" onClick={() => {
                    handleColumnOperation();
                }}>Confirmer</button>
            )}
            { message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
              {message}
            </div> }

        </div>
    );
}

export default ModificationBDDAddColumn;

