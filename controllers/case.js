//Bots
const { error } = require("console")
const nuevoDiario = require("../class/sites/nuevoDiario")
const Site = require("../class/sites/site")


//Search case controller
const searchCase = async (name) => {

	console.log("name: ", name)
	
	let results = null
	var scrapper = Site

	let bot = 1
	
	
	if(!bot || bot.localeCompare!=0){
		try{

			scrapper = new nuevoDiario(name)

			var {scrappingResponse, error} = await scrapper.scrap()

			console.log("POST SCAPPER CALL")
			
			if (error != null) {
				return null, new Error("INTERNAL ERROR: "+error.toString())

			}

			console.log("results")
			console.log(scrappingResponse)
			//return res.json(results).status(200)
			return {scrappingResponse, error}


		}catch(e){
			//return res.status(503).json({'message': e.toString()})
			return null, new Error("INTERNAL ERROR: "+e.toString())
		}
	}

	var scrapper = Site


	switch(bot){
		
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
		
			case 2:
			break;
		
		case 3:
			break;
	
		default: 
			//return res.status(404).json({'message': 'Scrapper unidentify'})
			break;
	}
	
	//Scrapping ready
	//return res.status(200).json(results)

}



module.exports = {searchCase}
