// Importing the necessary function from express-validator
const {param} = require("express-validator");

// Defining a function to create a validation chain
function mongoIDValidator(){
    return [
        // Validates that the 'id' route parameter is a valid MongoDB Object ID
        // and provides a custom error message if the validation fails
        param("id").isMongoId().withMessage("The id is invalid")
    ];
}

// Exporting the mongoIDValidator function for use in route definitions
module.exports = {
    mongoIDValidator
};
