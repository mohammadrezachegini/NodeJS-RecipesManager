const router = require('express').Router();

const { userAuthRoutes } = require("./users/auth");
const { recipeRoutes } = require("./recipe/recipe"); // Adjust the path as necessary

// User authentication routes
router.use("/user", userAuthRoutes);

// Recipe management routes
router.use("/recipe", recipeRoutes);

module.exports = {
    AllRoutes: router
};
