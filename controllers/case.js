//Bots
const nuevoDiario = require("../scrappers/web_scrapper_nuevo_diario")



//Search case controller
const searchCase = async (req, res) => {

	
	

	let bot = 0

	if(req.body){
		bot = req.body.botId?req.body.botId:0
	}

	bot = 1

	let results = null

	switch(bot){
		
		//Basic google & duckgo search
		case 0:
			break;
	
		//Nuevo diario
		case 1:
			try{ 
                                results = await nuevoDiario();
                        }catch(e){ 
                                return res.status(503).json({'message': e.toString()})
                        }                        
			break;
		
		case 2:
			break;
		
		case 3:
			break;
	
		default: 
			return res.status(404).json({'message': 'Scrapper unidentify'})
			break;
	}
	
	//Scrapping ready
	return res.status(200).json(results)

}


module.exports = {searchCase}
