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



// Fonction du composant BDD (Base de Données)
function BDD({
    tableNames, selectedTable, setSelectedTable,
    tableColumns, infoTable, page, setPage, count,
    filters, setFilters, sort, setSort, setTableNames,
    nbLines, setInfoTable, setTableColumns, setCount,
    setPrimaryKey, setAllForeignKeys, setAllTableColumns,
    setAllPrimaryKeys, allPrimaryKeys, allTableColumns,
    allForeignKeys, primaryKey }) {

    // Récupération du paramètre "bdd" de l'URL (probablement le nom de la base de données)
    const { bdd } = useParams();

    // Récupération de la valeur "isLoggedIn" du contexte "AuthContext"
    // pour savoir si l'utilisateur est connecté
    const { isLoggedIn } = useContext(AuthContext);

    // Etat local pour savoir si on est en mode édition ou non
    const [editMode, setEditMode] = useState(false);

    // Premier effet : Récupère les noms des tables de la base de données
    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/tables`)
            .then(response => {
                setTableNames(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des noms de table', error);
            });
    }, [bdd]);

    // Deuxième effet : Récupère les données de la table sélectionnée
    useEffect(() => {
        if (selectedTable) {
            // Construit l'URL avec les paramètres pertinents
            const filterString = encodeURIComponent(JSON.stringify(filters));
            let url = `http://localhost:8000/api/${bdd}/${selectedTable}?page=${page}&limit=${nbLines}&filter=${filterString}`;

            // Ajoute le paramètre de tri si nécessaire
            if (sort.column !== null) {
                const sortString = encodeURIComponent(JSON.stringify({[sort.column]: sort.order}));
                url += `&sort=${sortString}`;
            }

            // Fait la requête API pour obtenir les données
            axios.get(url)
                .then(response => {
                    setInfoTable(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données', error);
                });
        } else {
            // Si aucune table n'est sélectionnée, réinitialise les données
            setInfoTable([]);
        }
    }, [selectedTable, page, nbLines, filters, sort]);

    // Troisième effet : Récupère les noms des colonnes de la table sélectionnée
    useEffect(() => {
        selectedTable ?
            axios.get(`http://localhost:8000/api/${bdd}/${selectedTable}/colonnes`)
                .then(response => {
                    setTableColumns(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des noms de colonne', error);
                })
            : setTableColumns([]);
    }, [selectedTable]);

    // Quatrième effet : Récupère le nombre total de lignes dans la table sélectionnée
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
                        console.error('Erreur lors de la récupération du compte', error);
                    });
            })()
            : setCount(0);
    }, [selectedTable, filters]);

    // Cinquième effet : Récupère le nom de la clé primaire de la table sélectionnée
    useEffect(() => {
        selectedTable &&
        axios.get(`http://localhost:8000/api/${bdd}/${selectedTable}/primarykey`)
            .then(response => {
                setPrimaryKey(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la clé primaire', error);
            });
    }, [selectedTable]);

    // Sixième effet : Récupère les clés étrangères de toutes les tables
    useEffect(() => {
       axios.get(`http://localhost:8000/api/${bdd}/allforeignkeys`)
         .then(response => {
           setAllForeignKeys(response.data);
         })
         .catch(error => {
           console.error('Erreur lors de la récupération des clés étrangères', error);
         });
    }, []);

    // Septième effet : Récupère les clés primaires de toutes les tables
    useEffect(() => {
        axios.get(`http://localhost:8000/api/${bdd}/allprimarykeys`)
            .then(response => {
                // Si la requête est réussie, on stocke toutes les clés primaires renvoyées par le serveur
                setAllPrimaryKeys(response.data);
            })
            .catch(error => {
                // En cas d'erreur lors de la requête, on affiche une erreur dans la console
                console.error('Error fetching primary keys', error);
            });
    }, []);

    // Huitième effet : Récupère les colonnes de toutes les tables
    useEffect(() => {
        // Crée un tableau de promesses pour chaque table afin d'obtenir leurs colonnes
        const promises = tableNames.map((tableName) =>
            axios.get(`http://localhost:8000/api/${bdd}/${tableName}/colonnes`)
        );

        // Exécute toutes les promesses simultanément
        Promise.all(promises)
            .then((responses) => {
                // Crée un objet pour stocker les colonnes de chaque table
                const newTableColumns = {};

                // Pour chaque réponse, ajoute les colonnes renvoyées par le serveur à l'objet
                responses.forEach((response, i) => {
                    const tableName = tableNames[i];
                    newTableColumns[tableName] = response.data;
                });

                // Met à jour l'état du composant avec l'objet contenant les colonnes de chaque table
                setAllTableColumns(newTableColumns);
            })
            .catch((error) => {
                // Si une erreur survient pendant une des requêtes, on affiche une erreur dans la console
                console.error('Error fetching column names', error);
            });
    }, [tableNames]);

    // Utilisation du hook useNavigate pour naviguer entre les routes
const navigate = useNavigate();

// Calcul du nombre total de pages basé sur le compte des éléments et la taille de la page (10 éléments par page)
let totalPages = Math.ceil(count / 10);

// Gestion de l'entrée utilisateur pour la pagination
function handleInputChange(event) {
    let inputValue = Number(event.target.value);

    // Si l'utilisateur entre un nombre inférieur à 1, fixez-le à 1
    if (inputValue >= 1) {
        setPage(Number(event.target.value));
    }

    // Si l'utilisateur entre un nombre supérieur au nombre total de pages, fixez-le au maximum
    if (inputValue > totalPages) {
        setPage(totalPages);
    }
}

// Navigation vers la page suivante
function nextPage() {
    if (page < totalPages) {
        setPage(page + 1);
    }
}

// Navigation vers la page précédente
function previousPage() {
    if (page > 1) {
        setPage(page - 1);
    }
}

// Navigation vers la première page
function putDataAtBegin() {
    setPage(1);
}

// Navigation vers la dernière page
function putDataAtEnd() {
    setPage(totalPages);
}

// Gestion du tri des colonnes
const handleSort = (columnName) => {
    let newSort = { column: columnName, order: 'ASC' };

    // Si on clique à nouveau sur la même colonne, on change l'ordre du tri ou on le réinitialise
    if (sort.column === columnName) {
        switch (sort.order) {
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

    // On revient toujours à la première page lors d'un tri et on applique le tri choisi
    setPage(1);
    setSort(newSort);
}


    // Retour du composant
return (
    // Container principal
    <div>
        {/*En-tête de la sélection*/}
        <div className="selected-header">
            {/*Si une table est sélectionnée et qu'il y a plus d'une page*/}
            {selectedTable && totalPages !== 1 ?
                // Conteneur de navigation pour se déplacer entre les pages
                <div className="div-navigation">
                    {/*Bouton pour aller à la première page*/}
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheFinGauche} alt="flecheFinGauche" onClick={() => putDataAtBegin()} />

                    {/*Bouton pour aller à la page précédente*/}
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheGauche} alt="flecheGauche" onClick={() => previousPage()} />

                    {/*Entrée pour sélectionner un numéro de page spécifique*/}
                    <input className="input-page" type="number" value={page} min={1} onChange={handleInputChange} />

                    {/*Bouton pour aller à la page suivante*/}
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheDroite} alt="flecheDroite" onClick={() => nextPage()} />

                    {/*Bouton pour aller à la dernière page*/}
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheFinDroite} alt="flecheFinDroite" onClick={() => putDataAtEnd()} />
                </div>
            : null}

            {/*Sélecteur pour choisir une table à afficher*/}
            <div className="div-select-table">
                <select className="select-select-table" value={selectedTable} onChange={e =>  { setPage(1); setFilters({}); setSelectedTable(e.target.value)}}>
                    <option value="">Sélectionner une table</option>
                    {tableNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>

                {/*Bouton pour activer/désactiver le mode édition si l'utilisateur est connecté*/}
                {isLoggedIn &&
                    <button
                        className={`table-edit ${editMode ? "editor-active" : ""}`}
                        onClick={() => setEditMode(!editMode)} >
                        { editMode ? "Enlever le mode éditeur" : "Mode éditeur" }
                    </button>
                }
            </div>
        </div>

        {/*Conteneur principal pour la table*/}
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {/*Crée un en-tête de colonne pour chaque colonne*/}
                        {tableColumns.map((columnName, index) => (
                            <th key={index} onClick={() => {handleSort(columnName); setPage(1)}}>
                                {/*Contenu de la colonne*/}
                                <div className="column-content">
                                    {/*Nom de la colonne*/}
                                    <div className="titleColumn">
                                        {columnName}
                                        {/*Indicateur de tri pour la colonne*/}
                                        {
                                            sort.column === columnName
                                                ? sort.order === 'ASC'
                                                    ? <img className="triangle-bas" src={triangleBas} alt="triangleBas" />
                                                    : <img className="triangle-bas" src={triangleHaut} alt="triangleHaut" />
                                                : null
                                        }
                                    </div>

                                    {/*Champ de saisie pour filtrer les données de la colonne*/}
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
                    {/*Affiche chaque ligne de données de la table*/}
                    {infoTable.map((row, index) => (
                        <tr className={`case-table ${editMode ? "editor" : ""}`} key={index} onClick={() => {
                            if(!editMode) {
                                // Si on n'est pas en mode édition, navigate vers la page de détails de la ligne
                                navigate(`/${bdd}/row/${selectedTable}/${primaryKey.primaryKey}/${row[0]}`)
                            }
                        }}>
                            {/*Affiche chaque cellule de la ligne*/}
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} onClick={(e) => {
                                    if(editMode) {
                                        // En mode édition, stoppe la propagation et navigue vers la page d'édition de la cellule
                                        e.stopPropagation();
                                        navigate(`/${bdd}/edit/${selectedTable}/${primaryKey.primaryKey}/${row[0]}/${tableColumns[cellIndex]}/${cell}`)
                                    }
                                }}>
                                    {/*Affiche la valeur de la cellule*/}
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


}

export default BDD