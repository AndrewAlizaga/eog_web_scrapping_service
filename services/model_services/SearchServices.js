const client = require("../db/redis/index")
const Search = require("../db/models/search")
const res = require("express/lib/response")


async function processSearch(search, responding, callbackSuccess, callbackFailure){
    let current_date = new Date()
    //const search_ = new Search(search.leads, search.name, search.user_key, search.status, current_date)
    console.log('received search: ', search)
    checkIfSearchExists(search, saveSearch, responding, callbackSuccess, callbackFailure)
}

async function saveSearch(search, responding = false, callbackSuccess = null, callbackFailure = null){
    try {

        //let load = JSONT
        console.log('search-key-name '+search.name)
        var dumped = JSON.stringify(search)
        //console.log(dumped) 

        client.setEx(search.name, 120, dumped)
        .then((x) => {
            console.log('success')
            if(responding){
                callbackSuccess(search.name)
            }
        })
        .catch(x => {
            console.log('error: ', x)
            if(responding)
                callbackFailure(x)
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

            console.log('current search name: ', search.name)

            client.get(search.name)
                        .then((val) => {

                            if(val==null){
                                console.log('did not found related search, proceed saving process')
                                if(responding){
                                    callback(search, true, callbackSuccess, callbackFailure)
                                }else{
                                    callback(search)
                    
                                }
                            }else{
                                console.log('found: '+val)
                                console.log('SEARCH ALREADY EXISTS NOTHING TO DO')
                                if(responding){
                                    callbackSuccess({'search_key': val})
                                }
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