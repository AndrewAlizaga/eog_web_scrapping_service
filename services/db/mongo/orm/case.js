let mongoClient = require("../mongo")
let EntityORM = require("./entity")

class CaseORM extends EntityORM {

    constructor(client){
        this.client = client
        this.tableName = "case"
        this.primaryKey = "id"
        this.groupKey = ""
    }

    async SaveCase(searchCase){}

    async SaveCases(searchCases){}
    
    async DeleteCaseByID(searchCaseID){}
    
    async GetCaseByID(){caseID}

}





module.exports = {
    SaveCase, 
    SaveCases, 
    DeleteCaseByID, 
    GetCaseByID,
}