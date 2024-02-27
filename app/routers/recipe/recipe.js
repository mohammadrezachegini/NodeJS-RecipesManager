const router = require("express").Router();
const { RecipeController } = require("../../http/controllers/recipe/recipe.controller"); 
const { uploadFile } = require("../../../utils/express-fileUpload");
const fileupload = require("express-fileupload");
const { mongoIDValidator } = require("../../http/validators/public");

/**  
 * @swagger
 * tags: 
 *  name: Recipes
 *  description: Recipes management section      
*/

/**
 * @swagger
 *  /recipe/create:
 *      post:
 *          summary: Add a new recipe
 *          tags: [Recipes] 
 *          description: Add a new recipe to the database
 *          consumes:
 *              - multipart/form-data
 *          parameters:
 *              - in: formData
 *                name: title
 *                type: string
 *                required: true
 *                description: The title of the recipe
 *              - in: formData
 *                name: chef
 *                type: string
 *                required: true
 *                description: JSON string of chef details (firstName, lastName, numberOfRecipes)
 *              - in: formData
 *                name: ingredients
 *                type: array
 *                items:
 *                  type: string
 *                required: true
 *                description: List of ingredients
 *              - in: formData
 *                name: instructions
 *                type: array
 *                items:
 *                  type: string
 *                required: true
 *                description: Cooking instructions
 *              - in: formData
 *                name: time
 *                type: string
 *                required: true
 *                description: Cooking time
 *              - in: formData
 *                name: level
 *                type: string
 *                required: true
 *                description: Difficulty level
 *              - in: formData
 *                name: image
 *                type: file
 *                required: true
 *                description: Recipe image
 *          responses:
 *              201:
 *                  description: Recipe added successfully
 *              400:
 *                  description: Bad Request
 *              500:
 *                  description: Internal Server Error
*/
router.post("/create", fileupload(), uploadFile, RecipeController.createRecipe);

/**
 * @swagger
 *  /recipe/list:
 *      get:
 *          summary: Get all recipes
 *          tags: [Recipes] 
 *          description: Fetch all recipes from the database
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Internal Server Error
*/
router.get("/list", RecipeController.getAllRecipes);

/**
 * @swagger
 *  /recipe/{id}:
 *      get:
 *          summary: Get a recipe by ID
 *          tags: [Recipes] 
 *          description: Fetch a single recipe by its ID
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: string
 *          responses:
 *              200:
 *                  description: Success
 *              404:
 *                  description: Recipe not found
 *              500:
 *                  description: Internal Server Error
*/
router.get("/:id", mongoIDValidator(), RecipeController.getRecipeById);

/**
 * @swagger
 * /recipe/remove/{id}:
 *  delete:
 *      summary: Delete a recipe by ID
 *      tags: [Recipes] 
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the recipe to delete
 *      responses:
 *          200:
 *              description: Recipe deleted successfully
 *          404:
 *              description: Recipe not found
 *          500:
 *              description: Internal Server Error
*/
router.delete("/remove/:id", mongoIDValidator(), RecipeController.removeRecipe);

/**
 * @swagger
 * /recipe/edit/{id}:
 *   put:
 *     summary: Update a recipe by ID
 *     tags: [Recipes] 
 *     description: Update recipe details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: body
 *         name: recipe
 *         description: The updated recipe object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             chef:
 *               type: object
 *             ingredients:
 *               type: array
 *               items:
 *                 type: string
 *             instructions:
 *               type: array
 *               items:
 *                 type: string
 *             time:
 *               type: string
 *             level:
 *               type: string
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal Server Error
*/
router.put("/edit/:id", RecipeController.updateRecipe);

/**
 * @swagger
 * /recipe/edit-image/{id}:
 *   patch:
 *     summary: Update a recipe image by ID
 *     tags: [Recipes] 
 *     description: Update a recipe's image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: New recipe image
 *     responses:
 *       200:
 *         description: Recipe image updated successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal Server Error
*/
router.patch("/edit-image/:id", fileupload(), uploadFile, mongoIDValidator(), RecipeController.updateRecipeImage);

module.exports = {
    recipeRoutes: router
};
