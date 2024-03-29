const express = require("express");
const router = express.Router()
const pool = require("../config.js")
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken")
const secretKey = "koderahasia"


router.get("/login", (req, res, next) => {
    const { email, password } = req.body;

    const findUser = `
        SELECT
            * 
        FROM users
        WHERE email = $1
    `

    pool.query(findUser, [email], (err, result) => {
        if (err) next(err)

        if (result.rows.length === 0) {
            next({ name: "ErrorNotFound" })
        } else {
            const data = result.rows[0]
            const comparePassword = bcrypt.compareSync(password, data.password);

            if (comparePassword) {

                const access_token = jwt.sign({
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    is_admin: data.is_admin
                }, secretKey)

                res.status(200).json({
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    is_admin: data.is_admin,
                    access_token: access_token
                });
            } else {
                next({ name: "WrongPassword" })
            }
        }
    })
});

router.post("/register", (req, res, next) => {
    const { id, email, gender, password, role, is_admin } = req.body;

    const hash = bcrypt.hashSync(password, salt);

    const insertUsers = `
    INSERT INTO users (id, email, gender, password, role, is_admin)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `

    pool.query(insertUsers, [id, email, gender, hash, role, is_admin], (err, result) => {
        if (err) next(err)

        res.status(201).json({
            message: "User Registered"
        })
    })
});

router.delete('/delete/users/:id', (req, res, next) => {
    const { id } = req.params;
    const findQuery = `
    SELECT 
        *
    FROM users
        WHERE id = $1
    `
    pool.query(findQuery, [id], (err, result) => {
        if (err) next(err)


        if (result.rows[0]) {

            const deleteQuery = `
            DELETE FROM users
            WHERE id = $1;
        `
            pool.query(deleteQuery, [id], (err, response) => {
                if (err) next(err)

                res.status(200).json({
                    message: "User Deleted Successfully"
                })
            })
        } else {
            res.status(404).json({
                message: "User Not Found"
            })
        }
    })
});

router.put("/users/:id", (req, res, next) =>{
    const {id} = req.params;
    const {password} = req.body;

    const hash = bcrypt.hashSync(password, salt);

    const updateQuery =`
        UPDATE users
        SET password = $1
        WHERE id = $2
    `
    pool.query(updateQuery, [hash, id], (err, result) =>{
        if(err) next(err)

        res.status(200).json({
            message: "Change Password Success"
        })
    }) 
}); 



module.exports = router;  