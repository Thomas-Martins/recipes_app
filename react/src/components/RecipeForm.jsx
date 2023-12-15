import {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../methods/axiosClient.js";
import {Navigate, useParams} from "react-router-dom";
import Image from "./Image.jsx";
import {getDataForInput, getDataForRecipes} from "../methods/recipeHelpers.js";

const RecipeForm = () => {
  const {id} = useParams(); // Récupère l'ID de la recette dans l'URL si disponible
  const {token} = useStateContext(); //Récupère le token
  const isUpdate = !!id; // Vérifie si on est en train de mettre à jour une recette existante
  const [formData, setFormData] = useState({
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
    id_image: 0,
  });
  const [tags, setTags] = useState([]);
  const [users, setUser] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [errors, setErrors] = useState([]);
  const [imageId, setImageId] = useState([]);
  if (!token) {
    return <Navigate to="/login"/>
  }

  useEffect(() => {
    getDataForRecipes(setTags, setDifficulties, setUser);
    // Si on est en mode modification, charge les détails de la recette à modifier
    if (isUpdate) {
      getDataForInput(id, setFormData);
      // On récupère l'id de l'image que l'on modifie
      axiosClient.get(`/recipe/${id}`)
        .then(({data}) => {
          setImageId(data.id_image)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [setTags, setDifficulties, setUser, isUpdate, id, setFormData]);


  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    const {
      recipe_name,
      description,
      cooking_time,
      break_time,
      preparation_time,
      recipe_portion,
      unit_portion,
      advice,
      id_tag,
      id_user,
      id_difficulty,
    } = formData;

    const recipeData = new FormData();
    recipeData.append('recipe_name', recipe_name);
    recipeData.append("description", description);
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
      let response;
      if (isUpdate) {
        response = await axiosClient.put(`/recipe/${id}`, recipeData, { headers: { 'Content-Type': 'application/json' } });

        // Vérifier s'il y a une nouvelle image et la mettre à jour si nécessaire
        if (formData.image && formData.image.newImage) {
          await uploadNewImage();
        }
      } else {
        response = await axiosClient.post("/recipes", recipeData);
      }
      console.log(response)
      // Recharge la page si la requête est réussie
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrors(error);
    }
  };

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
    console.log(formData)
  };

  const handleFileChange = (e) => {
    const newImage = e.target.files[0];

    // Mise à jour de l'image dans formData sans téléchargement immédiat
    setFormData({ ...formData, image: { newImage } });
  };
  // Fonction pour télécharger la nouvelle image
  const uploadNewImage = async () => {
    try {
      if (formData.image && formData.image.newImage) {
        console.log(formData)
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image.newImage);
        imageFormData.append('_method', 'PUT');
        console.log(formData);
        const response = await axiosClient.post(`/images/${imageId}`, imageFormData);
        const { url, image_path } = response.data;

        // Mettre à jour formData avec les détails de la nouvelle image
        setFormData({
          ...formData,
          image: {
            url,
            image_path,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
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
          {formData.image && formData.image.url && (
            <div>
              <Image imagePath={formData.image.url}/>
            </div>
          )}
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
          <textarea name="advice" onChange={handleInputChange} value={formData.advice || ""}
                    placeholder="Facultatif..."/>
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
        <button type="submit">{isUpdate ? 'Update Recipe' : 'Create Recipe'}</button>
      </form>
    </div>
  );
};

export default RecipeForm;
