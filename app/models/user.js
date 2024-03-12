const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    numberOfRecipes: { type: Number },
    password: { type: String, required: true },
    refreshToken: { type: String, default: "0" },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }] // Reference to recipes created by the user
}, {
    timestamps: true
});
const UserModel = mongoose.model("user", UserSchema)
module.exports = {
    UserModel
}