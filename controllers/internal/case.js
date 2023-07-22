//Bots
const { error } = require("console")
const nuevoDiario = require("../../class/sites/nuevoDiario")
const LaPrensa = require("../../class/sites/laPrensa")

const Site = require("../../class/sites/site")
const { compileFunction } = require("vm")


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

			var {scrappingResponse, error} = await scrapper.scrap()

			console.log("POST SCAPPER CALL")
			
			if (error != null) {
				return null, new Error("INTERNAL ERROR: "+error.toString())

			}

			console.log("results")
			console.log(scrappingResponse)

			/// get deeper data
			let compiledResults = await scrapper.compileCases(scrappingResponse.search.leads)
			console.log("compiled results: ", compiledResults)

			//return res.json(results).status(200)
			return {compiledResults, error}
		
	
		default: 
			//return res.status(404).json({'message': 'Scrapper unidentify'})
			console.log("not found")
			break;
	}
	
	//Scrapping ready
	//return res.status(200).json(results)

}



module.exports = {searchCase}
