const express = require("express")
const router = express.Router()
const db = require('../connection')

router.get('/bedstatus', (req, response) => {
    db.query("Select bed.bedstatus, count(bed.bedstatus) as total from bed group by bed.bedstatus;", (err, res) => {
        if (err) throw err
        response.json(res.rows)
    })
})
router.get('/icubedstatus', (req, response) => {
    db.query("Select bed.bedstatus, count(bed.bedstatus) as total from bed left join ward on bed.wardid \
    = ward.wardid where ward.wardtype = 'ICU' group by bed.bedstatus;", (err, res) => {
        if (err) throw err
        response.json(res.rows)
    })
})

module.exports = router;