import {useEffect, useState} from "react";
import axiosClient from "../methods/axiosClient.js";

export default function UserRecipes() {

  const [recipesInfo, setRecipesInfo] = useState([]);

  useEffect(() => {
    axiosClient.get('/user/recipes')
      .then(({data}) => {
        console.log(data)
        setRecipesInfo(data);
      })
      .catch((error) => {
        console.error(error)
      })
  }, []);

  return (
    <div>
      <h2>Mes recettes</h2>
      <ul>
        {recipesInfo.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.recipe_name}</h3>
            <p>Description : {recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
