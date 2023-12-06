import axiosClient from "../axiosClient.js";
import {useEffect, useState} from "react";
import {Link, Outlet} from "react-router-dom";


export default function Recipes() {
  // const [loading, setLoading] = useState(false);
  // const [recipes, setRecipes] = useState([]);
  //
  // useEffect(() => {
  //   getRecipes();
  // },[])
  // const getRecipes = () => {
  //   setLoading(true);
  //   axiosClient.get('/recipes')
  //     .then(async ({data}) => {
  //       setLoading(false)
  //       const recipesData = await Promise.all(data.recipe.map(async (recipe) => {
  //         //On récupère les données liés aux IDs
  //         const tag = await axiosClient.get(`/tags/${recipe.id_tag}`)
  //         const user = await axiosClient.get(`/users/${recipe.id_user}`);
  //         const difficulty = await axiosClient.get(`/difficulties/${recipe.id_difficulty}`);
  //
  //         return {
  //           ...recipe,
  //           tagName: tag.data.data.tag_name,
  //           userName: user.data.data.username,
  //           difficultyName: difficulty.data.data.difficulty_name
  //         };
  //       }))
  //       setRecipes(recipesData)
  //       console.log(recipesData)
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     })
  // }
  return (
    <div>
      Page de toutes les recettes
      <Link to='/'>Accueil</Link>
      <Outlet/>
      {/*{loading ?*/}
      {/*  <p>Loading...</p>*/}
      {/*  :*/}
      {/*  <div>*/}
      {/*  {recipes.map((recipe,key) => (*/}
      {/*    <ul key={key}>*/}
      {/*      <li >{recipe.recipe_name}</li>*/}
      {/*      <li>Tag: {recipe.tagName}</li>*/}
      {/*      <li>User: {recipe.userName}</li>*/}
      {/*      <li>Difficulty: {recipe.difficultyName}</li>*/}
      {/*    </ul>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*}*/}
    </div>
  )
}
