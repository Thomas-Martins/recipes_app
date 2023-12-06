import {useEffect, useState} from "react";
import getRecipesByTag from "../components/getRecipesByTag.js";

export default function Desserts() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRecipesByTag('desserts')
      .then((recipesData) => {
        setRecipes(recipesData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Gérer les erreurs ici
        setError(error)
      });
  }, []);

  return (
    <div>
      Recette avec le tag Desserts
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Une erreur s'est produite : {error.message}</p>
      ) : (
        <div>
          {recipes.length > 0 ?
            recipes.map((recipe, key) => (
              <ul key={key}>
                <li>{recipe.recipe_name}</li>
                <li>Tag: {recipe.tagName}</li>
                <li>User: {recipe.userName}</li>
                <li>Difficulty: {recipe.difficultyName}</li>
              </ul>
            ))
            :
            <p>Désolé, une erreur s'est produite!</p>
          }
        </div>
      )}
    </div>
  )
}
