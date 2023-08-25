import React, {useContext, useEffect, useState} from "react";
import '../Styles/ModificationBDDAddRow.css'
import axios from "axios";
import {AuthContext} from "./AuthContext";
import {useNavigate} from "react-router-dom";

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
    const [notNullColumns, setNotNullColumns] = useState([]);


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
    if (selectedTable) {
        axios.get(`http://localhost:8000/api/${selectedDB}/${selectedTable}/notNullColonnes`)
        .then(response => setNotNullColumns(response.data.not_null_columns))
        .catch(error => console.error('There was an error!', error));
    }
}, [selectedTable]);


    useEffect(() => {
        // Vérifie si une clé primaire a été sélectionnée pour la suppression
        if (primaryKeyToDelete) {
            // Vérifie si la clé primaire à supprimer est incluse dans 'dataID'
            setIsValidIDForDelete(dataID.includes(String(primaryKeyToDelete)));
        }
        else {
            // Si aucune clé primaire n'est sélectionnée, le champ n'est pas valide
            setIsValidIDForDelete(false);
        }
    }, [primaryKeyToDelete]);


    useEffect(() => {
        // Récupère l'ID de la nouvelle ligne
        const currentID = newRowData[columns[0]];

        // Vérifie si l'ID est valide et unique
        if (currentID) {
            const isIntegerID = Number.isInteger(Number(currentID)); // Vérifie si l'ID est un entier
            const isUniqueID = !dataID.includes(String(currentID)); // Vérifie si l'ID est unique
            setIsValidIDForNewRow(isIntegerID && isUniqueID); // Met à jour le statut de validation de l'ID pour la nouvelle ligne
        } else {
            setIsValidIDForNewRow(false); // Si aucun ID n'est fourni, le champ n'est pas valide
        }
    }, [newRowData]);


    const handleRowOperation = () => {
        // Envoie une requête POST au serveur pour effectuer l'opération sur la ligne
        axios.post(`http://localhost:8000/api/${selectedDB}/manageRow`, {
            operation: operation,
            selectedTable: selectedTable,
            newRowData: newRowData,
            primaryKeyToDelete: primaryKeyToDelete,
            columns: columns
        },{
            headers: {
                'Authorization': `Token ${authContext.user.token}` // Autorisation à l'aide d'un token
            }
        })
        .then(response => {
            // Si la réponse du serveur indique que l'opération a réussi
            if (response.data.status === "success") {
                setMessage("Opération réussie"); // Affiche un message de succès
                setSelectedDB(null);
                setOperation(null);
                setPrimaryKeyToDelete('');
                setNewRowData({});
                // La ligne ci-dessous a été commentée, mais elle permettrait d'effacer le message après 3 secondes
                // setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage("Opération échouée"); // Sinon, affiche un message d'échec
                // La ligne ci-dessous a été commentée, mais elle permettrait d'effacer le message après 3 secondes
                // setTimeout(() => setMessage(''), 3000);
            }
        })
        .catch(error => {
            // Log l'erreur en cas d'échec de la requête
            console.error('Error:', error);
        });
    }

    // Ce useEffect est déclenché lorsque la valeur de 'message' change
    useEffect(() => {
        let timeoutId;
        // Si un message est défini, programme son effacement après 3 secondes
        if (message !== '') {
            timeoutId = setTimeout(() => setMessage(''), 3000);
        }
        // Nettoyage de l'effet : annule le timeout lorsque l'effet est réexécuté ou lorsque le composant est démonté
        return () => {
            clearTimeout(timeoutId);
        };
    }, [message]);



    return (
        // Conteneur principal pour le formulaire de manipulation des lignes
        <div className="container-formulaire-row">
            {/* Si des bases de données (dbs) sont fournies */}
            {dbs &&
                <div className="block-formulaire-row">
                    <h2> Choisissez une BDD à modifier </h2>
                    <div className="db-buttons">
                        {/* Cartographie des types de bases de données (par exemple MySQL, PostgreSQL, etc.) */}
                        {Object.keys(dbs).map(dbType => (
                            // Cartographie de chaque base de données dans le type donné
                            dbs[dbType].map(db => (
                                <button
                                    key={db}
                                    // Ajoute la classe 'active' si la base de données est actuellement sélectionnée
                                    className={`db-button ${db === selectedDB ? 'active' : ''}`}
                                    // Gère le changement de la base de données sélectionnée
                                    onClick={() => {
                                        setSelectedDB(selectedDB === db ? null : db);
                                        setSelectedTable(null);
                                        setOperation(null);
                                        setIsValidIDForDelete(false);
                                        setIsValidIDForNewRow(false);
                                    }}
                                >
                                    {db}
                                </button>
                            ))
                        ))}
                    </div>
                </div>
            }

            {/* Si une base de données est sélectionnée, affichez le sélecteur de table */}
            {selectedDB && (
                <select className="select-ligne-formulaire" onChange={e => {
                    setSelectedTable(e.target.value);
                    setOperation(null);
                    setIsValidIDForDelete(false);
                    setIsValidIDForNewRow(false);
                }}>
                    <option value="">Sélectionnez une table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            )}

            {/* Si une table et une base de données sont sélectionnées, donnez des options pour ajouter ou supprimer une ligne */}
            {selectedTable && selectedDB && (
                <div className="block-formulaire-row">
                    <h2> Que voulez vous faire ? </h2>
                    <div className="db-buttons">
                        {/* Bouton pour choisir l'opération "ajouter" */}
                        <button className={`db-button ${operation === 'add' ? 'active' : ''}`} onClick={() => setOperation(operation === 'add' ? null : 'add')}>Ajouter une ligne</button>
                        {/* Bouton pour choisir l'opération "supprimer" */}
                        <button className={`db-button ${operation === 'delete' ? 'active' : ''}`} onClick={() => setOperation(operation === 'delete' ? null : 'delete')}>Supprimer une ligne</button>
                    </div>
                </div>
            )}

            {/* Si l'opération "ajouter" est sélectionnée et qu'une table est choisie, affichez le formulaire d'ajout */}
            {operation === 'add' && selectedTable &&
                <div className="global-div-row">
                    {columns.map((column, index) => {
                        // Vérifications pour déterminer le style et la validation de chaque champ
                        const isPrimaryKey = index === 0;
                        const isNotNull = notNullColumns.includes(column);
                        const hasValidValue = newRowData[column] && newRowData[column].trim() !== '';
                        const isValid = !isNotNull || (isNotNull && hasValidValue);
                        // Classe CSS par défaut pour les champs
                        let inputClass = 'input-row';

                        if (isPrimaryKey) {
                            inputClass += isValidIDForNewRow ? ' valid-border' : ' invalid-border';
                        } else if (isNotNull) {
                            inputClass += isValid ? ' valid-border' : ' invalid-border';
                        }

                        return (
                            <div className="div-row" key={index}>
                                <label>{column}</label>
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder={`Valeur pour ${column}`}
                                    value={newRowData[column] || ''}
                                    onChange={e => setNewRowData({...newRowData, [column]: e.target.value})}
                                />
                            </div>
                        );
                    })}
                </div>
            }

            {/* Si l'opération "supprimer" est choisie et qu'une table est sélectionnée, affichez le champ pour la clé primaire */}
            {operation === 'delete' && selectedTable && (
                <div>
                    <label>Clé primaire de la ligne à supprimer</label>
                    <input
                        className={isValidIDForDelete ? "valid-border" : "invalid-border"}
                        type="text"
                        placeholder="Clé primaire"
                        value={primaryKeyToDelete}
                        onChange={e => setPrimaryKeyToDelete(e.target.value)}
                    />
                </div>
            )}


            {/* Affichez le bouton "Confirmer" si une opération est choisie (ajout ou suppression) */}
            {((operation === 'add') || (operation === 'delete')) && (
                <button className="button-submit" onClick={() => {
                    // Vérifiez si toutes les colonnes qui ne peuvent pas être nulles ont des valeurs
                    const allNotNullColumnsHaveValues = notNullColumns.every(col => newRowData[col] && newRowData[col].trim() !== '');
                    if (operation === 'add') {
                        // Validation pour l'opération "ajout"
                        if (!isValidIDForNewRow) {
                            if (newRowData[columns[0]] === '') {
                                setMessage("Aucune clé primaire n'a été spécifiée");
                            } else {
                                setMessage("La clé primaire existe déjà ou n'est pas un entier");
                            }
                        } else if (!allNotNullColumnsHaveValues) {
                            setMessage("Veuillez remplir tous les champs obligatoires.");
                        } else {
                            // Si tout est valide, procédez à l'opération d'ajout
                            handleRowOperation();
                        }
                    } else if (operation === 'delete') {
                        // Validation pour l'opération "suppression"
                        if (!isValidIDForDelete) {
                            setMessage("La clé primaire n'existe pas");
                        } else {
                            // Si tout est valide, procédez à l'opération de suppression
                            handleRowOperation();
                        }
                    }
                }}>Confirmer</button>
            )}

            {/* Affiche un message s'il est défini, avec des classes conditionnelles pour le style selon le type de message */}
            {message &&
            <div className={`message ${message === 'Opération réussie' ? 'success' : 'error'}`}>
                {message}
            </div>}
        </div>
    );
}

export default ModificationBDDAddRow;