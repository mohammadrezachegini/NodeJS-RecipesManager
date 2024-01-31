const router = require('express').Router();

const { userAuthRoutes } = require("./users/auth");
// const {coffeeRoutes} = require("./coffees/coffee")

router.use("/user", userAuthRoutes)


module.exports = {
    AllRoutes: router
}