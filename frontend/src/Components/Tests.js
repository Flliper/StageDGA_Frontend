import {useContext, useState} from 'react';
import { AuthContext } from './AuthContext';
import '../Styles/Tests.css'

function Test() {
  const authContext = useContext(AuthContext);

  const [test, setTest] = useState(false);

  return (
    <div className="global-test">

        <div className="tab-container-test">
          {authContext.isLoggedIn ? "Vous êtes connecté. Voici votre token :" + authContext.user.token : "Vous n'êtes pas connecté"}
          <button onClick={() => setTest(!test)}>test</button>
        </div>

        <div className="global-test-table">

        <div className="test-block-table">
          <h2> Titre </h2>
      <table>
        <thead>
          <tr>
          <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
        </tr>
        </tbody>
      </table>
        </div>

        <div className="test-block-table">
      <h2>Table 2</h2>
      <table>
        <thead>
          <tr>
          <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
            <th>&nbsp;</th>
          <th>Knocky</th>
          <th>Flor</th>
          <th>Ella</th>
          <th>Juan</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
        </tr>
        <tr>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
          <td>Age</td>
          <td>16</td>
          <td>9</td>
          <td>10</td>
          <td>5</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Propriétaire</td>
          <td>Belle-mère</td>
          <td>Moi</td>
          <td>Moi</td>
          <td>Belle-sœur</td>
          <td>Habitudes alimentaires</td>
          <td>Mange tous les restes</td>
          <td>Grignote la nourriture</td>
          <td>Mange copieusement</td>
          <td>Mange jusqu'à ce qu'il éclate</td>
          <td>Race</td>
          <td>Jack Russell</td>
          <td>Poodle</td>
          <td>Streetdog</td>
          <td>Cocker Spaniel</td>
        </tr>
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
}

export default Test;
