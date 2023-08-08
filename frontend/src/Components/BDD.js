import '../Styles/BDD.css';
import flecheDroite from '../Assets/angle-droit.svg';
import flecheFinGauche from '../Assets/angle-double-gauche.svg';
import flecheFinDroite from '../Assets/angle-double-droit.svg';
import flecheGauche from '../Assets/angle-gauche.svg';
import triangleBas from '../Assets/triangle_bas.svg';
import triangleHaut from '../Assets/triangle_haut.svg';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import Table from "./Table";
import {AuthContext} from "./AuthContext";



function BDD({tableNames, selectedTable, setSelectedTable, tableColumns,
                   infoTable, page, setPage, count, filters, setFilters, sort, setSort,
    setTableNames, nbLines, setInfoTable, setTableColumns, setCount, setPrimaryKey,
    setAllForeignKeys, setAllTableColumns, setAllPrimaryKeys, allPrimaryKeys, allTableColumns, allForeignKeys,
             primaryKey}) {


    const { bdd } = useParams();
    const { isLoggedIn } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);

    //Récupère les noms des tables
    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/tables`)
            .then(response => {
                setTableNames(response.data);
        })
            .catch(error => {
                console.error('Error fetching field names', error);
            });
    }, [bdd]);

    //Récupère les données de la table sélectionnée
    useEffect(() => {
        if (selectedTable) {
            const filterString = encodeURIComponent(JSON.stringify(filters));
            let url = `http://localhost:8000/api/${bdd}/${selectedTable}?page=${page}&limit=${nbLines}&filter=${filterString}`;

            if (sort.column !== null) {
                const sortString = encodeURIComponent(JSON.stringify({[sort.column]: sort.order}));
                url += `&sort=${sortString}`;
            }

            axios.get(url)
                .then(response => {
                    setInfoTable(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data', error);
                });
        } else {
            setInfoTable([]);
        }
    }, [selectedTable, page, nbLines, filters, sort]);


    //Récupère les noms des colonnes de la table sélectionnée
    useEffect(() => {
        selectedTable ?
            axios.get(`http://localhost:8000/api/${bdd}/${selectedTable}/colonnes`)
                .then(response => {
                    setTableColumns(response.data);
                })
                .catch(error => {
                    console.error('Error fetching column names', error);
                })
            : setTableColumns([]);
    }, [selectedTable]);

    //Récupère le nombre de lignes de la table sélectionnée
    useEffect(() => {
        selectedTable ?
            (() => {
                const filterString = encodeURIComponent(JSON.stringify(filters));
                const url = `http://localhost:8000/api/${bdd}/${selectedTable}/count?filter=${filterString}`;
                axios.get(url)
                    .then(response => {
                        setCount(response.data.count);
                    })
                    .catch(error => {
                        console.error('Error fetching count', error);
                    });
            })()
            : setCount(0);
    }, [selectedTable, filters]);

    //Récupère le nom de la clé primaire de la table sélectionnée
    useEffect(() => {
        selectedTable &&
        axios.get(`http://localhost:8000/api/${bdd}/${selectedTable}/primarykey`)
            .then(response => {
                setPrimaryKey(response.data);
            })
            .catch(error => {
                console.error('Error fetching primary key', error);
            });
    }, [selectedTable]);

    useEffect(() => {
       axios.get(`http://localhost:8000/api/${bdd}/allforeignkeys`)
         .then(response => {
           // Convertir le tableau de valeurs en un objet avec des noms de colonnes
           setAllForeignKeys(response.data);
         })
         .catch(error => {
           console.error('Error fetching foreign keys', error);
         });
    }, []);

    useEffect(() => {
       axios.get(`http://localhost:8000/api/${bdd}/allprimarykeys`)
         .then(response => {
           // Convertir le tableau de valeurs en un objet avec des noms de colonnes
           setAllPrimaryKeys(response.data);
         })

         .catch(error => {
           console.error('Error fetching primary keys', error);
         });
    }, []);

    useEffect(() => {
        // Créer un tableau de promesses pour obtenir les colonnes de chaque table
        const promises = tableNames.map((tableName) =>
            axios.get(`http://localhost:8000/api/${bdd}/${tableName}/colonnes`)
        );

        Promise.all(promises)
            .then((responses) => {
                // Créer un nouvel objet pour stocker les colonnes de chaque table
                const newTableColumns = {};

                // Pour chaque réponse, ajouter une nouvelle paire clé-valeur à l'objet
                responses.forEach((response, i) => {
                    const tableName = tableNames[i];
                    newTableColumns[tableName] = response.data;
                });

                // Mettre à jour l'état avec le nouvel objet
                setAllTableColumns(newTableColumns);
            })
            .catch((error) => {
                console.error('Error fetching column names', error);
            });
    }, [tableNames]);

    const navigate = useNavigate();

    let totalPages = Math.ceil(count / 10);

    function handleInputChange(event) {

        let inputValue = Number(event.target.value);

        // empêcher l'utilisateur de mettre 0
        if (inputValue >= 1) {
            setPage(Number(event.target.value));
            }

    // empêcher l'utilisateur de mettre un nombre supérieur au nombre de pages
        if (inputValue > totalPages) {
            setPage(totalPages);
        }
    }

    function nextPage() {
        if ( page < totalPages ) {
        setPage(page + 1);
        }
    }
    function previousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }
    function putDataAtBegin() {
        setPage(1);
    }
    function putDataAtEnd() {
        setPage(totalPages);
    }

    // Gestion du tri des colonnes
    // Gestion du tri des colonnes
    const handleSort = (columnName) => {
        let newSort = { column: columnName, order: 'ASC' };

    if (sort.column === columnName) {
        switch(sort.order) {
            case 'ASC':
                newSort.order = 'DESC';
                break;
            case 'DESC':
                newSort = { column: null, order: null };
                break;
            default:
                break;
        }
    }
    setPage(1);
    setSort(newSort);
}


    return (
        <div>
            <div className="selected-header">
                {selectedTable && totalPages !== 1 ?
                  <div className="div-navigation">
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheFinGauche} alt="flecheFinGauche" onClick={() => putDataAtBegin()} />
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheGauche} alt="flecheGauche" onClick={() => previousPage()} />
                    <input className="input-page" type="number" value={page} min={1} onChange={handleInputChange} />
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheDroite} alt="flecheDroite" onClick={() => nextPage()} />
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheFinDroite} alt="flecheFinDroite" onClick={() => putDataAtEnd()} />
                  </div>
                : null}
                <div className="div-select-table">
                <select className="select-select-table" value={selectedTable} onChange={e =>  { setPage(1); setFilters({}) ; setSelectedTable(e.target.value)}}>
                    <option value="">Sélectionner une table</option>
                    {tableNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                { isLoggedIn &&
                    <button
                        className={`table-edit ${editMode ? "editor-active" : ""}`}
                        onClick={() => setEditMode(!editMode)} >
                        { editMode ? "Enlever le mode éditeur" : "Mode éditeur" }
                    </button>
                }
                </div>
            </div>


            <div className="table-container">
            <table>
                <thead>
                    <tr>
                      {tableColumns.map((columnName, index) => (
                        <th key={index} onClick={() => {handleSort(columnName); setPage(1)}}>
                          <div className="column-content">
                              <div className="titleColumn">
                                {columnName}
                                {
                                  sort.column === columnName
                                    ? sort.order === 'ASC'
                                      ? <img className="triangle-bas" src={triangleBas} alt="triangleBas" />
                                      : <img className="triangle-bas" src={triangleHaut} alt="triangleHaut" />
                                    : null
                                }
                                </div>
                                <input
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Filtre"
                                  value={filters[columnName] || ''}
                                  onChange={e => { setFilters({...filters, [columnName]: e.target.value}); setPage(1);}}
                                />
                          </div>
                        </th>
                      ))}
                    </tr>
                </thead>
                <tbody>
                    {infoTable.map((row, index) => (
                        <tr className={`case-table ${editMode ? "editor" : ""}`} key={index} onClick={() => {
                            if(!editMode) {
                                navigate(`/${bdd}/row/${selectedTable}/${primaryKey.primaryKey}/${row[0]}`)
                            }
                        }}>
                            {row.map((cell, cellIndex) => (
                                <td onClick={(e) => {
                                    if(editMode) {
                                        e.stopPropagation();
                                        navigate(`/${bdd}/edit/${selectedTable}/${primaryKey.primaryKey}/${row[0]}/${tableColumns[cellIndex]}/${cell}`)
                                    }
                                }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>


        </div>
    );

    // return (
    //     <div>
    //         <div className="div-select-table">
    //           <select className="select-table" value={selectedTable} onChange={e =>  { setPage(1); setFilters({}) ; setSelectedTable(e.target.value)}}>
    //               <option value="">Sélectionner une table</option>
    //                  {tableNames.map(name => (
    //               <option key={name} value={name}>{name}</option>
    //                 ))}
    //           </select>
    //         </div>
    //        <Table selectedTable={selectedTable} allTableColumns={allTableColumns} />
    //     </div>
    // )
}

export default BDD