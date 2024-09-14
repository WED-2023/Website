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
  try{
    const username = req.session.username;
    const recipe_id = req.body.recipeId;
    console.log(username);
    console.log(recipe_id);

    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
// router.get('/favorites', async (req,res,next) => {
//   try{
//     const username = req.session.username;
//     let favorite_recipes = {};
//     const recipes_id = await user_utils.getFavoriteRecipes(username);
//     let recipes_id_array = [];
//     recipes_id.map((element) => recipes_id_array.push(element.username)); //extracting the recipe ids into array
//     const results = await recipe_utils.getRecipesPreview(recipes_id_array);
//     res.status(200).send(results);
//   } catch(error){
//     next(error);
//   }
// });

router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    console.log("username:", username);
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipeId)); //extracting the recipe ids into array
    const results = await Promise.all(
      recipes_id_array.map((id) => recipe_utils.getRecipeDetails(id)));
    let favorite_recipess = {};
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post('/addmyRecipe', async (req, res, next) => {
  try {
    const { recipeId, image, title, readyInMinutes, aggregateLikes, vegetarian, vegan, glutenFree, summary, analyzedInstructions, instructions } = req.body;

    
    if (!recipeId || !title || !readyInMinutes) {
      return res.status(400).send("Missing required fields");
    }
     const INTvegetarian = vegetarian ? 1 : 0;
     const INTvegan = vegan ? 1 : 0;
     const INTglutenFree = glutenFree ? 1 : 0;
    await DButils.execQuery(
      `INSERT INTO myrecipes (recipeId, image, title, readyInMinutes, aggregateLikes, vegetarian, vegan, glutenFree, summary, analyzedInstructions, instructions) 
       VALUES ('${recipeId}', '${image}', '${title}', '${readyInMinutes}', '${aggregateLikes}', '${INTvegetarian}', '${INTvegan}', '${INTglutenFree}', '${summary}', '${analyzedInstructions}', '${instructions}')`
    );
    res.status(201).send("Recipe successfully added");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
