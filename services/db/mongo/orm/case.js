let mongoClient = require("../mongo")
let EntityORM = require("./entity")

let tableName = "cases"
let primaryKey = "id"
let groupKey = "owner"
    

    async function SaveCase(searchCase){
        let caseResult = await EntityORM.SaveEntity(searchCase, tableName)
        console.log(caseResult)
        return caseResult
    }

    async function UpdateCase(searchCase){
        let caseResult = await EntityORM.UpdateEntity(searchCase, searchCase.id, tableName)
        console.log(caseResult)
        return caseResult
    }

    async function SaveCases(searchCases){

    }
    
    async function DeleteCaseByID(id){
        let caseResult = await EntityORM.DeleteEntityByID(id, tableName)
        console.log(caseResult)
        return caseResult
    }
    
    async function GetCaseByID(id){
        let caseResult = await EntityORM.GetEntityByID(id, tableName)
        console.log(caseResult)
        return caseResult
    }


    async function GetCasesByID(id){
        let caseResult = await EntityORM.GetEntitiesByID(id, groupKey, tableName)
        console.log(caseResult)
        return caseResult
    }


module.exports = {
SaveCase,
UpdateCase,
SaveCases,
DeleteCaseByID,
GetCaseByID,
GetCasesByID
}