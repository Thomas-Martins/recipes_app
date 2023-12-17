import axiosClient from "./axiosClient.js";

const getRecipesByTag = (tag) => {
  return axiosClient.get(`/recipes/${tag}`)
    .then(async ({ data }) => {
      const recipesData = await Promise.all(data.recipes.map(async (recipe) => {
        const tag = await axiosClient.get(`/tags/${recipe.id_tag}`);
        const user = await axiosClient.get(`/user/${recipe.id_user}`);
        const difficulty = await axiosClient.get(`/difficulties/${recipe.id_difficulty}`);
        return {
          ...recipe,
          tagName: tag.data.data.tag_name,
          userName: user.data.data.username,
          difficultyName: difficulty.data.data.difficulty_name,
        };
      }));
      return recipesData;
    })
    .catch((error) => {
      if (error.response && error.response.status === 429) {
        throw new Error("Trop de requêtes, veuillez réessayer plus tard.");
      } else {
        throw error;
      }
    });
};

export default getRecipesByTag;
