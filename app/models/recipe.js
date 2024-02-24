const {UserModel} = require('./user')
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }, // Embedded Chef document
    ingredients: [{ type: String, required: true }], // Array of Strings
    instructions: [{ type: String, required: true }], // Array of Strings
    time: { type: String, required: true },
    level: { type: String, required: true },
    image: { type: String, required: true } // URL to the image
  });


  const RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = RecipeModel;