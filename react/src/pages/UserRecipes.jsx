import {useEffect, useState} from "react";
import axiosClient from "../methods/axiosClient.js";
import {Link} from "react-router-dom";

export default function UserRecipes() {

  const [recipesInfo, setRecipesInfo] = useState([]);
  const [error, setErrors] = useState(null);

  useEffect(() => {
    setErrors(null)
    axiosClient.get('/user/recipes')
      .then(({data}) => {
        setRecipesInfo(data);
      })
      .catch((error) => {
        setErrors(error);
      })
  }, []);

  const onDelete = (id) => {
    axiosClient.delete(`/recipe/${id}`)
      .then(() => {
      window.location.reload();
      })
      .catch((error) => {
        setErrors(error)
      })

  }
  return (
    <div>
      <h2>Mes recettes</h2>
      {error &&
        <p>Une erreur s'est produite! Réessayer plus tard.</p>
      }
      {recipesInfo.length ?
        <ul>
          {recipesInfo.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.recipe_name}</h3>
              <p>Description : {recipe.description}</p>
              <Link to={`/recipe/${recipe.id}`}>Voir la recette</Link>
              <Link to={`/recipe/modifications/${recipe.id}`}>Modifier la recette</Link>
              <button onClick={() => onDelete(recipe.id)}>Supprimer la recette</button>
            </li>
          ))}
        </ul>
        :
        <p>Vous n'avez pas encore de recettes ! <a>Créez-en une !</a></p>
      }
    </div>
  )
}
