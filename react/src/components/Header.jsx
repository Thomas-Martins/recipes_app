import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../methods/axiosClient.js";
import {useEffect} from "react";

export default function Header() {

  const {token, user, setUser, setToken} = useStateContext();

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null);
      })
  }

  useEffect(() => {
    if (token) {
      axiosClient.get('/user')
        .then(({data}) => {
          setUser(data)
        })
    }
  }, []);

  return (
    <div>
      Header
      <div>
        <a href='/'>Accueil </a>
        <a href='/recipes/entrees'>Entrées </a>
        <a href='/recipes/plats'>Plats </a>
        <a href='/recipes/desserts'>Desserts </a>
        {token ?
          <div>
            <div>
              <p>Utilisateur connecté : {user.username}</p>
              <a href="/user/dashboard">Mon Compte</a>
            </div>
            <button onClick={onLogout}>Déconnexion</button>
          </div>
          :
          <a href="/login">Connexion</a>
        }

      </div>

    </div>
  )
}
