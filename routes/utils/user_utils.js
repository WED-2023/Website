const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values (${recipe_id},'${username}')`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipeId from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
