const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformationPreview(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.VUE_APP_spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
        const response = await axios.get(`${api_domain}/${recipe_id}/information`, {
            params: {
            includeNutrition: true,
            apiKey: process.env.VUE_APP_spooncular_apiKey
            }
        });
        
        const { id, ...rest } = response.data;
        return { recipeid: id, ...rest };
}

async function searchRecipe(recipeName, cuisine, diet, intolerance, number, username) {
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: recipeName,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerance,
            number: number,
            apiKey: process.env.VUE_APP_spooncular_apiKey
        }
    });

    return getRecipesPreview(response.data.results.map((element) => element.id), username);
}

/**
 * Get recipes preview information
 * @param {Array} recipe_ids - Array of recipe IDs to retrieve previews for
 * @param {String} username - (Optional) username for personalized features (if needed)
 */
async function getRecipesPreview(recipe_ids, username) {
    let recipesPreview = [];

    // Loop through each recipe ID and get its details
    for (let recipe_id of recipe_ids) {
        let recipeDetails = await getRecipeDetails(recipe_id); // Using your existing getRecipeDetails function

        // Add relevant recipe details to the preview array
        console.log(recipeDetails.recipeid);
        recipesPreview.push({
            recipeid: recipeDetails.recipeid,
            title: recipeDetails.title,
            readyInMinutes: recipeDetails.readyInMinutes,
            image: recipeDetails.image,
            aggregateLikes: recipeDetails.aggregateLikes,
            vegan: recipeDetails.vegan,
            vegetarian: recipeDetails.vegetarian,
            glutenFree: recipeDetails.glutenFree,
        });
    }

    return recipesPreview;
}

/**
 
Get a list of random recipes
@param {Number} number - Number of random recipes to fetch
*/
async function getRandomRecipes(number) {
    try {
        const response = await axios.get(`${api_domain}/random`, {
            params: {
                number: number,
                apiKey: process.env.VUE_APP_spooncular_apiKey
            }
        });

        // Extract the relevant preview details for each recipe
        const recipesPreview = response.data.recipes.map((recipe) => {
            return {
                recipeid: recipe.id,
                title: recipe.title,
                readyInMinutes: recipe.readyInMinutes,
                image: recipe.image,
                aggregateLikes: recipe.aggregateLikes,
                vegan: recipe.vegan,
                vegetarian: recipe.vegetarian,
                glutenFree: recipe.glutenFree,
            };
        });

        return recipesPreview;
    } catch (error) {
        console.error("Error fetching random recipes:", error);
        throw error;
    }
}
async function getFavoriteRecipesByUsername(username) {
    if (!username) {
        throw new Error('Username is required');
    }
    try {
        const favoriteRecipes = await DButils.execQuery(`SELECT recipeid FROM favoriterecipes WHERE username  = '${username}'`);
        return favoriteRecipes.map(recipe => recipe.recipeid);
    } catch (error) {
        console.error(`Error fetching favorite recipes for username: ${username}`, error);
        throw new Error('Error fetching favorite recipes');
    }
}

async function getFavoritesRecipes(req) {
    const username = req.session.username;
    console.log(username);
    if (!username) {
        throw new Error('User is not authenticated');
    }
    const recipeIds = await getFavoriteRecipesByUsername(username);
    return getRecipesPreview(recipeIds, username);
}

exports.getFavoritesRecipes = getFavoritesRecipes;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.getRandomRecipes = getRandomRecipes;


