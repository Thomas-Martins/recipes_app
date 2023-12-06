import {useEffect, useState} from "react";
import getRecipesByTag from "../components/getRecipesByTag.js";
export default function Plats() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    setLoading(true);
    getRecipesByTag('plats')
      .then((recipesData) => {
        setRecipes(recipesData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // Gérer les erreurs ici
      });
  }, []);

  return (
    <div>
      Recette avec le tag Plats
      {loading ?
        <p>Loading...</p>
        :
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
      }
    </div>
  )
}
