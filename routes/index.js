const express = require("express")

const router = express.Router()

//Controller
const {searchCase} = require('../controllers/case')


//applying middleware for auth connection
router.get("/case", searchCase)


module.exports = router
