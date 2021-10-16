const express = require("express")

const router = express.Router()

//Controller
const {searchCase} = require('../controllers/case')

router.get("/case", searchCase)


module.exports = router
