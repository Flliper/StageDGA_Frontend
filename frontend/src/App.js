import Accueil from "./Components/Accueil"
import {BrowserRouter as Router, Route, Link, Routes, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from 'axios';
import './Styles/App.css';
import BDD from "./Components/BDD";
import Tests from "./Components/Tests";
import Navbar from "./Components/Navbar";
import RowDetails from "./Components/RowDetails";
import ForeignKeys from "./Components/ForeignKeys";
import Onglet from "./Components/Onglet";




function App() {

    const bdd = useParams().bdd

    const [tableNames, setTableNames] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [infoTable, setInfoTable] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(100);
    const [nbLines, setNbLines] = useState(10);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({column: null, order: null});
    const [primaryKey, setPrimaryKey] = useState(null);
    const [allForeignKeys, setAllForeignKeys] = useState({});
    const [allTableColumns, setAllTableColumns] = useState({});
    const [allPrimaryKeys, setAllPrimaryKeys] = useState({});






  return (
  <div className="App">
    <Navbar />
       <div className="main-content">
        <Routes>
          <Route path="/" element={<Accueil setSelectedTable={setSelectedTable}/>}/>
          <Route path="/test" element={<><Tests /><Tests /></>} />
          <Route path="/:bdd/row/:table/:column/:id" element={<Onglet tableColumns={tableColumns} setTableColumns={setTableColumns} />}  />
          <Route path="/:bdd" element={
            <BDD selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                 tableNames={tableNames} tableColumns={tableColumns} infoTable={infoTable}
                 page={page} setPage={setPage} count={count} filters={filters} setFilters={setFilters}
                 sort={sort} setSort={setSort} setPrimaryKey={setPrimaryKey}
                 nbLines={nbLines} setTableNames={setTableNames}
                 setInfoTable={setInfoTable} setTableColumns={setTableColumns} setCount={setCount}
                 setAllForeignKeys={setAllForeignKeys} setAllTableColumns={setAllTableColumns}
                 setAllPrimaryKeys={setAllPrimaryKeys} allTableColumns={allTableColumns} primaryKey={primaryKey}

            />
          }/>
          <Route path="/:bdd/row/:table/:column/:id" element={<RowDetails tableColumns={tableColumns} setTableColumns={setTableColumns} />} />
          <Route path="/:bdd/occurrences/:table/:columnName/:columnValue" element={<ForeignKeys allForeignKeys={allForeignKeys}
          allTableColumns={allTableColumns} allPrimaryKeys={allPrimaryKeys} primaryKey={primaryKey} />} />






        </Routes>
       </div>
  </div>
);

}

export default App;
