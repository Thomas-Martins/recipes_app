import axiosClient from "./axiosClient.js";

const getRecipesById = (id) => {
  return axiosClient.get(`/recipe/${id}`)
    .then(async ({data}) => {
      const user = await axiosClient.get(`/user/${data.id_user}`)
      const tag = await axiosClient.get(`/tags/${data.id_tag}`);
      const difficulty = await axiosClient.get(`/difficulties/${data.id_difficulty}`);
      let imageUrl = null;
      if(data.id_image){
        const image = await axiosClient.get(`/images/${data.id_image}`)
        imageUrl = image.data.url
      }
      const recipeData = {
        ...data,
        userName: user.data.data.username,
        tagName: tag.data.data.tag_name,
        difficultyName: difficulty.data.data.difficulty_name,
        imageUrl: imageUrl,
      };
      return recipeData;
    })
    .catch((error) => {
      if (error.response && error.response.status === 429) {
        throw new Error("Trop de requêtes, veuillez réessayer plus tard.");
      } else {
        throw error;
      }
    });
};

export default getRecipesById;
