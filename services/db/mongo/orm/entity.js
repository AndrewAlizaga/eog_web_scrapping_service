let mongoClient = require("../mongo")
let EOG_DB = process.env.EOG_DB

   

    async function checkClient(){

    }

    async function checkEmpty(){

    }


    async function SaveEntity(data, table){

       let mongoResult = await mongoClient.db(EOG_DB).collection(table).insertOne(data)
       console.log("SaveEntity result: ", mongoResult)
       return mongoResult
    }

    async function UpdateEntity(data, id, table){

        const query = { id };
        const update = { $set: data};
        const options = { upsert: true };

        let mongoResult = await mongoClient.db(EOG_DB).collection(table).updateOne(query, update, options)
        console.log("UpdateEntity result: ", mongoResult)
        return mongoResult
     }

    async function SaveEntities(data){}
    
    async function DeleteEntityByID(id, table){
        const query = {id}
        let mongoResult = await mongoClient.db(EOG_DB).collection(table).deleteOne(query)
        console.log("DeleteEntityByID result: ", mongoResult)
        return mongoResult

    }
    
    async function GetEntityByID(id, table){
        const query = {id}
        let mongoResult = await mongoClient.db(EOG_DB).collection(table).findOne(query)
        console.log("GetEntityByID result: ", mongoResult)
        return mongoResult 
    }

    async function GetEntitiesByID(id, groupKey, table){
        const query = { [groupKey] : id}
        let mongoResult = await mongoClient.db(EOG_DB).collection(table).find(query)
        console.log("GetEntityByID result: ", mongoResult)
        return mongoResult 
    }

module.exports = {
SaveEntity,
SaveEntities,
DeleteEntityByID,
GetEntityByID,
GetEntitiesByID,
UpdateEntity
}