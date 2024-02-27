const RecipeModel = require("../../../models/recipe"); 
const { isValidObjectId } = require("mongoose");
const { createLink } = require("../../../../utils/function");
const fileUpload = require("express-fileupload");

class RecipeControllers {
  constructor() {}

  async createRecipe(req, res, next) {
    try {
      const { title, chef, ingredients, instructions, time, level } = req.body;
      const image = req.files.image;

      const result = await RecipeModel.create({
        title,
        chef,
        ingredients,
        instructions,
        time,
        level,
        image: image.name 
      });

      if (!result) throw { status: 400, message: "There was a problem adding the recipe" };

      return res.status(201).json({
        status: 201,
        success: true,
        message: "Recipe added successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRecipes(req, res, next) {
    try {
      const recipes = await RecipeModel.find({});
      recipes.forEach(recipe => {
        recipe.image = createLink(recipe.image, req); 
      });

      return res.status(200).json({
        status: 200,
        success: true,
        recipes
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecipeById(req, res, next) {
    try {
      const recipeID = req.params.id;
      const recipe = await RecipeModel.findById(recipeID);
      if (!recipe) throw { status: 404, message: "Recipe not found" };

      recipe.image = createLink(recipe.image, req);

      return res.status(200).json({
        status: 200,
        success: true,
        recipe
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRecipe(req, res, next) {
    try {
      const recipeID = req.params.id;
      const deleteResult = await RecipeModel.deleteOne({ _id: recipeID });

      if (deleteResult.deletedCount == 0) throw { status: 400, message: "Recipe was not removed" };

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Recipe deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const recipeID = req.params.id;
      const data = { ...req.body };

      const updateResult = await RecipeModel.updateOne({ _id: recipeID }, { $set: data });

      if (updateResult.modifiedCount == 0) throw { status: 400, message: "Recipe update failed" };

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Recipe updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecipeImage(req, res, next) {
    try {
      const image = req.files.image;
      const recipeID = req.params.id;

      const updateResult = await RecipeModel.updateOne({ _id: recipeID }, { $set: { image: image.name } });

      if (updateResult.modifiedCount == 0) throw { status: 400, message: "Recipe image update failed" };

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Recipe image updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  RecipeController: new RecipeControllers()
};
