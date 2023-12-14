import {useEffect, useState} from "react";
import getRecipesById from "../../methods/getRecipesById.js";
import {Link, useParams} from "react-router-dom";
import Image from "../../components/Image.jsx";

export default function RecipeDetails() {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [recipeDetails, setRecipesDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getRecipesById(`${id}`)
      .then((recipeData) => {
        console.log(recipeData)
        setRecipesDetails(recipeData);
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Une erreur s'est produite : {error.message}</p>
        ) : (
          <div>
            <h1>{recipeDetails.recipe_name}</h1>
            <h5>Crée par : {recipeDetails.userName}</h5>
            {recipeDetails.imageUrl && <Image imagePath={recipeDetails.imageUrl}/>}
            <div>
              <p>{recipeDetails.difficultyName}</p>
              <p>Temps de la recette
                : {recipeDetails.preparation_time + recipeDetails.break_time + recipeDetails.cooking_time} min</p>
            </div>
            <div>
              <p>Pour : {recipeDetails.recipe_portion + " " + recipeDetails.unit_portion}</p>
            </div>
            <div>
              <p>Liste des Ingrédients: </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
