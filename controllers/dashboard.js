const express = require("express")
const router = express.Router()
const db = require('../connection')

db.connect()

router.get('/bedstatus', (req, res) => {
    db.query("Select bed.bedstatus, count(bed.bedstatus) as total from bed group by bed.bedstatus;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/icubedstatus', (req, res) => {
    db.query("Select bed.bedstatus, count(bed.bedstatus) as total from bed left join ward on bed.wardid = ward.wardid where ward.wardtype = 'ICU' group by bed.bedstatus;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/alldischarge', (req, res) => {
    db.any("Select * from patient where patient.dischargedate between (NOW() - INTERVAL '14 DAY') AND NOW();").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/recentadmit', (req, res) => {
    db.any("SELECT * FROM patient where patient.admissiondate > (NOW() - INTERVAL '7 DAY');").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/hospitalinfo', (req, res) => {
    db.any("Select hospital.hospitalid, hospitalname, bed.patientid, ward.wardtype, ward.staffid1, \
    ward.staffid2 from hospital inner join ward on hospital.hospitalid = ward.hospitalid\
    inner join bed on ward.wardid = bed.wardid order by hospitalid, wardtype;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/mostrecent', (req, res) => {
    db.any("Select patientid, admissiondate, patient.statusno, condition from patient left join status on patient.statusno = \
    status.statusno where admissiondate <= now() order by admissiondate desc limit 5;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/ward', (req, res) => {
    db.any("SELECT ward.wardid, bed.bedid, bed.bedstatus FROM bed INNER JOIN ward ON bed.wardid=ward.wardid where bed.bedstatus=0").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/admission', (req, res) => {
    db.any("Select bed.bedid, bed.patientid, bed.bedstatus, patient.admissiondate, patient.statusno from bed left join patient on bed.patientid = patient.patientid;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/hospitaltotal', (req, res) => {
    db.any("Select avg( DATE_PART('day', patient.dischargedate - admissiondate)) from patient;").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})


router.get('/hospitaldays', (req, res) => {
    db.any("Select avg( DATE_PART('day', patient.dischargedate - admissiondate)) from patient where patient.dischargedate > (NOW() - INTERVAL '7 DAY');").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.get('/admitweek', (req, res) => {
    db.any("SELECT DATE_TRUNC('week',admissiondate) AS  admitted_week, COUNT(patientid) \
    AS number_of_patients FROM patient GROUP BY DATE_TRUNC('week',admissiondate);").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

//Swab data
router.get('/swaball', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select swab.swabid, swab.swabresult, swab.administertime, swab.patientid, swab.staffid from swab;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

//Display all empty beds in wards of each hospital
router.post('/searchward', (req, res) => {
    const {wardid} = req.body;
    db.any("SELECT * FROM ward where wardid="+wardid+";").then(rows=>{
        res.json(rows)
    }).catch(error=>{
        console.log(error)
    })
})

router.post('/updatestatus', async (req, res) => {
    try {
        // parse request body
        const {bedid, patientid, bedstatus} = req.body;

        // patientid is null if no patient
        //Do SQL query
        const getData = await db.query("update bed set bedstatus = "+bedstatus+", patientid="+patientid+" where bedid = "+bedid+";")
        res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})


router.post('/check', async (req, res) => {
    try {
        // parse request body
        const {patient, status} = req.body;

        console.log(patient, status)

        //Do SQL query
        const getData = await db.query("Select bedid from bed where patientid = 10103;")
        res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})


module.exports = router;