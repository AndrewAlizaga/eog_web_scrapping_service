const client = require("../db/redis/index")
const Search = require("../db/models/search")
const res = require("express/lib/response")


async function processSearch(search, site, responding, callbackSuccess, callbackFailure){
    let current_date = new Date()
    //const search_ = new Search(search.leads, search.name, search.user_key, search.status, current_date)
    console.log('received search: ', search)
    RedisLeadManagement(search, site, saveSearch, responding, callbackSuccess, callbackFailure)
}


//CODE HERE
async function saveSearch(search, siteKey, responding = false, callbackSuccess = null, callbackFailure = null){
    try {

        //let load = JSONT
        console.log('search-key-name '+search.name)
        var dumped = JSON.stringify(search)
        console.log('search-key-name '+search.name)

        //console.log(dumped) 

        client.setEx(search.name+siteKey, 120, dumped)
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

async function RedisLeadManagement(search, site, callback, responding = false, callbackSuccess = null, callbackFailure = null){
    try {
        console.log("trying to search search")

            console.log('current search name: ', search.name)

            client.get(search.name+site)
                        .then((val) => {

                            if(val==null){
                                console.log('did not found related search, proceed saving process')
                                if(responding){
                                    callback(search, site, true, callbackSuccess, callbackFailure)
                                }else{
                                    callback(search, site)
                    
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
                    callback(search, site, true, callbackSuccess, callbackFailure)
                }else{
                    callback(search, site)
    
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