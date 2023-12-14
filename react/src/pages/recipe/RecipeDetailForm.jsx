import {useEffect, useState} from "react";
import axiosClient from "../../methods/axiosClient.js";

export default function RecipeDetailForm(recipeId) {
  const [recipesDetails, setRecipeDetails] = useState([]);

  useEffect(() => {
    axiosClient.get('/user/recipes')
      .then(({data}) => {
        console.log(data)
        setRecipeDetails(data);
      })
      .catch((error) => {
        console.error(error)
      })
  }, []);
  return (
    <div>
      Formulaire de modification de la recette
    </div>
  )
}
