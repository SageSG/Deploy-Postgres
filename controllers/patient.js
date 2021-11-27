const express = require("express")
const router = express.Router()
const db = require('../connection')

router.get('/all', (req, res) => {
    db.any("Select patientid, patientname, date(admissiondate) as admissiondate, date(dischargedate) as dischargedate, statusno from patient;").then(rows=>{
        // console.log(rows);
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/getavgdays', (req, res) => {
    db.any("Select patient.patientid, DATE_PART('day', patient.dischargedate - admissiondate) from patient where dischargedate > CURRENT_DATE;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/statusall', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select * from status;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.get('/nokall', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select * from NOK;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

// router.post('/newpatient', async (req, res) => {
//     try {
//         // parse request body
//         const {patientname, admissiondate, dischargedate, statusno} = req.body;

//         //Do SQL query
//         const getData = await db.query("insert into patient (patientname, admissiondate, dischargedate, statusno) values ('"+patientname+"','"+patientname+"','"+patientname+"','"+patientname+"');")
//         res.json(getData)
        
//     } catch (e) {
//         console.error(e.message)
//     }
// })



module.exports = router;