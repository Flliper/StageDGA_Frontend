import '../Styles/ForeignKeysBis.css';
import flecheDroite from '../Assets/angle-droit.svg';
import flecheFinGauche from '../Assets/angle-double-gauche.svg';
import flecheFinDroite from '../Assets/angle-double-droit.svg';
import flecheGauche from '../Assets/angle-gauche.svg';
import triangleBas from '../Assets/triangle_bas.svg';
import triangleHaut from '../Assets/triangle_haut.svg';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";



function ForeignKeysBis({table, columnName, columnValue, allTableColumns, originalTable, allPrimaryKeys, allForeignKeys }) {

    // Utilisation des params pour récupérer la base de données
    const { bdd } = useParams();

    // Initialisation des états
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({column: null, order: null});
    const [dataTable, setDataTable] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [count, setCount] = useState(0);
    const [primaryKey, setPrimaryKey] = useState(null);

    // Hook pour naviguer
    const navigate = useNavigate();

    let limit = 10;
    let totalPages = count === 0 ? 1 : Math.ceil(count / 10);

    // Création d'un nouvel objet pour stocker les tables et les colonnes liées
    const newForeignTables = {};

    // Parcourir les clés étrangères pour remplir newForeignTables
    for (let [key, value] of Object.entries(allForeignKeys)) {
        for (let innerArray of value) {
            if (innerArray[1] === originalTable && innerArray[2] === columnName) {
                newForeignTables[key] = innerArray[0];
            }
        }
    }
    // Parcourir les clés primaires pour remplir newForeignTables
    for (let [key, value] of Object.entries(allPrimaryKeys)) {
        if (value === columnName) {
            newForeignTables[key] = value;
        }
    }
    // Ajoute la table initiale à newForeignTables
    newForeignTables[originalTable] = columnName;

    // Déterminer la colonne adaptée pour la table courante
    const adaptedColumnName = newForeignTables[table];

    // Récupère les données de la table en utilisant l'API
    useEffect(() => {
        if (table) {
            const filterString = encodeURIComponent(JSON.stringify(filters));
            let url = `http://localhost:8000/api/${bdd}/${table}?page=${page}&limit=${limit}&filter=${filterString}`;

            if (sort.column !== null) {
                const sortString = encodeURIComponent(JSON.stringify({[sort.column]: sort.order}));
                url += `&sort=${sortString}`;
            }

            // Si on a une colonne adaptée et une valeur, les ajouter à l'URL
            if (adaptedColumnName && columnValue) {
                url += `&columnName=${encodeURIComponent(adaptedColumnName)}&columnValue=${encodeURIComponent(columnValue)}`;
            }
            axios.get(url)
                .then(response => {
                    setDataTable(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données', error);
                });
        } else {
            setDataTable([]);
        }
    }, [table, page, limit, filters, sort, columnName, columnValue]);

    // Récupère les noms des colonnes de la table
    useEffect(() => {
        if (table) {
            axios.get(`http://localhost:8000/api/${bdd}/${table}/colonnes`)
                .then(response => {
                    setTableColumns(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des noms des colonnes', error);
                });
        } else {
            setTableColumns([]);
        }
    }, [table]);

    // Récupère le nombre total de lignes de la table
    useEffect(() => {
        if (table) {
            const filterString = encodeURIComponent(JSON.stringify(filters));
            let url = `http://localhost:8000/api/${bdd}/${table}/count?filter=${filterString}`;
            if (adaptedColumnName && columnValue) {
                url += `&columnName=${encodeURIComponent(adaptedColumnName)}&columnValue=${encodeURIComponent(columnValue)}`;
            }
            axios.get(url)
                .then(response => {
                    setCount(response.data.count);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nombre de lignes', error);
                });
        } else {
            setCount(0);
        }
    }, [table, filters, columnValue]);

    // Récupère le nom de la clé primaire de la table
    useEffect(() => {
        if (table) {
            axios.get(`http://localhost:8000/api/${bdd}/${table}/primarykey`)
                .then(response => {
                    setPrimaryKey(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de la clé primaire', error);
                });
        }
    }, [table]);

    // Gérer le changement de la page entrée par l'utilisateur
    function handleInputChange(event) {
        let inputValue = Number(event.target.value);
        // Empêche l'utilisateur de saisir 0
        if (inputValue >= 1) {
            setPage(inputValue);
        }
        // Empêche l'utilisateur de saisir un nombre supérieur au nombre total de pages
        if (inputValue > totalPages) {
            setPage(totalPages);
        }
    }

    // Fonctions pour naviguer entre les pages
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

    // Gérer le tri des colonnes
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
        setSort(newSort);
    }


    // Rendu JSX du composant
    return (
        // Conteneur principal pour les clés étrangères de la table
        <div className="block-table-foreign-keys">
            <div className="header">
                {/* Affiche les boutons de navigation uniquement si la table est sélectionnée et il y a plus d'une page */}
                {table && totalPages !== 1 ?
                    <div className="navigation">
                        {/* Bouton pour aller à la première page */}
                        <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheFinGauche} alt="flecheFinGauche" onClick={() => putDataAtBegin()} />
                        {/* Bouton pour aller à la page précédente */}
                        <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheGauche} alt="flecheGauche" onClick={() => previousPage()} />
                        {/* Input pour indiquer et modifier la page actuelle */}
                        <input className="input-page" type="number" value={page} min={1} onChange={handleInputChange} />
                        {/* Bouton pour aller à la page suivante */}
                        <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheDroite} alt="flecheDroite" onClick={() => nextPage()} />
                        {/* Bouton pour aller à la dernière page */}
                        <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheFinDroite} alt="flecheFinDroite" onClick={() => putDataAtEnd()} />
                    </div>
                : null}
                {/* Affiche le nom de la table sélectionnée */}
                <h2 className="table-title"> Table : {table}</h2>
            </div>
            {/* Tableau d'affichage des données */}
            <table>
                <thead>
                    <tr>
                        {/* En-tête de la table: boucle sur les colonnes de la table */}
                        {(allTableColumns[table] || []).map((columnName, index) => (
                            <th key={index} onClick={() => {handleSort(columnName); setPage(1)}}>
                                <div className="column-content">
                                    <div className="titleColumn">
                                        {/* Nom de la colonne */}
                                        {columnName}
                                        {/* Indicateur de tri: affiche une icône différente selon l'ordre de tri */}
                                        {
                                            sort.column === columnName
                                            ? sort.order === 'ASC'
                                                ? <img className="triangle-bas" src={triangleBas} alt="triangleBas" />
                                                : <img className="triangle-bas" src={triangleHaut} alt="triangleHaut" />
                                            : null
                                        }
                                    </div>
                                    {/* Champ pour filtrer les données selon cette colonne */}
                                    <input
                                        onClick={(e) => e.stopPropagation()} // Empêche le clic sur l'input de déclencher l'événement onClick du parent
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
                    {/* Corps de la table: boucle sur chaque ligne de données */}
                    {dataTable.map((row, index) => (
                        <tr key={index} className="case-table">
                            {/* Pour chaque cellule de la ligne */}
                            {row.map((cell, cellIndex) => (
                                // Lors d'un clic sur une cellule, navigue vers le détail de la ligne
                                <td key={cellIndex} onClick={() => {navigate(`/${bdd}/row/${table}/${allPrimaryKeys[table]}/${row[0]}`)}}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    }


export default ForeignKeysBis;