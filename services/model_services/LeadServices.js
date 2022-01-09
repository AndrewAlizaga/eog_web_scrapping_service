const client = require("../db/redis/index")
const Lead = require("../db/models/leads")

//client.connect()

//client.set('sample', 1).then(console.log('redis workds')).catch(console.log('redis does not work'))

async function ProcessLead(link, source, status = 0){
    client.set('stuff', 1223)
    checkIfLeadExists(link, source, status, saveLeadDB)
}

async function saveLeadDB(lead){
    try {
        //let load = JSONT
        var dumped = JSON.stringify(lead)
        console.log(dumped) 

        client.set(lead.linkKey, dumped).then((x) => {console.log('success')})
        
    } catch (error) {
        console.log('error checking on db')
        console.log(error)
        return error
    }
}

async function checkIfLeadExists(link, source, status, callback){
    console.log('checking lead existence')
	console.log('lead: '+link )
    try {
	console.log("trying to search lead")
        //let result_ = 
        client.set('fuckyou', 'thats what')
        client.get(link)
        //Exists avoid replacing
        .then((val) => {
            console.log('found: '+val)
            console.log('LEAD ALREADY EXISTS NOTHING TO DO')
        })
        //Does not exists begin init
        .catch((err)=> {
            console.log('did not found lead, proceed saving process')
            console.log(err)

            let lead = new Lead(link, source, status)

            console.log(lead)
            console.log('call to save on redis')
            callback(lead)

        }) 
        /*result_()
        console.log('redis result: ')
        console.log(result_)*/

    } catch (error) {
        console.log('error checking on db')
        console.log(error)
        return error
    }
	
    return 
}

module.exports = {checkIfLeadExists, saveLeadDB, ProcessLead}
