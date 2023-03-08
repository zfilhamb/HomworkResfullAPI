const { response } = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "koderahasia";
const pool = require("../config.js")

function authentication(req, res, next) {
    const {access_token} = req.headers;

    if(access_token) {
        try {
            const decode = jwt.verify(access_token, secretKey);
            const {id, email} = decode
            const findUser =`
                SELECT
                    *
                FROM users
                WHERE id = $1;
            `
            pool.query(findUser, [id], (err, response) => {
                if(err) next (err);
                
                if(response.rows.length === 0 ) {
                    next({name:ErrorNotFound})
                } else {
                    const user = response.rows[0]
                    
                    req.loggedUser = {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                    next();
                }
            })
        } catch (err) {
            next({name:"JWTerror"})
        }
    } else {
        next({name: "Unauthenticated"})
    }
}

function authorization(req, res, next) {
    const{is_admin, role, email, id } = req.loggedUser;

    if(role === "engineer"){

        next();
    } else {
        next({name: "Unauthorized"})
    }
}

module.exports = {
    authentication,
    authorization
}