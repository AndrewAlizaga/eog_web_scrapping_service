//Bots
const { error } = require("console")
const nuevoDiario = require("../class/sites/nuevoDiario")
const Site = require("../class/sites/site")


//Search case controller
const searchCase = async (name) => {

	
	let results = null
	var scrapeper = Site

	let bot = 1
	
	
	if(!bot || bot.localeCompare!=0){
		try{
			//results = await nuevoDiario(name, res);
			//Got threats check on redis if being analyze
			scrapeper = new nuevoDiario(name)

			 var {scrappingResponse, error} = await scrapeper.scrap()

			console.log("POST SCAPPER CALL")
			if (error != null) {
//				return res.status(503).json({'message': e.toString()})
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

	var scrapeper = Site


	switch(bot){
		
		//Basic google & duckgo search
		case 0:
			break;
	
		//Nuevo diario
		case 1:
			
			scrapeper = new nuevoDiario(name)
			results, error = scrapeper.scrap()

			if (error != null) {
				return res.status(503).json({'message': e.toString()})

			}
			
			return res.json(results).status(200)
		/*
			try{ 
		              console.log('pre bot call')
                  		results = await nuevoDiario();
				console.log('WAITED')
				console.log(results)
				return res.status(200).json(results)
                        }catch(e){ 
				console.log('exception triggered')
                                return res.status(503).json({'message': e.toString()})
                        }                        
			break;
		*/
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
