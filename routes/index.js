const express = require("express");
const router = express.Router()
const moviesRouter = require("./movies.js")
const usersRouter = require("./users.js")

router.use("/", moviesRouter);
router.use("/", usersRouter);

module.exports = router;  