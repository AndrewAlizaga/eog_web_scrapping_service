const {expect} =  require("chai")
const CaseClass = require("../../../../../services/db/mongo/orm/case")


describe('Save Case', () => {
    it('Should save a case successfully', async function () {
        const searchCase = {
            'name': 'sample',
            'id': 123,
            'leads': [
                'google.com'
            ]
        }

        result = await CaseClass.SaveCase(searchCase)
        console.log("test returned data: ", result)
        expect(result).to.not.equal(null)

    })
})