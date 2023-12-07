import {Link} from "react-router-dom";

export default function Header() {
    return(
        <div>
            Header
          <div>
            <a href='/'>Accueil </a>
            <a href='/recipes/entrees'>Entrées </a>
            <a href='/recipes/plats'>Plats </a>
            <a href='/recipes/desserts'>Desserts </a>
          </div>
        </div>
    )
}
