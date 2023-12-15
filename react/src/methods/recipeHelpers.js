import axiosClient from "../methods/axiosClient.js";

export const getDataForRecipes = (setTags, setDifficulties, setUser) => {
  axiosClient.get("/tags")
    .then((response) => {
      setTags(response.data.tag);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des tags :", error);
    });

  axiosClient.get("/difficulties")
    .then((response) => {
      setDifficulties(response.data.difficulty);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des difficultés :", error);
    });

  axiosClient.get("/users")
    .then((response) => {
      setUser(response.data.users);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    });
};

export const getDataForInput = (id, setFormData) => {
  axiosClient.get(`/recipe/${id}`)
    .then((response) => {
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
      } = response.data;

      setFormData({
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
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des détails de la recette :", error);
    });
};
