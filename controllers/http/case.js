const { error } = require('console')
const {searchCase} = require('../internal/case')


async function CreateCase(req, res) {

    console.log("create case invoke")
    var name = req.body.name
    console.log(name)
       
    if (name == null || name == "") {
        return res.status(403).json("missing name")
    }

    var {scrappingResponse, error} = await searchCase(name, 2)

    console.log("results - ", scrappingResponse)
    console.log(error)

    if (error != null) {
        res.status(503).json('internal error')
    }else{
        res.status(200).json(scrappingResponse)
    }


    return res
}

module.exports = {CreateCase}