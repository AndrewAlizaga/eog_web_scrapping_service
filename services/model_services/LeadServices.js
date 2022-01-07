const {getAsync, setAsync, client} = require("../db/redis/index")
//const Lead = require("../services/db/models/leads")

async function saveLeadDB(lead){
    try {
     
        var result = await client.set(lead.link, lead)   
        console.log('lead saving result')
        console.log(result)
        return result

    } catch (error) {
        console.log('error checking on db')
        console.log(eror)
        return error
    }
}

async function checkIfLeadExists(link){
    var exists = false;

    try {
     
        var lead_ = await client.get(link)   
        exists = lead_?true:false

    } catch (error) {
        console.log('error checking on db')
        console.log(eror)
        return error
    }
    return exists
}

module.exports = {checkIfLeadExists, saveLeadDB}