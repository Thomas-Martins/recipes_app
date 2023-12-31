import {useEffect, useState} from "react";
import getRecipesByTag from "../methods/getRecipesByTag.js";
import {Link} from "react-router-dom";
import Image from "./Image.jsx";

export default function RecipesListByTag({tag}) {

  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRecipesByTag(`${tag}`)
      .then((recipesData) => {
        setRecipes(recipesData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Gérer les erreurs ici
        setError(error);
      });
  }, []);

  return (
    <div>
      <div>
        <p>Page recettes avec le tag : "{tag}" mis en paramètre</p>
      </div>
      <Link to="/recipes/create">Ajouter une recette</Link>
      <div>
        Recette avec le tag {tag}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Une erreur s'est produite : {error.message}</p>
        ) : (
          <div>
            {recipes.map((recipe, key) => (
              <ul key={key}>
                <li>{recipe.recipe_name}</li>
                <li>Tag: {recipe.tagName}</li>
                <li>User: {recipe.userName}</li>
                <li>Difficulty: {recipe.difficultyName}</li>
                {recipe.image && (
                  <Image imagePath={recipe.image.url}/>
                )}
                <Link to={`/recipe/${recipe.id}`}>Voir la recette</Link>
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
