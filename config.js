const {Pool} = require("pg")
const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"movies",
    password:"kacangpolong",
    port:5432,
}); 

module.exports = pool;