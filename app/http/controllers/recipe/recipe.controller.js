const RecipeModel = require("../../../models/recipe"); 
const { isValidObjectId } = require("mongoose");
const { createLink,createUploadPath } = require("../../../../utils/function");
const fileUpload = require("express-fileupload");
const {UserModel} = require('../../../models/user')
const path = require("path")

class RecipeControllers {
  constructor() {}



  async  createRecipe(req, res, next) {
    try {
        const { title, chef, ingredients, instructions, time, level } = req.body;
        const image = req.files.image;

        const ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',');
        const ingredientsWithHashtags = ingredientsArray.map(ingredient => `#${ingredient.trim()}`);

        // Check if any file is uploaded
        if (!image) {
            throw { status: 400, message: "Please upload an image." };
        }

        let type = path.extname(image.name).toLowerCase();
        if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) {
            throw { status: 400, message: "Unsupported file format. Allowed formats: .png, .jpg, .jpeg, .webp, .gif" };
        }

        // Generate a new name for the image
        const imageName = `${Date.now()}${type}`;
        const uploadPath = createUploadPath();
        const imagePath = path.join(uploadPath, imageName);

        // Upload the image to the specified path
        await image.mv(imagePath);

        // Create a link for the image
        const fullUrl = createLink(imagePath, req);

        // Create the recipe with the full URL for the image
        const recipe = await RecipeModel.create({
            title,
            chef,
            ingredients: ingredientsWithHashtags,
            instructions,
            time,
            level,
            image: fullUrl
        });

        if (!recipe) {
            throw { status: 400, message: "There was a problem adding the recipe" };
        }

        // Update numberOfRecipes and add the created recipe to the user's recipes array
        await UserModel.findByIdAndUpdate(chef, { $inc: { numberOfRecipes: 1 }, $push: { recipes: recipe._id } });

        return res.status(201).json({
            status: 201,
            success: true,
            message: "Recipe added successfully"
        });
    } catch (error) {
        next(error);
    }
}


async searchRecipes(req, res, next) {
  try {
    const { keyword } = req.query;



    // Define the search criteria
    const searchCriteria = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } }, 
        { ingredients: { $regex: keyword, $options: 'i' } }, 
        { instructions: { $regex: keyword, $options: 'i' } } 
      ]
    };

    // Search for recipes matching the criteria
    const recipes = await RecipeModel.find(searchCriteria);

    if (recipes.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No recipes found matching the search criteria",
        recipes: []
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Recipes found successfully",
      recipes
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

  // async removeRecipe(req, res, next) {
  //   try {
  //     const recipeID = req.params.id;
  //     const deleteResult = await RecipeModel.deleteOne({ _id: recipeID });

  //     if (deleteResult.deletedCount == 0) throw { status: 400, message: "Recipe was not removed" };

  //     return res.status(200).json({
  //       status: 200,
  //       success: true,
  //       message: "Recipe deleted successfully"
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }


  async removeRecipe(req, res, next) {
    try {
      const recipeID = req.params.id;
      const recipe = await RecipeModel.findById(recipeID);
  
      if (!recipe) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Recipe not found"
        });
      }
  
      const deleteResult = await RecipeModel.deleteOne({ _id: recipeID });
  
      if (deleteResult.deletedCount === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Recipe was not removed"
        });
      }
  
      const user = await UserModel.findById(recipe.chef);
      if (user) {
        user.numberOfRecipes -= 1;
        await user.save();
      }
  
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
