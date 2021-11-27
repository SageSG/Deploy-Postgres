const express = require("express")
const app = express();
const cors = require('cors')
const db = require('./connection')
db.connect()

app.use(express.json()).use(cors());

const dbRouter = require('./controllers/dashboard')
app.use('/db', dbRouter)

app.listen(80)