import '../Styles/Table.css';
import flecheDroite from '../Assets/angle-droit.svg';
import flecheFinGauche from '../Assets/angle-double-gauche.svg';
import flecheFinDroite from '../Assets/angle-double-droit.svg';
import flecheGauche from '../Assets/angle-gauche.svg';
import triangleBas from '../Assets/triangle_bas.svg';
import triangleHaut from '../Assets/triangle_haut.svg';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";



function Table({selectedTable, allTableColumns }) {

    const { bdd, table, columnName, columnValue } = useParams();
    console.log(columnName, columnValue)

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({column: null, order: null});
    const [dataTable, setDataTable] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [count, setCount] = useState(0);
    const [primaryKey, setPrimaryKey] = useState(null);

    const navigate = useNavigate();

    let limit = 10;
    let totalPages = Math.ceil(count / 10);


    // Récupère les données de la table sélectionnée
    useEffect(() => {
        if (table) {
            const filterString = encodeURIComponent(JSON.stringify(filters));
            let url = `http://localhost:8000/api/${bdd}/${table}?page=${page}&limit=${limit}&filter=${filterString}`;

            if (sort.column !== null) {
                const sortString = encodeURIComponent(JSON.stringify({[sort.column]: sort.order}));
                url += `&sort=${sortString}`;
            }

            // Ajout des paramètres columnName et columnValue
            if (columnName && columnValue) {
                url += `&columnName=${encodeURIComponent(columnName)}&columnValue=${encodeURIComponent(columnValue)}`;
            }

            axios.get(url)
                .then(response => {
                    setDataTable(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data', error);
                });
        } else {
            setDataTable([]);
        }
    }, [selectedTable, page, limit, filters, sort, columnName, columnValue]);


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
                const url = `http://localhost:8000/api/${bdd}/${selectedTable}/count?filter=${filterString}
                &column=${columnName}&value=${columnValue}`;
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
        setSort(newSort);
}



    return (
        <div>
            <div className="header">
                {table && totalPages !== 1 ?
                  <div className="navigation">
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheFinGauche} alt="flecheFinGauche" onClick={() => putDataAtBegin()} />
                    <img className={`fleche-gauche ${page === 1 ? 'disabled' : ''}`}  src={flecheGauche} alt="flecheGauche" onClick={() => previousPage()} />
                    <input className="input-page" type="number" value={page} min={1} onChange={handleInputChange} />
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheDroite} alt="flecheDroite" onClick={() => nextPage()} />
                    <img className={`fleche-droite ${page === totalPages ? 'disabled' : ''}`} src={flecheFinDroite} alt="flecheFinDroite" onClick={() => putDataAtEnd()} />
                  </div>
                : null}
            </div>
            <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {(allTableColumns[table] || []).map((columnName, index) => (
                        <th key={index} onClick={() => handleSort(columnName)}>
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
                    {dataTable.map((row, index) => (
                      <tr key={index} className="case-table">
                        {Object.entries(row).map(([columnName, cell], cellIndex) => (
                          <td key={cellIndex} onClick={() => navigate(`/${bdd}/row/${table}/${cell}`)}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    );
    }

export default Table;