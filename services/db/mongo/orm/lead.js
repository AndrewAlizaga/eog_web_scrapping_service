let mongoClient = require("../mongo")
let EntityORM = require("./entity")

let tableName = "leads"
let primaryKey = "id"
let groupKey = "owner"
    

    async function SaveLead(searchLead){
        let leadResult = await EntityORM.SaveEntity(searchLead, tableName)
        console.log(leadResult)
        return leadResult
    }

    async function UpdateLead(searchLead){
        let leadResult = await EntityORM.UpdateEntity(searchLead, searchLead.id, tableName)
        console.log(leadResult)
        return leadResult
    }

    async function SaveLeads(searchLeads){

    }
    
    async function DeleteLeadByID(id){
        let leadResult = await EntityORM.DeleteEntityByID(id, tableName)
        console.log(leadResult)
        return leadResult
    }
    
    async function GetLeadByID(id){
        let leadResult = await EntityORM.GetEntityByID(id, tableName)
        console.log(leadResult)
        return leadResult
    }


    async function GetLeadsByID(id){
        let leadResult = await EntityORM.GetEntitiesByID(id, groupKey, tableName)
        console.log(leadResult)
        return leadResult
    }


module.exports = {
SaveLead,
UpdateLead,
SaveLeads,
DeleteLeadByID,
GetLeadByID,
GetLeadsByID
}