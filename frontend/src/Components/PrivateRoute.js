import { Navigate, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Navigate to="/connexion" replace />
      }
    />
  );
}

export default PrivateRoute;
