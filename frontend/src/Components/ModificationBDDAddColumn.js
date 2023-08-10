import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import '../Styles/ModificationBDDAddColumn.css';
import {AuthContext} from "./AuthContext";
import {useNavigate} from "react-router-dom";

function ModificationBDDAddColumn() {
    const [selectedDB, setSelectedDB] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [operation, setOperation] = useState(null);
    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnName, setColumnName] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [newColumnName, setNewColumnName] = useState('');
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

    useEffect(() => {
        if (newColumnName) {
            setIsValidIDForRename(!columns.includes(String(newColumnName)));
        } else {
            setIsValidIDForRename(false);
        }
    }, [newColumnName]);

    useEffect(() => {
        if (columnName) {
            setIsValidIDForCreate(!columns.includes(String(columnName)));
        } else {
            setIsValidIDForRename(false);
        }
    }, [columnName]);

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


    const handleColumnOperation = () => {
    axios.post(`http://localhost:8000/api/${selectedDB}/manageColumn`, {
        operation: operation,
        selectedTable: selectedTable,
        columnName: columnName,
        selectedColumn: selectedColumn,
        newColumnName: newColumnName
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
                        <button className={`db-button ${operation === 'rename' ? 'active' : ''}`} onClick={() => setOperation(operation === 'rename' ? null : 'rename')}>Renommer une colonne</button>
                    </div>
                </div>
            )}

            {operation === 'add' && selectedTable && (
                <input className={isValidIDForCreate ? "valid-border" : "invalid-border"}
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
            {operation === 'rename' && selectedTable && (
                <div className="div-rename-column">
                    <select className="select-rename-colonne-formulaire" onChange={e => setSelectedColumn(e.target.value)}>
                        <option value="">Sélectionnez une colonne à renommer</option>
                        {columns.map(colonne => (
                            <option key={colonne} value={colonne}>{colonne}</option>
                        ))}
                    </select>
                    { selectedColumn && <input className={isValidIDForRename ? "valid-border" : "invalid-border"}
                        type="text"
                        placeholder="Nouveau nom de colonne"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                    /> }
                </div>
            )}

            {((operation === 'add' && columnName) || (operation === 'delete' && selectedColumn)
            || (operation === 'rename' && newColumnName )) && (
                <button className="button-submit" onClick={() => {
                    if (operation === 'add' && !isValidIDForCreate) {
                        if (columnName === '') {
                            setMessage("Veuillez entrer un nom de colonne");
                        }
                        else {
                            setMessage("Nom de colonne déjà existant");
                        }
                    }
                    if (operation=== 'rename' && !isValidIDForRename) {
                        if (newColumnName === '') {
                            setMessage("Veuillez entrer un nom de colonne");
                        }
                        else {
                            setMessage("Nom de colonne déjà existant");
                        }
                    }
                    else handleColumnOperation();
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

