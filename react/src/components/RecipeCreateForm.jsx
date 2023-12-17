import {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Navigate} from "react-router-dom";
import {getDifficulties, getTags} from "../methods/recipeHelpers.js";
import axiosClient from "../methods/axiosClient.js";

const RecipeCreateForm = () => {
  const {token} = useStateContext();
  const [formData, setFormData] = useState({
    id: 0,
    recipe_name: "",
    description: "",
    cooking_time: 0,
    break_time: 0,
    preparation_time: 0,
    recipe_portion: 0,
    unit_portion: "",
    advice: "",
    id_tag: 0,
    id_user: 0,
    id_difficulty: 0,
    image: null,
  });
  const [tags, setTags] = useState([]);
  // const [userId, setUserId] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [errors, setErrors] = useState([]);


  // Vérification du token
  if (!token) {
    return <Navigate to="/login"/>;
  }

  // Récupère les listes de tags, utilisateurs, difficultés
  useEffect(() => {
    getDifficulties(setDifficulties);
    getTags(setTags);
    getIdCurrentUser();
  }, [setTags, setDifficulties, setFormData, token]);


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
      parsedValue = parseInt(value, 10);
    }
    setFormData({...formData, [name]: parsedValue});
  };

  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('recipe_name', formData.recipe_name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append("cooking_time", formData.cooking_time);
      formDataToSend.append("break_time", formData.break_time);
      formDataToSend.append("preparation_time", formData.preparation_time);
      formDataToSend.append("recipe_portion", formData.recipe_portion);
      formDataToSend.append("unit_portion", formData.unit_portion);
      formDataToSend.append("advice", formData.advice);
      formDataToSend.append("id_tag", formData.id_tag);
      formDataToSend.append("id_difficulty", formData.id_difficulty);
      formDataToSend.append("id_user", formData.id_user);
      formDataToSend.append("image", formData.image);

      const response = await axiosClient.post("/recipes", formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      // Récupérer l'ID de la recette créée depuis la réponse
      const recipeId = response.data.recipe.id;

      window.location.href = `/recipe/${recipeId}`;
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Récupère le premier fichier sélectionné
    setFormData({...formData, image: selectedFile});
  };

  const findTagIdByName = (tagName) => {
    const selectedTag = tags.find((tag) => tag.tag_name === tagName);
    return selectedTag ? selectedTag.id : null;
  };
  // Fonction pour trouver l'ID de l'utilisateur par son nom
  const getIdCurrentUser = () => {
    axiosClient.get('/user')
      .then(({data}) => {
        setFormData({...formData, id_user: data.id});
      })
  };

// Fonction pour trouver l'ID de la difficulté par son nom
  const findDifficultyIdByName = (difficultyName) => {
    const selectedDifficulty = difficulties.find((difficulty) => difficulty.difficulty_name === difficultyName);
    return selectedDifficulty ? selectedDifficulty.id : null;
  };

  return (
    <div>
      {Array.isArray(errors) && errors.length > 0 && (
        <div>
          {errors.map((error, key) => (
            <p key={key}>{error.message}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmitRecipe}>
        <input
          type="text"
          name="recipe_name"
          placeholder="Nom de la recette"
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Ajouter une description"
          onChange={handleInputChange}
        />
        <div>
          <label htmlFor="image">Photo de la recette</label>
          <input type="file" name="image" onChange={handleFileChange}/>
        </div>
        <div>
          <label htmlFor="cooking_time">Temps de cuisson :</label>
          <input type="number" name="cooking_time" onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="break_time">Temps de repos :</label>
          <input type="number" name="break_time" onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="preparation_time">Temps de préparation :</label>
          <input type="number" name="preparation_time" onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="recipe_portion">Quantité :</label>
          <input type="number" name="recipe_portion" placeholder="6" onChange={handleInputChange}/>
          <input type="text" name="unit_portion" placeholder="personnes" onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="advice">Conseils :</label>
          <textarea name="advice" placeholder="Facultatif..." onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="id_tag">Choisir un tag :</label>
          <select name="id_tag" onChange={(e) => setFormData({...formData, id_tag: findTagIdByName(e.target.value)})}>
            <option value="">Sélectionner un tag</option>
            {tags.map((tag) => (
              <option key={tag.id}>
                {tag.tag_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="id_difficulty">Indiquer la difficulté :</label>
          <select name="id_difficulty"
                  onChange={(e) => setFormData({...formData, id_difficulty: findDifficultyIdByName(e.target.value)})}>
            <option value="">Sélectionner une difficulté</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty.id}>
                {difficulty.difficulty_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Créer la recette</button>
      </form>
    </div>
  );
};

export default RecipeCreateForm;
