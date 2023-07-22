let mongoClient = require("../mongo")


async function SaveLead(lead){}

async function SaveLeads(leads){}

async function DeleteLeadsByCaseID(caseID){}

async function DeleteLeadByID(leadID){}

async function GetLeadByID(){leadID}

async function GetLeadsByCaseID(caseID){}


module.exports = {
    SaveLead, 
    SaveLeads, 
    DeleteLeadByID, 
    DeleteLeadsByCaseID,
    GetLeadByID,
    GetLeadsByCaseID
}