let mongoClient = require("../mongo")
let EntityORM = require("./entity")

let tableName = "cases"
let primaryKey = "id"
let groupKey = ""
    

    async function SaveCase(searchCase){
        let caseResult = await EntityORM.SaveEntity(searchCase, tableName)
        console.log(caseResult)
        return caseResult
    }

    async function SaveCases(searchCases){}
    
    async function DeleteCaseByID(searchCaseID){}
    
    async function GetCaseByID(){caseID}






module.exports = {
SaveCase,
SaveCases,
DeleteCaseByID,
GetCaseByID
}