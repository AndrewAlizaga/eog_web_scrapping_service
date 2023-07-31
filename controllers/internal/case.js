//Bots
const { error } = require("console")
const nuevoDiario = require("../../class/sites/nuevoDiario")
const LaPrensa = require("../../class/sites/laPrensa")
const CaseORM = require("../../services/db/mongo/orm/case")
const LeadORM = require("../../services/db/mongo/orm/lead")
const Site = require("../../class/sites/site")
const { compileFunction } = require("vm")
const Case = require("../../class/case")


//Search case internal
const searchCase = async (name, source = 2) => {

	console.log("searchCase - internal - source: ", source)
	
	let results = null
	var scrapper = Site

	switch (source) {
		
		//Basic google & duckgo search
		case 0:
			break;
	
		//Nuevo diario
		case 1:
			scrapper = new nuevoDiario(name)
			results, error = scrapper.scrap()

			if (error != null) {
				return res.status(503).json({'message': e.toString()})

			}
			
			return res.json(results).status(200)
		
			break;
			
		//La Prensa
		case 2:
			console.log("case 2")
			console.log("la presa case")
			scrapper = new LaPrensa(name)

			//main data scrap
			var {scrappingResponse, error} = await scrapper.scrap()

			console.log("POST SCAPPER CALL")
			
			if (error != null) {
				return null, new Error("INTERNAL ERROR: "+error.toString())

			}

			console.log("results")
			console.log(scrappingResponse)

			//DB SAVE


			/// get deeper data
			scrapper.compileCases(scrappingResponse.search.leads, (x) => {
				console.log("compiled results: ", x)
				LeadORM.SaveLeads(x)

			})
			CaseORM.SaveCase(scrappingResponse.search)
			return {scrappingResponse, error}

	
		default: 
			//return res.status(404).json({'message': 'Scrapper unidentify'})
			console.log("not found")
			break;
	}
	
	//Scrapping ready
	//return res.status(200).json(results)

}



module.exports = {searchCase}
