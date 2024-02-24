const router = require('express').Router();

const { userAuthRoutes } = require("./users/auth");

router.use("/user", userAuthRoutes)


module.exports = {
    AllRoutes: router
}