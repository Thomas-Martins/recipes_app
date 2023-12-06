import {useEffect, useState} from "react";
import getRecipesByTag from "../components/getRecipesByTag.js";

export default function Entrees() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRecipesByTag('entrees')
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
      Recette avec le tag Entrées
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
            </ul>
          ))}
        </div>
      )}
    </div>
  )
}
