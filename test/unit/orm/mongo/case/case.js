const {expect} =  require("chai")
const CaseClass = require("../../../../../services/db/mongo/orm/case")


describe('Case Integrity', () => {

    it('Should save a case successfully', async function () {
        const searchCase = {
            'name': 'sample',
            'id': "123",
            'owner': "qwerty",
            'leads': [
                'google.com'
            ]
        }

        result = await CaseClass.SaveCase(searchCase)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should save a second case successfully', async function () {
        const searchCase = {
            'name': 'sample2',
            'id': "124",
            'owner': "qwerty",
            'leads': [
                'google.com'
            ]
        }

        result = await CaseClass.SaveCase(searchCase)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should get a case by id', async function () {
    
        result = await CaseClass.GetCaseByID("123")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })


    it('Should update a case', async function () {
        const searchCaseUpdate = {
            'name': 'sample 2',
            'id': "123",
            'owner': "qwerty",
            'leads': [
                'google.com',
                "duckgo.com"
            ]
        }

        result = await CaseClass.UpdateCase(searchCaseUpdate)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should get many cases by group id', async function () {
 
        result = await CaseClass.GetCasesByID("qwerty")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })

    it('Should delete a case by id', async function () {
 
        result = await CaseClass.DeleteCaseByID("123")
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })
})