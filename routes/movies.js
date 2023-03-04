const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const {authorization} = require("../middlewares/auth.js")
const defaultLimit = 10;
const defaultPage = 1;

router.get("/movies", authorization, (req, res, next) =>{
    const {limit, page}= req.query;
    let resultLimit = limit ? +limit : defaultLimit;
    let resultPage = page ? +page : defaultPage;
    pool.query(`SELECT * FROM movies LIMIT ${resultLimit} OFFSET ${(resultPage -1) * resultLimit}`, (err, response) =>{
        if(err) next(err)

        res.status(200).json(response.rows)
    }) 
}); 

router.get("/movies/:id", (req, res, next) =>{
    const {id} = req.params;
    pool.query(`SELECT * FROM movies WHERE id= ${id}`, (err, response) =>{
        if(err) next(err)

        if(response.rows.length === 0) {
            next({name: "ErrorNotFound"})
        } else {
            res.status(200).json(response.rows[0]);
        }
        
    }) 
});

router.post("/movies", authorization, (req, res) =>{
    console.log(req.body);
    const {id, title, genres, year} = req.body;
    const insertQuery =`
        INSERT INTO movies (id, title, genres, year)
            VALUES
            ($1, $2, $3, $4)
    `
    pool.query(insertQuery, [id, title, genres, year], (err, response) =>{
        if(err) {
            throw err
        }
        res.status(201).json({
            message: "Movies Created Successfully"
        })
    }) 
});

router.put("/movies/:id", (req, res) =>{
    const {id} = req.params;
    const {title, year} = req.body;
    const updateQuery =`
        UPDATE movies
        SET title = $1,
            year = $2
        WHERE ID = $3
    `
    pool.query(updateQuery, [title, year, id], (err, response) =>{
        if(err) {
            throw err
        }
        res.status(200).json({
            message: "Movies Updated Successfully"
        })
    }) 
}); 

router.delete("/movies/:id", (req, res) =>{
    const {id} = req.params;
    const findQuery =`
        SELECT 
            *
        FROM movies
            WHERE id = $1
    `
    pool.query(findQuery, [id], (err, response) =>{
        if(err) {
            throw err
        }
        if(response.rows[0]){

            const deleteQuery =`
                DELETE FROM movies
                WHERE id = $1;
            `
            pool.query(deleteQuery, [id], (err, response) =>{
                if(err) {
                    throw err
                }
                res.status(200).json({
                    message: "Movies Deleted Successfully"
                })
            })
        } else {
            res.status(404).json({
                message: "Movies Not Found"
            })
        }
    }) 
});

module.exports = router;  