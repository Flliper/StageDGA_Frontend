import {useParams} from "react-router-dom";
import {useState} from "react";

function Tests() {

  const [incr, setIncr] = useState(0);

  return (
    <div>
        <button onClick={() => setIncr(incr + 1)}>Incrémenter</button>
        <p>{incr}</p>
    </div>
  );
}

export default Tests;