const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }, 
  ingredients: [{ type: String, required: true }], 
  instructions: [{ type: String, required: true }], 
  time: { type: String, required: true },
  level: { type: String, required: true },
  image: { type: String, required: true } // Change image field to store full URL
});

// Virtual to generate full URL for image field
// RecipeSchema.virtual('imageUrl').get(function() {
//   return this.image ? `/public/upload/${this.image}` : null;
// });

const RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = RecipeModel;