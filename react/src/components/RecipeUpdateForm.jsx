import {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
// import axiosClient from "../methods/axiosClient.js";
import {Navigate, useParams} from "react-router-dom";
import Image from "./Image.jsx";
import {getDataForInput, getDifficulties} from "../methods/recipeHelpers.js";
import axiosClient from "../methods/axiosClient.js";

const RecipeUpdateForm = () => {
  const {id} = useParams();
  const {token} = useStateContext();
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
    ingredients: [],
  });
  const [difficulties, setDifficulties] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [errors, setErrors] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredientsFromAPI, setIngredientsFromAPI] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [ initialIngredientValues, setInitialIngredientValues] = useState([]);


  // Vérification du token
  if (!token) {
    return <Navigate to="/login"/>;
  }

  useEffect(() => {

    //Récupère la liste des ingrédients depuis l'api
    axiosClient.get('ingredients')
      .then(response => {
        // console.log('Listes des ingrédients',response.data.ingredient);
        setIngredientsFromAPI(response.data.ingredient); // Mettre à jour la liste des ingrédients
      })
      .catch(error => {
        console.error('Error fetching ingredients:', error);
      });

    // Récupérer les ingrédients liés à cette recette
    axiosClient.get(`/recipe/${id}`)
      .then(response => {

        const ingredientsList = response.data.ingredients || [];
        setIngredientList(ingredientsList);

        // Extraire les ID des ingrédients pour les ingrédients liés à la recette
        const ingredientIds = {};
        ingredientsList.forEach(ingredient => {
          ingredientIds[ingredient.id_ingredient] = true;
        });
        setSelectedIngredients(ingredientIds); // Mettre à jour les ingrédients sélectionnés

        // Mise à jour des valeurs initiales des ingrédients lors du changement de la liste des ingrédients sélectionnés
        if (ingredientList.length > 0 && Object.keys(initialIngredientValues).length === 0) {
          const initialValues = {};
          ingredientList.forEach((ingredient) => {
            initialValues[ingredient.id_ingredient] = {
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            };
          });
          setInitialIngredientValues(initialValues);
        }
      })
      .catch(error => {
        console.error('Error fetching recipe ingredients:', error);
      });
    // Récupérer les détails de la recette à partir de l'API
    getDifficulties(setDifficulties);
    getDataForInput(id, setFormData);

  }, [setDifficulties, id, setFormData]);

  // Fonction pour gérer le changement de sélection d'ingrédients
  // const handleIngredientSelection = (ingredientId, isChecked) => {
  //   setSelectedIngredients((prevIngredients) => ({
  //     ...prevIngredients,
  //     [ingredientId]: isChecked,
  //   }));
  //
  //   const updatedIngredientList = ingredientList.map((ingredient) => {
  //     if (ingredient.id_ingredient === parseInt(ingredientId)) {
  //       return {
  //         ...ingredient,
  //         selected: isChecked,
  //       };
  //     }
  //     return ingredient;
  //   });
  //
  //   setIngredientList(updatedIngredientList); // Mettre à jour la liste des ingrédients sélectionnés dans le state
  //
  //   // Mettre à jour formData.ingredients en fonction de la sélection/désélection de l'ingrédient
  //   const updatedFormData = {
  //     ...formData,
  //     ingredients: updatedIngredientList,
  //   };
  //
  //   setFormData(updatedFormData); // Mettre à jour formData avec la liste d'ingrédients mise à jour
  // };

  //Fonction de soumission du formulaire
  const handleUpdateSubmitRecipe = async (ev) => {
    ev.preventDefault();

    try {

      // Appeler updateImage seulement si un fichier a été sélectionné
      if (fileSelected) {
        await updateImage();
      }

      const formDataIngredients = formData.ingredients || []; // Ingrédients déjà présents dans le formulaire
      const updatedIngredients = ingredientList.map((ingredient) => ({
        ...ingredient,
        selected: selectedIngredients[ingredient.id_ingredient] || false,
      }));

      const combinedIngredients = [
        ...formDataIngredients.filter((ingredient) => ingredient.selected),
        ...updatedIngredients.filter((ingredient) => ingredient.selected),
      ];

      const recipeData = {
        recipe_name: formData.recipe_name,
        description: formData.description,
        cooking_time: formData.cooking_time,
        break_time: formData.break_time,
        preparation_time: formData.preparation_time,
        recipe_portion: formData.recipe_portion,
        unit_portion: formData.unit_portion,
        advice: formData.advice,
        id_difficulty: formData.id_difficulty,
        id_image: formData.id_image,
        ingredients: combinedIngredients.map((ingredient) => ({
          id: ingredient.id_ingredient,
          id_image: ingredient.id_image,
          id_ingredient: ingredient.id_ingredient,
          id_recipe: ingredient.id_recipe,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      };

      console.log(recipeData)
      let response;
      response = await axiosClient.put(`/recipe/${id}`, recipeData, {
        headers: {'Content-Type': 'application/json'}
      })
      console.log('response', response);
      // Recharge la page si la requête est réussie
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrors(error);
    }

  }

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    let parsedValue = value;

    if (
      name === 'id_difficulty' ||
      name === 'cooking_time' ||
      name === 'break_time' ||
      name === 'preparation_time' ||
      name === 'recipe_portion'
    ) {
      parsedValue = parseInt(value);
    }

    const updatedFormData = {
      ...formData,
      [name]: parsedValue,
    };
    setFormData(updatedFormData);
  };


  const handleCheckboxChange = (ingredientId, checked) => {
    console.log('Valeur de ingredientList avant la mise à jour :', ingredientList);
    const updatedIngredients = ingredientList.map((ingredient) => {
      if (ingredient.id_ingredient === parseInt(ingredientId)) {
        return {
          ...ingredient,
          selected: checked,
          quantity: checked ? ingredient.quantity : '',
          unit: checked ? ingredient.unit : '',
        };
      }
      return ingredient;
    });
    console.log('Valeur de ingredientList après la mise à jour :', updatedIngredients);
    setIngredientList(updatedIngredients);

    const updatedSelectedIngredients = {
      ...selectedIngredients,
      [ingredientId]: checked,
    };
    setSelectedIngredients(updatedSelectedIngredients);

    const updatedFormData = {
      ...formData,
      ingredients: updatedIngredients,
    };
    console.log('Valeur de formData après la mise à jour :', updatedFormData);
    setFormData(updatedFormData);

    // Ajout d'un nouvel ingrédient à ingredientList s'il n'est pas présent et est coché
    const associatedIngredient = ingredientList.find(item => item.id_ingredient === parseInt(ingredientId));
    if (!associatedIngredient && checked) {
      const newIngredient = {
        id_ingredient: parseInt(ingredientId),
        selected: true,
        quantity: '', // Valeur par défaut de la quantité pour le nouvel ingrédient
        unit: '', // Valeur par défaut de l'unité pour le nouvel ingrédient
      };
      setIngredientList([...ingredientList, newIngredient]);
      console.log('Nouvel ingrédient ajouté à ingredientList :', [...ingredientList, newIngredient]);
    }
  };

  const handleQuantityChange = (ingredientId, event) => {
    const value = event.target.value;
    const updatedIngredientsList = ingredientList.map((item) =>
      item.id_ingredient === ingredientId ? {...item, quantity: value} : item
    );
    setIngredientList(updatedIngredientsList);
  };

  const handleUnitChange = (ingredientId, event) => {
    const value = event.target.value;
    const updatedIngredientsList = ingredientList.map((item) =>
      item.id_ingredient === ingredientId ? {...item, unit: value} : item
    );
    setIngredientList(updatedIngredientsList);
  };


  const handleChangeImage = (event) => {
    const selectedFile = event.target.files[0]; // Récupère le premier fichier sélectionné
    if (selectedFile) {
      setFormData({...formData, image: selectedFile}); // Met à jour les données du formulaire avec l'image sélectionnée
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
          <input type="file" name="image" onChange={handleChangeImage}/>
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
          <input type="number" name="recipe_portion" placeholder="6" onChange={handleInputChange}
                 value={formData.recipe_portion}/>
          <input type="text" name="unit_portion" placeholder="personnes" onChange={handleInputChange}
                 value={formData.unit_portion}/>
        </div>
        <div>
          <label htmlFor="advice">Conseils :</label>
          <textarea name="advice" value={formData.advice || ""} onChange={handleInputChange}
                    placeholder="Facultatif..."/>
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
        {Array.isArray(ingredientsFromAPI) && ingredientsFromAPI.length > 0 && (
          <div>
            {/* Affichage des ingrédients depuis l'API */}
            {ingredientsFromAPI.map((ingredient) => {
              const {id, ingredient_name} = ingredient;
              const isChecked = selectedIngredients[String(id)] || false;
              const associatedIngredient = ingredientList.find(
                (item) => item.id_ingredient === id
              );
              const quantity = associatedIngredient ? associatedIngredient.quantity : '';
              const unit = associatedIngredient ? associatedIngredient.unit : '';

              return (
                <div key={id}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(e.target.getAttribute('data-ingredient-id'), e.target.checked)}
                      checked={isChecked}
                      data-ingredient-id={id}
                    />
                    {ingredient_name}
                  </label>
                  {/* Champs de saisie pour la quantité et l'unité (affichés si l'ingrédient est sélectionné) */}
                  {isChecked && (
                    <>
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={quantity || ''}
                        onChange={(e) => handleQuantityChange(id, e)}
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   const updatedIngredientsList = ingredientList.map(item =>
                        //     item.id_ingredient === id
                        //       ? { ...item, quantity: value }
                        //       : item
                        //   );
                        //   setIngredientList(updatedIngredientsList);
                        // }}
                      />
                      <input
                        type="text"
                        placeholder="Unité"
                        value={unit || ''}
                        onChange={(e) => handleUnitChange(id, e)}
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   const updatedIngredientsList = ingredientList.map(item =>
                        //     item.id_ingredient === id
                        //       ? { ...item, unit: value }
                        //       : item
                        //   );
                        //   setIngredientList(updatedIngredientsList);
                        // }}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <button type="submit">Modifier la recette</button>
      </form>
    </div>
  );
};

export default RecipeUpdateForm;
