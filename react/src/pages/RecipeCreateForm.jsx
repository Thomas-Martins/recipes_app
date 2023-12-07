// Composant React pour le formulaire de création de recette
import { useState } from "react";
import axios from "axios";

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    recipe_name: "",
    description: "",
    // Autres champs de la recette
    image: null, // Champ pour l'image
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { recipe_name, description, image } = formData;

    const recipeData = new FormData();
    recipeData.append("recipe_name", recipe_name);
    recipeData.append("description", description);
    // Autres champs de la recette
    recipeData.append("image", image);

    try {
      const response = await axios.post("/api/recipes", recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Réinitialiser le formulaire ou rediriger l'utilisateur après la création de la recette
    } catch (error) {
      console.error(error);
      // Gérer les erreurs d'envoi du formulaire
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="recipe_name"
        value={formData.recipe_name}
        onChange={handleInputChange}
        placeholder="Recipe Name"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      {/* Autres champs du formulaire */}
      <input type="file" name="image" onChange={handleFileChange} />

      <button type="submit">Create Recipe</button>
    </form>
  );
};

export default RecipeForm;
