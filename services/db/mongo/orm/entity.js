let mongoClient = require("../mongo")
let EOG_DB = process.env.EOG_DB

   

    async function checkClient(){

    }

    async function checkEmpty(){

    }


    async function SaveEntity(data, table){

       let mongoAgregationResult = await mongoClient.db(EOG_DB).collection(table).insertOne(data)
       console.log("agregation result: ", mongoAgregationResult)
       return mongoAgregationResult
    }

    async function SaveEntities(data){}
    
    async function DeleteEntityByID(id){}
    
    async function GetEntityByID(id){}

    async function GetEntitiesByID(id){}

module.exports = {
SaveEntity,
SaveEntities,
DeleteEntityByID,
GetEntityByID,
GetEntitiesByID
}