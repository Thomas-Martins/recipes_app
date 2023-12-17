import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axiosClient from "../methods/axiosClient.js";
import RecipeUpdateForm from "./RecipeUpdateForm.jsx";

export default function RecipeDetailForm(recipeId) {
  const {id} = useParams();
  const [recipeInfo, setRecipeInfo] = useState(null);

  useEffect(() => {
    axiosClient.get(`/recipe/${id}`)
      .then(({ data }) => {
        // console.log(data)
        setRecipeInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
  },[id])

  return (
    <div>
      <h1>Formulaire de modification de la recette</h1>
      {recipeInfo &&
        <RecipeUpdateForm/>
      }
    </div>
  )
}
