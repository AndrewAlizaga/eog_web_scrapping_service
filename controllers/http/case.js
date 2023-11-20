const { error } = require('console')
const {searchCase} = require('../internal/case')
const { SearchLevel } = require('../../utils/Enums')


async function CreateCase(req, res) {

    console.log("create case invoke")
    var {name, searchLevel} = req.body
       
    if (name == null || name == "" || searchLevel == null ) {
        return res.status(403).json("missing data on request")
    }

    var {scrappingResponse, error} = await searchCase(name, 2, searchLevel)

    console.log("results - ", scrappingResponse)
    console.log(error)

    if (error) {
        res.status(503).json('internal error')
    }
    
    res.status(200).json(scrappingResponse)
    
    return res
}

module.exports = {CreateCase}