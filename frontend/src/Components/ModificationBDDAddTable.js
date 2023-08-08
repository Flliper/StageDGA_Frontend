import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ModificationBDDAddTable.css';

function ModificationBDDAddTable() {
    const [selectedDB, setSelectedDB] = useState(null);
    const [operation, setOperation] = useState(null);
    const [tableName, setTableName] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [dbs, setDbs] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
    axios.get("http://localhost:8000/api/bdd")
      .then(response => {
        setDbs(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

    useEffect(() => {
        if (selectedDB) {
            axios.get(`http://localhost:8000/api/${selectedDB}/tables`)
            .then(response => setTables(response.data))
            .catch(error => console.error('There was an error!', error));
        }
    }, [selectedDB]);



    const handleTableOperation = () => {
    axios.post(`http://localhost:8000/api/${selectedDB}/manageTable`, {
        operation: operation,
        tableName: tableName,
        selectedTable: selectedTable
    })
    .then(response => {
        if (response.data.status === "success") {
            setMessage("Opération réussie");
            setSelectedDB(null);
            setOperation(null);
            setTableName('');
            setSelectedTable(null);
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
        <div className="container-formulaire-table">

            {dbs &&
                <div className="block-formulaire-table">
                    <h2> Choisissez une BDD à modifier </h2>
                <div className="db-buttons">
                    {Object.keys(dbs).map(dbType => (
                    dbs[dbType].map(db => (
                        <button
                            key={db}
                            className={`db-button ${db === selectedDB ? 'active' : ''}`}
                            onClick={() => setSelectedDB(selectedDB === db ? null : db)}
                        >
                            {db}
                        </button>
                    ))
                ))}
                </div>
                </div>
            }

            {selectedDB && (
                <div className="block-formulaire-table">
                    <h2> Que voulez vous faire ? </h2>
                    <div className="db-buttons">
                        <button className={`db-button ${operation === 'add' ? 'active' : ''}`} onClick={() => setOperation(operation === 'add' ? null : 'add')}>Ajouter une table</button>
                        <button className={`db-button ${operation === 'delete' ? 'active' : ''}`} onClick={() => setOperation(operation === 'delete' ? null : 'delete')}>Supprimer une table</button>
                    </div>
                </div>
            )}

            {operation === 'add' && (
                <input
                    type="text"
                    placeholder="Nom de la table"
                    value={tableName}
                    onChange={e => setTableName(e.target.value)}
                />
            )}
            {operation === 'delete' && (
                <select className="select-table-formulaire" onChange={e => setSelectedTable(e.target.value)}>
                    <option value="">Sélectionnez une table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            )}
            {((operation === 'add' && tableName) || (operation === 'delete' && selectedTable)) && (
                <button className="button-submit" onClick={() => {
                    handleTableOperation();
                }}>Confirmer</button>
            )}
            { message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
              {message}
            </div> }

        </div>
    );
}

export default ModificationBDDAddTable;
