const express = require("express")
const router = express.Router()
const db = require('../connection')

router.get('/all', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select * from hospital;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.post('/getavailbed', async (req, res) => {
    try {
        //Do SQL query
        const { hospitalname } = req.body;
        const getData = await db.query("Select hospital.hospitalname, ward.hospitalid, bed.bedstatus \
        from  ward right join bed on \
        bed.wardid = ward.wardid \
		right join hospital on hospital.hospitalid = ward.hospitalid where hospital.hospitalname = '"+hospitalname+"';")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.post('/getwardinfo', async (req, res) => {
    try {
        //Do SQL query
        const { hospitalname } = req.body;
        const getData = await db.query("SELECT h.hospitalname, w.wardid, w.wardtype, w.staffid1, w.staffid2, \
        b.bedstatus, count(b.bedstatus) as amount\
        FROM hospital h\
        INNER JOIN ward w\
        ON h.hospitalid = w.hospitalid\
        INNER JOIN bed b\
        ON w.wardid = b.wardid\
        WHERE h.hospitalname = '"+hospitalname+"'\
        GROUP BY h.hospitalname, w.wardid, b.bedstatus\
        ORDER BY w.wardid;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.get('/bedinfo', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select ward.wardid, count (bed.bedstatus) as total\
        from ward right join bed on \
        bed.wardid = ward.wardid \
		inner join hospital on\
		ward.hospitalid = hospital.hospitalid\
		where hospital.hospitalname = 'Alexandra Hospital'\
        group by ward.wardid\
		order by ward.wardid;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

//Ward breakdown
router.get('/wardbreakdown', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select ward.hospitalid, count(ward.wardid) \
        from hospital inner join ward on hospital.hospitalid = ward.hospitalid \
        group by ward.hospitalid;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.get('/allwards', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select * from ward;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.get('/allbeds', async (req, res) => {
    try {
        //Do SQL query
        const getData = await db.query("Select * from bed;")
        return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
})

router.post('/icubedstatus', async (req, res) => {
    try{
        const { hospitalname } = req.body;
        const getData = await db.query("Select hospital.hospitalname, bed.bedstatus from bed left join ward on bed.wardid = ward.wardid left join hospital on hospital.hospitalid = ward.hospitalid where ward.wardtype = 'ICU' and hospital.hospitalname = '"+hospitalname+"' order by hospitalname;")
     return res.json(getData)
        
    } catch (e) {
        console.error(e.message)
    }
    db.$pool.end
})

module.exports = router;