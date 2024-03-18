// Importing mongoose library
const mongoose = require("mongoose");

// Defining the UserSchema
const UserSchema = new mongoose.Schema({
    // Field for the user's first name
    first_name: { type: String },
    // Field for the user's last name
    last_name: { type: String },
    // Field for the user's email (required, unique, and converted to lowercase)
    email: { type: String, required: true, unique: true, lowercase: true },
    // Field for the number of recipes associated with the user
    numberOfRecipes: { type: Number },
    // Field for the user's password (required)
    password: { type: String, required: true },
    // Field for the user's refresh token (default value: "0")
    refreshToken: { type: String, default: "0" },
    // Field for references to associated recipes (array of ObjectIds referencing 'Recipe' model)
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }] 
}, {
    // Including timestamps for createdAt and updatedAt fields
    timestamps: true
});

// Creating the UserModel based on the UserSchema
const UserModel = mongoose.model("user", UserSchema);

// Exporting the UserModel for use in other parts of the application
module.exports = {
    UserModel
};
