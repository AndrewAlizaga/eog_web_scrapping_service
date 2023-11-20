//Bots
const { error } = require("console")
const nuevoDiario = require("../../class/sites/siteAPI")
const WebSite = require("../../class/sites/webSite")
const CaseORM = require("../../services/db/mongo/orm/case")
const LeadORM = require("../../services/db/mongo/orm/lead")
const Site = require("../../class/sites/source")
const { compileFunction } = require("vm")
const Case = require("../../class/case")
const { SearchLevel } = require("../../utils/Enums")
const LocalSites = require("../../config/source/settings/test/site.json")

testEnv = process.env.EOG_ENV


//Search case internal
const searchCase = async (name, source = 2, searchLevel = 0) => {

	console.log("searchCase - internal - source: ", source)
	
	let results = null
	var scrapper = Site

	sources = GetSiteSerchSources(source, searchLevel)

	switch (source) {
		
		//API
		case 1:
			scrapper = new nuevoDiario(name)
			results, error = scrapper.scrap()

			if (error != null) {
				return res.status(503).json({'message': e.toString()})

			}
			
			return res.json(results).status(200)
		
			break;
			
		//Web Site
		case 2:
			console.log("web site tracking")

			var responses = []

			sources.array.forEach(async element => {
				
				scrapper = new WebSite(name, null, null, )

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
			//sent to db and psuh to responses
			CaseORM.SaveCase(scrappingResponse.search)
			responses.push(scrappingResponse)

			});

			return {responses, error}

			

	
		default: 
			//return res.status(404).json({'message': 'Scrapper unidentify'})
			console.log("not found")
			break;
	}
	
	//Scrapping ready
	//return res.status(200).json(results)

}


const GetSiteSerchSources = (type, searchLevel) => {


	if (testEnv == "local") {

		switch (searchLevel){
			case SearchLevel.Low:
			return LocalSites
			//TODO: implement medium and deep search
		}

	}

	if (type == 2){
		switch (level){
			case 0:
				return ["https://www.nuevodiarioweb.com.ar/noticias/2021/01/01/"]

			case 1:
				return ["https://www.nuevodiarioweb.com.ar/noticias/2021/01/01/"]


			}
	}

	return 
}

module.exports = {searchCase}
