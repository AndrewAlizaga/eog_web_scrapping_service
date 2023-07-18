const express = require("express")

const router = express.Router()

//Controller
const {CreateCase} = require('../controllers/http/case')


//applying middleware for auth connection
router.post("/case", CreateCase)


module.exports = router
