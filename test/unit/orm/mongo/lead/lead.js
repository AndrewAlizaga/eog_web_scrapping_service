const {expect} =  require("chai")
const LeadORM = require("../../../../../services/db/mongo/orm/lead")


describe('Case Integrity', () => {

    it('Should save a case successfully', async function () {
        const searchLead = {
            'name': 'sample',
            'id': "123",
            'owner': "qwerty",
            'leads': [
                'google.com'
            ]
        }

        result = await LeadORM.SaveLead(searchLead)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should save a second case successfully', async function () {
        const searchLead = {
            'name': 'sample2',
            'id': "124",
            'owner': "qwerty",
            'leads': [
                'google.com'
            ]
        }

        result = await LeadORM.SaveLead(searchLead)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should get a case by id', async function () {
    
        result = await LeadORM.GetLeadByID("123")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })


    it('Should update a case', async function () {
        const searchLeadUpdate = {
            'name': 'sample 2',
            'id': "123",
            'owner': "qwerty",
            'leads': [
                'google.com',
                "duckgo.com"
            ]
        }

        result = await LeadORM.UpdateCase(searchLeadUpdate)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should get many cases by group id', async function () {
 
        result = await LeadORM.GetLeadsByID("qwerty")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should delete a case by id', async function () {
 
        result = await LeadORM.DeleteLeadByID("123")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })
})