const express = require("express");
const router = express.Router()
const moviesRouter = require("./movies.js")
const usersRouter = require("./users.js")
const {authentication} = require("../middlewares/auth.js")

router.use("/", usersRouter);
router.use(authentication)
router.use("/", moviesRouter);

module.exports = router;  