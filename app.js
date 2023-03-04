const express = require('express');
const app = express();
const router = require("./routes/index.js");
const pool = require("./config.js")
const errorHandler = require("./middlewares/errorhandler.js");
const morgan = require("morgan")

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);
app.use(errorHandler);

pool.connect(() => {
    console.log("connected");
});

app.listen(3000);
