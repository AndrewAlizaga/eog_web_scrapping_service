const { error } = require("console");
const nuevoDiario = require("../../class/sites/siteAPI");
const WebSite = require("../../class/sites/webSite");
const CaseORM = require("../../services/db/mongo/orm/case");
const LeadORM = require("../../services/db/mongo/orm/lead");
const Site = require("../../class/sites/source");
const { SearchLevel } = require("../../utils/Enums");
const LocalSites = require("../../config/source/settings/test/site.json");

const testEnv = process.env.EOG_ENV;

// Search case internal
const searchCase = async (name, source = 2, searchLevel = 0, res) => {
    console.log("searchCase - internal - source: ", source);

    let results = null;
    let errorResult = null;
    let scrapper = Site;

    const sources = GetSiteSerchSources(source, searchLevel);

    switch (source) {
        // TODO: 
        case 1:
            scrapper = new nuevoDiario(name);
            ({ results, error: errorResult } = scrapper.scrap());

            if (errorResult != null) {
                return res.status(503).json({ message: errorResult.toString() });
            }

            return res.status(200).json(results);

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
};

const GetSiteSerchSources = (type, searchLevel) => {
    if (testEnv === "local") {
        switch (searchLevel) {
            case SearchLevel.Low:
                return LocalSites;
            // TODO: implement medium and deep search
        }
    }

    if (type === 2) {
        switch (searchLevel) {
            case 0:
                return ["https://www.nuevodiarioweb.com.ar/noticias/2021/01/01/"];
            case 1:
                return ["https://www.nuevodiarioweb.com.ar/noticias/2021/01/01/"];
        }
    }

    return null;
};

module.exports = { searchCase };
