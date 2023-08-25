// Importation des bibliothèques et modules nécessaires
import React, { createContext, useState } from "react";

// Création et exportation d'un contexte d'authentification. Il sera utilisé pour fournir et consommer des informations d'authentification
// dans divers composants de l'application.
export const AuthContext = createContext();

// Définition et exportation du fournisseur d'authentification (AuthProvider). Ce composant englobera d'autres composants qui auront besoin d'accéder
// aux informations et fonctions d'authentification.
export const AuthProvider = (props) => {
  // Mise en place d'une valeur initiale pour le token dans le stockage local.
  // Cependant, cela semble étrange car cela écrase toujours la valeur du token à null à chaque fois que le composant AuthProvider est monté.
  localStorage.setItem('token', null)

  // Définition des états relatifs à l'authentification.
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // État indiquant si l'utilisateur est connecté ou non.
  const [user, setUser] = useState(null);  // État contenant les informations de l'utilisateur connecté.

  // Fonction pour connecter l'utilisateur.
  const logIn = (userDetails) => {
    setIsLoggedIn(true);  // Mise à jour de l'état pour indiquer que l'utilisateur est maintenant connecté.
    setUser(userDetails);  // Mise à jour des informations de l'utilisateur.
    localStorage.setItem('token', userDetails.token);  // Stockage du token utilisateur dans le stockage local pour une utilisation ultérieure.
  }

  // Fonction pour déconnecter l'utilisateur.
  const logOut = () => {
    setIsLoggedIn(false);  // Mise à jour de l'état pour indiquer que l'utilisateur est maintenant déconnecté.
    setUser(null);  // Suppression des informations de l'utilisateur.
    localStorage.removeItem('token');  // Suppression du token du stockage local.
  }

  // Le rendu du composant : il fournit les informations et fonctions d'authentification aux composants enfants.
  return (
    // Le contexte d'authentification enveloppe les composants enfants et leur fournit la valeur spécifiée.
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, user }}>
      {props.children} 
    </AuthContext.Provider>
  );
};
