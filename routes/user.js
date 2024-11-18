var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  console.log("favorites");
  try{
    const username = req.session.username;
    const recipeId = req.body.recipeId;
    console.log(recipeId);
    console.log(username);
  

    await user_utils.markAsFavorite(username,recipeId);
    
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch(error){
    next(error);
  }
})

router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    console.log("username:", username);
        
    const recipesId = await user_utils.getFavoriteRecipes(username); //returns all of the saved recipes id
    console.log("recipes_id:", recipesId);
    const recipesId_array = recipesId.map(element => element.recipeId); //extracting the recipe ids into array
    console.log("recipes_id_array:", recipesId_array);
    const results = await Promise.all(recipesId_array.map(id => recipe_utils.getRecipeDetails(id)));
    
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

router.get('/favoritesID', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipesId = await user_utils.getFavoriteRecipes(username);
    const recipesId_array = recipesId.map(element => element.recipeId); //extracting the recipe ids into array
    console.log("recipes_id_array:", recipesId_array);
    res.status(200).send(recipesId_array);

  } catch(error){
    next(error);
  }
});

router.delete('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipeId = req.body.recipeId;
    await user_utils.removeFavoriteRecipe(username,recipeId);
    res.status(200).send("The Recipe successfully removed from favorites");
  } catch(error){
    next(error);
  }
});

router.get('/familyRecipes', async (req,res,next) => {
  try{
    const results = await user_utils.getFamilyRecipes();
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

router.post('/addmyRecipe', async (req, res, next) => {
  try {
    const { username, image, title, readyInMinutes, aggregateLikes, servings, vegetarian, vegan, glutenFree, summary, analyzedInstructions, instructions, extendedIngredients } = req.body;

    
    if (!title || !readyInMinutes) {
      return res.status(400).send("Missing required fields");
    }
     const INTvegetarian = vegetarian ? 1 : 0;
     const INTvegan = vegan ? 1 : 0;
     const INTglutenFree = glutenFree ? 1 : 0;
    await DButils.execQuery(
      `INSERT INTO myrecipes (username, image, title, readyInMinutes, aggregateLikes, servings, vegetarian, vegan, glutenFree, summary, instructions, extendedIngredients) 
       VALUES ('${username}', '${image}', '${title}', '${readyInMinutes}', '${aggregateLikes}', '${servings}','${INTvegetarian}', '${INTvegan}', '${INTglutenFree}', '${summary}', '${instructions}', '${extendedIngredients}')`
    );
    res.status(201).send("Recipe successfully added");
  } catch (error) {
    next(error);
  }
});

router.get('/addmyRecipe', async (req, res, next) => {
  try {
    const results = await user_utils.getaddmyRecipe(req); 
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get('/favoritesrecipe', async (req, res, next) => {
  try {

    const results = await recipe_utils.getFavoritesRecipes(req);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
