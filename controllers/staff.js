const express = require("express")
const router = express.Router()
const db = require('../connection')

router.get('/all', (req, res) => {
    db.any("Select * from staff;").then(rows=>{
        // console.log(rows);
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

module.exports = router;