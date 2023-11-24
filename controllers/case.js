//Bots
const { error } = require("console")
const Site = require("../class/sites/webSite")


//Search case controller
const searchCase = async (name, source = 2, searchLevel = 0) => {

	console.log("name: ", name)
	
	let results = null
	var scrapper = Site

	let bot = 1

	const sources = GetSiteSerchSources(source, searchLevel);

	
	
	switch (source) {
        // TODO: 
        case 1:
       

        // Web Site
        case 2:
            console.log("web site tracking");

            const responses = [];

            for (const element of sources) {
                scrapper = new WebSite(
                    name,
                    null,
                    null,
                    element.base_url,
                    element.sub_url,
                    element.tracking_sufix,
                    element.pages_detector_class
                );

                const { scrappingResponse, error } = await scrapper.scrap();

                console.log("POST SCAPPER CALL");

                if (error != null) {
                    return res.status(503).json({ message: `INTERNAL ERROR: ${error.toString()}` });
                }

                console.log("results");
                console.log(scrappingResponse);

                // DB SAVE
                scrapper.compileCases(scrappingResponse.search.leads, (x) => {
                    console.log("compiled results: ", x);
                    LeadORM.SaveLeads(x);
                });

                // sent to db and push to responses
                CaseORM.SaveCase(scrappingResponse.search);
                responses.push(scrappingResponse);
            }

            return res.status(200).json({ responses, error: null });

        default:
            console.log("not found");
            return res.status(404).json({ message: "Scrapper unidentifiable" });
    }
	
	//Scrapping ready
	//return res.status(200).json(results)

}



module.exports = {searchCase}
