const DButils = require("./DButils");

async function markAsFavorite(username, recipeId){
    await DButils.execQuery(`insert into favoriterecipes values (${recipeId},'${username}')`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipeId from favoriterecipes where username='${username}'`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
