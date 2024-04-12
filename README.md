# CSIS4495-Project

# Project Overview

This application is a robust web-based platform designed to allow users to manage culinary recipes. It offers APIs to add, retrieve, and display recipes, facilitating user interactions in a structured and secure manner. Below is a breakdown of the system components and their functionalities within this context.

## Directory Structure

### `app/`
The `app` directory serves as the core of the application, hosting the essential architectural components such as routing, server configuration, data models, and HTTP management.

#### `routers/`
This subdirectory manages all routing mechanisms, facilitating navigation and functionality across different parts of the application.

- **`recipe/`**
  - `recipe.js`: Manages routes specific to recipe operations, such as creating, retrieving, updating, and deleting recipes. Ensures users can interact seamlessly with recipe data.
- **`router.js`**: Establishes base routing configurations and integrates various router modules from other subdirectories for streamlined route management.
- **`users/`**
  - `auth.js`: Handles authentication routes, providing mechanisms for user login, registration, and access control.

### `server.js`
- **Server Configuration**: Configures Express server settings, integrating middleware for logging, CORS for cross-origin resource sharing, and error handling to ensure smooth operations.
- **Database Connection**: Manages MongoDB connections, efficiently handling events like successful connections, disconnections, and connection errors, ensuring database interactions are reliable.
- **API Documentation**: Utilizes Swagger to automatically generate up-to-date API documentation, making it easier for developers to understand and use the APIs.
- **Route Management**: Centralizes the management of all routes through the `AllRoutes` module, which loads all application routes, facilitating efficient and organized routing.
- **Error Handling**: Provides a structured error handling mechanism that standardizes responses for not found and server errors across the API, improving the reliability and maintainability of the application.

#### `models/`
Contains schemas defining the structure and methods of data objects used within the application, vital for data integrity and operations in the database.

- **`user.js`**: Defines the User model, detailing the schema for user data and including methods for user-related operations.
- **`recipe.js`**: Represents the Recipe model with attributes specific to culinary recipes, critical for operations involving recipe data.

#### `http/`
Organizes the HTTP interface handling, including middlewares, validators, and controllers, to streamline request processing and response handling.

- **`middlewares/`**
  - `VerifyAccessToken.js`: Ensures that each secured request is accompanied by a valid access token, thereby securing routes that require user authentication.
  - `checkErrors.js`: Captures and handles errors during request processing, facilitating smoother error management and response.
- **`validators/`**
  - `public.js`: Implements validation for public-facing interfaces, ensuring data integrity and preventing malformed data from affecting backend processes.
- **`controllers/`**
  - **`recipe/`**
    - `recipe.controller.js`: Manages business logic for recipe operations, interfacing between the recipe routes and the database.
  - **`user/`**
    - **`auth/`**
      - `auth.controller.js`: Controls authentication processes, including user verification and token generation, crucial for secure user access.
### `Controllers\`
#### Recipe Management
- Users can **add** new recipes via a POST API, which captures essential recipe details and stores them in the database.
- Recipes can be **retrieved** through GET APIs, allowing users to view a list of all recipes or specific details of a single recipe.
- The application also supports the **display** of recipes, enabling users to browse through various culinary creations seamlessly.

#### User Authentication
- The application includes robust user authentication mechanisms, allowing for secure user registration and login processes.

### `index.js`
The entry point script for the application, responsible for initializing and bootstrapping the application components.


### `utils/`
Utility scripts and helpers that provide additional functionality across the application.

- **`constants.js`**: Centralizes constant values used throughout the application, enabling consistent use of these values and easing configuration changes.
- **`uploadFile.js`**: Facilitates file upload operations, integrating with various parts of the application to handle file storage.
- **`function.js`**: Contains reusable code blocks that perform common tasks, improving code maintainability and reducing redundancy.
- **`express-fileUpload.js`**: Configures middleware for handling file uploads, crucial for endpoints that accept file data.
- **`secret_key_generator.js`**: Generates secret keys for use in authentication and other security-related operations, enhancing the application's security posture.


