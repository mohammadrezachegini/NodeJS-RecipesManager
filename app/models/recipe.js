// Importing the mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Defining a new schema for recipes with various fields
const RecipeSchema = new mongoose.Schema({
  // The title of the recipe, a string that is required
  title: { type: String, required: true },
  // A reference to the chef (user) who created the recipe, using their ObjectId
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  // An array of strings for the ingredients, each ingredient is required
  ingredients: [{ type: String, required: true }],
  // An array of strings for the instructions, each instruction is required
  instructions: [{ type: String, required: true }],
  // The total time needed to make the recipe, a string that is required
  time: { type: String, required: true },
  // The difficulty level of the recipe, a string that is required
  level: { type: String, required: true },
  // The URL or path to an image of the recipe, a string that is required
  image: { type: String, required: true }
});

// Creating a model from the schema. A model allows for creating and reading documents from the underlying MongoDB database.
const RecipeModel = mongoose.model('Recipe', RecipeSchema);

// Exporting the RecipeModel for use in other parts of the application
module.exports = RecipeModel;
