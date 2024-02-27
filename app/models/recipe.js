const {UserModel} = require('./user')
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }, 
    ingredients: [{ type: String, required: true }], 
    instructions: [{ type: String, required: true }], 
    time: { type: String, required: true },
    level: { type: String, required: true },
    image: { type: String, required: true } 
  });


  const RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = RecipeModel;