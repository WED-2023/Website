const DButils = require("./DButils");

async function markAsFavorite(username, recipeId){
    await DButils.execQuery(`insert into favoriterecipes values (${recipeId},'${username}')`);
async function markAsFavorite(username, recipeId){
    await DButils.execQuery(`insert into favoriterecipes values (${recipeId},'${username}')`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipeId from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

async function removeFavoriteRecipe(username, recipeId){
    await DButils.execQuery(`delete from FavoriteRecipes where username='${username}' and recipeId=${recipeId}`);
}

async function getFamilyRecipes(){
    const recipes = await DButils.execQuery(`select * from familyrecipes`);
    return recipes;
}
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.removeFavoriteRecipe = removeFavoriteRecipe;
exports.getFamilyRecipes = getFamilyRecipes;