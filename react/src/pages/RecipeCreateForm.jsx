// Composant React pour le formulaire de création de recette
import {useEffect, useState} from "react";
import axios from "axios";
import axiosClient from "../axiosClient.js";

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    recipe_name: "",
    description: "",
    image: null,
    cooking_time: 0,
    break_time: 0,
    preparation_time: 0,
    recipe_portion: 0,
    unit_portion: "",
    advice: "",
    id_tag: 0,
    id_user: 0,
    id_difficulty: 0,
  });

  const [tags, setTags] = useState([]);
  const [users, setUser] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Récupérer les tags depuis le backend
    axiosClient.get("/tags")
      .then((response) => {
        setTags(response.data.tag);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tags :", error);
      });
    // Récupérer les difficultés depuis le backend
    axiosClient.get("/difficulties")
      .then((response) => {
        setDifficulties(response.data.difficulty);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des difficultés :", error);
      });
    // Récupérer les utilisateurs
    axiosClient.get("/users")
      .then((response) => {
        setUser(response.data.users);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des difficultés :", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    let parsedValue = value;

    if (
      name === "id_tag" ||
      name === "id_user" ||
      name === "id_difficulty" ||
      name === "cooking_time" ||
      name === "break_time" ||
      name === "preparation_time" ||
      name === "recipe_portion"
    ) {
      parsedValue = parseInt(value);
    }

    setFormData({...formData, [name]: parsedValue});
  };

  const handleFileChange = (e) => {
    setFormData({...formData, image: e.target.files[0]});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      recipe_name,
      description,
      image,
      cooking_time,
      break_time,
      preparation_time,
      recipe_portion,
      unit_portion,
      advice,
      id_tag,
      id_difficulty,
      id_user
    } = formData;

    const recipeData = new FormData();
    recipeData.append("recipe_name", recipe_name);
    recipeData.append("description", description);
    recipeData.append("image", image);
    recipeData.append("cooking_time", cooking_time);
    recipeData.append("break_time", break_time);
    recipeData.append("preparation_time", preparation_time);
    recipeData.append("recipe_portion", recipe_portion);
    recipeData.append("unit_portion", unit_portion);
    recipeData.append("advice", advice);
    recipeData.append("id_tag", id_tag);
    recipeData.append("id_difficulty", id_difficulty);
    recipeData.append("id_user", id_user);

    try {
      const response = await axiosClient.post('/recipes', recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Réinitialiser le formulaire ou rediriger l'utilisateur après la création de la recette
    } catch (error) {
      // Gérer les erreurs d'envoi du formulaire
      console.error(error);
      setErrors(error);
    }
  };

  return (
    <div>
      {errors &&
        <div>
          {errors.map((error, key) => (
            <p key={key}>{error.message}</p>
          ))}
        </div>
      }
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="recipe_name"
          value={formData.recipe_name}
          onChange={handleInputChange}
          placeholder="Nom de la recette"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Ajouter une description"
        />
        <div>
          <label htmlFor="image">Photo de la recette</label>
          <input type="file" name="image" onChange={handleFileChange}/>
        </div>
        <div>
          <label htmlFor="cooking_time">Temps de cuisson :</label>
          <input type="number" name="cooking_time" onChange={handleInputChange} value={formData.cooking_time}/>
        </div>
        <div>
          <label htmlFor="break_time">Temps de repos :</label>
          <input type="number" name="break_time" onChange={handleInputChange} value={formData.break_time}/>
        </div>
        <div>
          <label htmlFor="preparation_time">Temps de préparation :</label>
          <input type="number" name="preparation_time" onChange={handleInputChange} value={formData.preparation_time}/>
        </div>
        <div>
          <label htmlFor="recipe_portion">Quantité :</label>
          <input type="number" name="recipe_portion" onChange={handleInputChange} placeholder="6"
                 value={formData.recipe_portion}/>
          <input type="text" name="unit_portion" onChange={handleInputChange} placeholder="personnes"
                 value={formData.unit_portion}/>
        </div>
        <div>
          <label htmlFor="advice">Conseils :</label>
          <textarea name="advice" onChange={handleInputChange} value={formData.advice} placeholder="Facultatif..."/>
        </div>
        <div>
          <label htmlFor="id_tag">Choisir un tag :</label>
          <select name="id_tag" onChange={handleInputChange} value={formData.id_tag}>
            <option value="">Sélectionner un tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.tag_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="id_difficulty">Indiquer la difficulté :</label>
          <select name="id_difficulty" onChange={handleInputChange} value={formData.id_difficulty}>
            <option value="">Sélectionner une difficulté</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty.id} value={difficulty.id}>
                {difficulty.difficulty_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="id_user">Indiquer l'utilisateur :</label>
          <select name="id_user" onChange={handleInputChange} value={formData.id_user}>
            <option value="">Sélectionner un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
