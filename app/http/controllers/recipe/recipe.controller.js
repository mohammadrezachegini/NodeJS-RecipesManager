// Importing necessary modules and classes

// Recipe data model
const RecipeModel = require("../../../models/recipe");
 // Helper function to validate MongoDB Object IDs 
const { isValidObjectId } = require("mongoose");
 // Utility functions for handling file paths and URLs
const { createLink, createUploadPath } = require("../../../../utils/function");
 // Middleware for handling file uploads
const fileUpload = require("express-fileupload");
 // User data model
const { UserModel } = require('../../../models/user');
// Node.js module for handling file paths
const path = require("path"); 

class RecipeControllers {
  constructor() {
  }

  async createRecipe(req, res, next) {
    try {
      // Destructuring request body to extract recipe details
      const { title, chef, ingredients, instructions, time, level } = req.body;
      // Accessing uploaded image from request files
      const image = req.files.image; 

      // Handling ingredients: converting string to array if necessary
      const ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',');
      const ingredientsWithHashtags = ingredientsArray.map(ingredient => `${ingredient.trim()}`);

      // Handling instructions: converting string to array if necessary
      const instructionsArray = Array.isArray(instructions) ? instructions : instructions.split(',');
      const instructionsWithHashtags = instructionsArray.map(instruction => `${instruction.trim()}`);

      // Validating image upload
      if (!image) {
        throw { status: 400, message: "Please upload an image." };
      }

      // Checking file type and rejecting unsupported formats
      let type = path.extname(image.name).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) {
        throw { status: 400, message: "Unsupported file format. Allowed formats: .png, .jpg, .jpeg, .webp, .gif" };
      }

      // Setting up file storage path
      const imageName = `${Date.now()}${type}`;
      const uploadPath = createUploadPath();
      const imagePath = path.join(uploadPath, imageName);

      // Moving uploaded image to the designated path
      await image.mv(imagePath);

      // Creating a URL for the uploaded image
      const fullUrl = createLink(imagePath, req);

      // Creating new recipe document in the database
      const recipe = await RecipeModel.create({
        title,
        chef,
        ingredients: ingredientsWithHashtags,
        instructions: instructionsWithHashtags,
        time,
        level,
        image: fullUrl
      });

      // Handling error if recipe was not created successfully
      if (!recipe) {
        throw { status: 400, message: "There was a problem adding the recipe" };
      }

      // Updating user's recipe count and list
      await UserModel.findByIdAndUpdate(chef, { $inc: { numberOfRecipes: 1 }, $push: { recipes: recipe._id } });

      // Sending response with success message
      return res.status(201).json({
        status: 201,
        success: true,
        message: "Recipe added successfully"
      });
    } catch (error) {
      // Passing errors to the error-handling middleware
      next(error);
    }
  }

  async searchRecipes(req, res, next) {
    try {
      const { keyword } = req.query; // Extracting search keyword from query parameters

      // Defining search criteria to find recipes by title, ingredients, or instructions
      const searchCriteria = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { ingredients: { $regex: keyword, $options: 'i' } },
          { instructions: { $regex: keyword, $options: 'i' } }
        ]
      };

      // Performing search in the database
      const recipes = await RecipeModel.find(searchCriteria);

      // Handling case when no recipes are found
      if (recipes.length === 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "No recipes found matching the search criteria",
          recipes: []
        });
      }

      // Sending response with found recipes
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Recipes found successfully",
        recipes
      });
    } catch (error) {
      // Passing errors to the error-handling middleware
      next(error);
    }
  }

  // Method to retrieve all recipes
  async getAllRecipes(req, res, next) {
    try {
      // Fetching all recipes from the database
      const recipes = await RecipeModel.find({});

      // Updating recipe image URLs
      recipes.forEach(recipe => {
        recipe.image = createLink(recipe.image, req);
      });

      // Sending response with all recipes
      return res.status(200).json({
        status: 200,
        success: true,
        recipes
      });
    } catch (error) {
      // Passing errors to the error-handling middleware
      next(error);
    }
  }

  // Method to retrieve a single recipe by ID
  async getRecipeById(req, res, next) {
    try {
      // Extracting recipe ID from request parameters
      const recipeID = req.params.id; 
      const recipe = await RecipeModel.findById(recipeID);

      // Handling case when the specified recipe is not found
      if (!recipe) throw { status: 404, message: "Recipe not found" };

      // Updating recipe image URL
      recipe.image = createLink(recipe.image, req);

      // Sending response with the requested recipe
      return res.status(200).json({
        status: 200,
        success: true,
        recipe
      });
    } catch (error) {
      // Passing errors to the error-handling middleware
      next(error);
    }
  }

  // Method to remove a recipe by ID
  async removeRecipe(req, res, next) {
    try {
      // Extracting recipe ID from request parameters
      const recipeID = req.params.id; 
      const recipe = await RecipeModel.findById(recipeID);

      // Handling case when the specified recipe is not found
      if (!recipe) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Recipe not found"
        });
      }

      // Deleting the specified recipe from the database
      const deleteResult = await RecipeModel.deleteOne({ _id: recipeID });

      // Handling case when deletion was not successful
      if (deleteResult.deletedCount === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Recipe was not removed"
        });
      }

      // Updating the chef's recipe count and list
      const user = await UserModel.findById(recipe.chef);
      if (user) {
        user.numberOfRecipes -= 1;
        await user.save();
      }

      // Sending response with success message
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Recipe deleted successfully"
      });
    } catch (error) {
      // Passing errors to the error-handling middleware
      next(error);
    }
  }
}

module.exports = {
  RecipeController: new RecipeControllers()
};
