import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import '../Styles/ModificationBDDAddTable.css';
import {AuthContext} from "./AuthContext";
import {useNavigate} from "react-router-dom";

function ModificationBDDAddTable() {
    const [selectedDB, setSelectedDB] = useState(null);
    const [operation, setOperation] = useState(null);
    const [tableName, setTableName] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [dbs, setDbs] = useState([]);
    const [isValidIDForRename, setIsValidIDForRename] = useState(false);
    const [isValidIDForCreate, setIsValidIDForCreate] = useState(false);
    const [message, setMessage] = useState(null);

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
    if (!authContext.isLoggedIn) {
      navigate('/connexion');
    }
  }, [authContext.isLoggedIn, navigate]);

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

    useEffect(() => {
        if (newTableName) {
            setIsValidIDForRename(!tables.some(subArray => subArray[0] === String(newTableName)));
        } else {
            setIsValidIDForRename(false);
        }
    }, [newTableName]);

    useEffect(() => {
        if (tableName) {
            setIsValidIDForCreate(!tables.some(subArray => subArray[0] === String(tableName)));
        } else {
            setIsValidIDForRename(false);
        }
    }, [tableName]);

    useEffect(() => {
        let timeoutId;
        if (message !== '') {
            timeoutId = setTimeout(() => setMessage(''), 3000);
        }
        // Effect cleanup: clear the timeout when the effect re-runs or the component unmounts
        return () => {
            clearTimeout(timeoutId);
        };
    }, [message]);

    const handleTableOperation = () => {
    axios.post(`http://localhost:8000/api/${selectedDB}/manageTable`, {
        operation: operation,
        tableName: tableName,
        selectedTable: selectedTable,
        newTableName: newTableName
    },{
        headers: {
            'Authorization': `Token ${authContext.user.token}`
        }
    })
    .then(response => {
        if (response.data.status === "success") {
            setMessage("Opération réussie");
            setSelectedDB(null);
            setOperation(null);
            setTableName('');
            setSelectedTable(null);
            setNewTableName('');
            // setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage("Opération échouée");
            // setTimeout(() => setMessage(''), 3000);
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
                        <button className={`db-button ${operation === 'rename' ? 'active' : ''}`} onClick={() => setOperation(operation === 'rename' ? null : 'rename')}>Renommer une table</button>

                    </div>
                </div>
            )}

            {operation === 'add' && (
                <input className={isValidIDForCreate ? "valid-border" : "invalid-border"}
                    type="text"
                    placeholder="Nom de la table"
                    value={tableName}
                    onChange={e => setTableName(e.target.value)}
                />
            )}
            {operation === 'delete' && (
                <select className="select-table-formulaire" onChange={e => setSelectedTable(e.target.value)}>
                    <option value="">Sélectionnez une table à supprimer</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            )}

            {operation === 'rename' && (
                <>
                    <select className="select-rename-table-formulaire" onChange={e => {setNewTableName(''); setSelectedTable(e.target.value)}}>
                        <option value="">Sélectionnez une table à renommer</option>
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                    {selectedTable && (
                    <input className={isValidIDForRename ? "valid-border" : "invalid-border"}
                        type="text"
                        placeholder="Nouveau nom de la table"
                        value={newTableName}
                        onChange={e => setNewTableName(e.target.value)}
                    /> )}
                </>
            )}


            {((operation === 'add' && tableName) || (operation === 'delete' && selectedTable) ||
                (operation === 'rename' && newTableName )) && (
                <button className="button-submit" onClick={() => {
                    if (operation === 'add' && !isValidIDForCreate) {
                        if (tableName === '') {
                            setMessage("Veuillez entrer un nom de table");
                        }
                        else {
                            setMessage("Nom de table déjà existant");
                        }
                    }
                    if (operation=== 'rename' && !isValidIDForRename) {
                        if (newTableName === '') {
                            setMessage("Veuillez entrer un nom de table");
                        }
                        else {
                            setMessage("Nom de table déjà existant");
                        }
                    }
                    else handleTableOperation();
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
