import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";
// import axiosClient from "../methods/axiosClient.js";
import { Navigate, useParams } from "react-router-dom";
import Image from "./Image.jsx";
import {getDataForInput, getDifficulties} from "../methods/recipeHelpers.js";
import axiosClient from "../methods/axiosClient.js";

const RecipeUpdateForm = () => {
  const { id } = useParams();
  const { token } = useStateContext();
  const [formData, setFormData] = useState({
    recipe_name: "",
    description: "",
    cooking_time: 0,
    break_time: 0,
    preparation_time: 0,
    recipe_portion: 0,
    unit_portion: "",
    advice: "",
    id_difficulty: 0,
    image: null,
  });
  const [difficulties, setDifficulties] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [errors, setErrors] = useState([]);

  // Vérification du token
  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getDifficulties(setDifficulties);
    getDataForInput(id, setFormData);
  }, [setDifficulties, id, setFormData]);

  //Fonction de soumission du formulaire
  const handleUpdateSubmitRecipe = async (ev) => {
    ev.preventDefault();

    try {

      if (fileSelected) {
        await updateImage(); // Appeler updateImage seulement si un fichier a été sélectionné
      }

      const recipeData = new FormData();
      recipeData.append('recipe_name', formData.recipe_name);
      recipeData.append('description', formData.description);
      recipeData.append('cooking_time', formData.cooking_time);
      recipeData.append('break_time', formData.break_time);
      recipeData.append('preparation_time', formData.preparation_time);
      recipeData.append('recipe_portion', formData.recipe_portion);
      recipeData.append('unit_portion', formData.unit_portion);
      recipeData.append('advice', formData.advice);

      let response;
      response = await axiosClient.put(`/recipe/${id}`, recipeData, {
        headers: {'Content-Type': 'application/json'}
      })
      console.log('response', response);
      // Recharge la page si la requête est réussie
      window.location.reload();
    }catch (error){
      console.error(error);
      setErrors(error);
    }

  }

  const handleChangeInput = (ev) => {
    const {name, value} = ev.target;
    let parsedValue = value;

    if (
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

  const handleChangeImage = (event) => {
    const selectedFile = event.target.files[0]; // Récupère le premier fichier sélectionné
    if (selectedFile) {
      setFormData({ ...formData, image: selectedFile }); // Met à jour les données du formulaire avec l'image sélectionnée
      setFileSelected(true); // Met à jour l'état pour indiquer qu'un fichier a été sélectionné
    } else {
      setFileSelected(false); // Met à jour l'état pour indiquer qu'aucun fichier n'est sélectionné
    }
  };
  const updateImage = async () => {

    const imageFormData = new FormData();
    const idImage = formData.id_image;

    // Ajoutez votre image à envoyer
    imageFormData.append('image', formData.image);
    imageFormData.append('_method', 'PUT');

    try {
      const response = await axiosClient.post(`/images/${idImage}`, imageFormData);
      console.log('Réponse de la mise à jour de l\'image :', response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image :', error);
    }
  };

  //Formulaire
  return (
    <div>
      formulaire de modif
      <form onSubmit={handleUpdateSubmitRecipe}>
        <input
          type="text"
          name="recipe_name"
          value={formData.recipe_name}
          onChange={handleChangeInput}
          placeholder="Nom de la recette"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChangeInput}
          placeholder="Ajouter une description"
        />
        <div>
          {formData.image && formData.image.url && (
            <div>
              <Image imagePath={formData.image.url}/>
            </div>
          )}
          <label htmlFor="image">Photo de la recette</label>
          <input type="file" name="image" onChange={handleChangeImage}/>
        </div>
        <div>
          <label htmlFor="cooking_time">Temps de cuisson :</label>
          <input type="number" name="cooking_time" onChange={handleChangeInput} value={formData.cooking_time}/>
        </div>
        <div>
          <label htmlFor="break_time">Temps de repos :</label>
          <input type="number" name="break_time" onChange={handleChangeInput} value={formData.break_time}/>
        </div>
        <div>
          <label htmlFor="preparation_time">Temps de préparation :</label>
          <input type="number" name="preparation_time" onChange={handleChangeInput} value={formData.preparation_time}/>
        </div>
        <div>
          <label htmlFor="recipe_portion">Quantité :</label>
          <input type="number" name="recipe_portion" placeholder="6" onChange={handleChangeInput} value={formData.recipe_portion}/>
          <input type="text" name="unit_portion" placeholder="personnes" onChange={handleChangeInput} value={formData.unit_portion}/>
        </div>
        <div>
          <label htmlFor="advice">Conseils :</label>
          <textarea name="advice" value={formData.advice || ""} onChange={handleChangeInput} placeholder="Facultatif..."/>
        </div>
        <div>
          <label htmlFor="id_difficulty">Indiquer la difficulté :</label>
          <select name="id_difficulty" onChange={handleChangeInput} value={formData.id_difficulty}>
            <option value="">Sélectionner une difficulté</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty.id} value={difficulty.id}>
                {difficulty.difficulty_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Modifier la recette</button>
      </form>
    </div>
  );
};

export default RecipeUpdateForm;
