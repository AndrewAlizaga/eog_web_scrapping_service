const client = require("../db/redis/index")
const Search = require("../db/models/search")


async function processSearch(search, responding, callbackSuccess, callbackFailure){
    let current_date = new Date()
    //const search_ = new Search(search.leads, search.name, search.user_key, search.status, current_date)

    checkIfSearchExists(search, saveSearch, responding, callbackSuccess, callbackFailure)
}

async function saveSearch(search, responding = false, callbackSuccess = null, callbackFailure = null){
    try {

        //let load = JSONT
        var dumped = JSON.stringify(search)
        //console.log(dumped) 

        client.setEx(search.name, 120, dumped)
        .then((x) => {
            console.log('success')
            if(responding){
                callbackSuccess(x, res)
            }
        })
        .catch(x => {
            if(responding)
                callbackFailure(x, res)
        })
        
    } catch (error) {
        console.log('error checking on db')
        console.log(error)
        return error
    }
}

async function checkIfSearchExists(search, callback, responding = false, callbackSuccess = null, callbackFailure = null){
    try {
        console.log("trying to search search")
            //let result_ = 
            //client.set('fuckyou', 'thats what')
            //Exists avoid replacing
            client.get(search.name)
                        .then((val) => {
                console.log('found: '+val)
                console.log('SEARCH ALREADY EXISTS NOTHING TO DO')
                if(responding){
                    callbackSuccess({'search_key': val})
                }
            })
            //Does not exists begin init
            .catch((err)=> {
                console.log('did not found related search, proceed saving process')
                if(responding){
                    callback(search, true, callbackSuccess, callbackFailure)
                }else{
                    callback(search)
    
                }
                
            }) 
            /*result_()
            console.log('redis result: ')
            console.log(result_)*/
    
        } catch (error) {
            console.log('error checking on db')
            console.log(error)
            if(responding){
                callbackFailure(error)
            }
            return error
        }
}

module.exports = {processSearch}