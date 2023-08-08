import React, {useEffect, useState} from "react";
import '../Styles/ModificationBDDAddRow.css'
import axios from "axios";

function ModificationBDDAddRow() {

    const [selectedDB, setSelectedDB] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [operation, setOperation] = useState(null);
    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dbs, setDbs] = useState([]);
    const [message, setMessage] = useState(null);
    const [newRowData, setNewRowData] = useState({});
    const [primaryKeyToDelete, setPrimaryKeyToDelete] = useState("");
    const [dataID, setDataID] = useState([]);
    const [isValidIDForDelete, setIsValidIDForDelete] = useState(false);
    const [isValidIDForNewRow, setIsValidIDForNewRow] = useState(false);


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
        if (selectedTable) {
            axios.get(`http://localhost:8000/api/${selectedDB}/${selectedTable}/colonne/${columns[0]}`)
                .then((response) => {
                    // on transforme tout en string pour les futurs comparaisons car en js, 1 != "1" par exemple
                    const data = response.data.map(String);
                    setDataID(data);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des valeurs des clés primaires: ", error);
                });
        }
    }, [selectedTable, columns]);


    useEffect(() => {
        if (primaryKeyToDelete) {
            setIsValidIDForDelete(dataID.includes(String(primaryKeyToDelete)));
            console.log("isValidIDForDelete: ", dataID.includes(primaryKeyToDelete));
            console.log("dataID: ", dataID);
            console.log("primaryKeyToDelete: ", primaryKeyToDelete);
        }
        else {
            setIsValidIDForDelete(false);
        }
    }, [primaryKeyToDelete]);

    useEffect(() => {
        if (newRowData[columns[0]]) {
            setIsValidIDForNewRow(!dataID.includes(String(newRowData[columns[0]])));
            console.log("isValidIDForNewRow: ", !dataID.includes(newRowData[columns[0]]));
            console.log("dataID: ", dataID);
            console.log("newRowData[columns[0]]: ", newRowData[columns[0]]);
        }
        else {
            setIsValidIDForNewRow(false);
        }
    }, [newRowData]);

    const handleRowOperation = () => {
    axios.post(`http://localhost:8000/api/${selectedDB}/manageRow`, {
        operation: operation,
        selectedTable: selectedTable,
        newRowData: newRowData,
        primaryKeyToDelete: primaryKeyToDelete,
        columns : columns
    })
    .then(response => {
        if (response.data.status === "success") {
            setMessage("Opération réussie");
            setSelectedDB(null);
            setOperation(null);
            setPrimaryKeyToDelete('');
            setNewRowData({});
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
        <div className="container-formulaire-row">
            {dbs &&
                <div className="block-formulaire-row">
                    <h2> Choisissez une BDD à modifier </h2>
                <div className="db-buttons">
                    {Object.keys(dbs).map(dbType => (
                    dbs[dbType].map(db => (
                        <button
                            key={db}
                            className={`db-button ${db === selectedDB ? 'active' : ''}`}
                            onClick={() => {setSelectedDB(selectedDB === db ? null : db);
                                setSelectedTable(null); setOperation(null);
                            setIsValidIDForDelete(false); setIsValidIDForNewRow(false);}}
                        >
                            {db}
                        </button>
                    ))
                ))}
                </div>
                </div>
            }
            {selectedDB && (
                <select className="select-ligne-formulaire" onChange={e => {
                    setSelectedTable(e.target.value); setOperation(null);
                            setIsValidIDForDelete(false); setIsValidIDForNewRow(false)}}>
                    <option value="">Sélectionnez une table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            )}

            {selectedTable && selectedDB && (
                <div className="block-formulaire-row">
                    <h2> Que voulez vous faire ? </h2>
                    <div className="db-buttons">
                        <button className={`db-button ${operation === 'add' ? 'active' : ''}`} onClick={() => setOperation(operation === 'add' ? null : 'add')}>Ajouter une ligne</button>
                        <button className={`db-button ${operation === 'delete' ? 'active' : ''}`} onClick={() => setOperation(operation === 'delete' ? null : 'delete')}>Supprimer une ligne</button>
                    </div>
                </div>
            )}

            {operation === 'add' && selectedTable && columns.map((column, index) => (
                <div key={index} >
                    <label>{column}</label>
                    <input className={index === 0 ? (isValidIDForNewRow ? "valid-border" : "invalid-border") : ""}
                        type="text"
                        placeholder={`Valeur pour ${column}`}
                        value={newRowData[column]}
                        onChange={e => setNewRowData({...newRowData, [column]: e.target.value})}
                    />
                </div>
            ))}


            {operation === 'delete' && selectedTable && (
                <div >
                    <label>Clé primaire de la ligne à supprimer</label>
                    <input className={isValidIDForDelete ? "valid-border" : "invalid-border"}
                        type="text"
                        placeholder="Clé primaire"
                        value={primaryKeyToDelete}
                        onChange={e => setPrimaryKeyToDelete(e.target.value)}
                    />
                </div>
            )}


            {((operation === 'add') || (operation === 'delete')) && (
                <button className="button-submit" onClick={() => {
                    if (operation === 'add' && !isValidIDForNewRow)
                        if (newRowData[columns[0]] === '')
                            setMessage("Aucune clé primaire n'a été spécifiée");
                        else
                        setMessage("La clé primaire existe déjà");
                    else if (operation === 'delete' && !isValidIDForDelete)
                        setMessage("La clé primaire n'existe pas");
                    else
                    handleRowOperation();
                }}>Confirmer</button>
            )}
            { message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
              {message}
            </div> }

        </div>
    );
}

export default ModificationBDDAddRow;