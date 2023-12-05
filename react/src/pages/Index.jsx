import {Link} from "react-router-dom";

export default function Index() {
    return(
        <div>
            Page d'accueil
          <Link to='/recipes'>Recettes</Link>
          <Link to='/recipes/entrées'>Entrées</Link>
          <Link to='/recipes/plats'>Plats</Link>
          <Link to='/recipes/desserts'>Desserts</Link>
        </div>
    )
}
