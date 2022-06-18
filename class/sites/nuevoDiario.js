const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("../services/pattern_detector");
const {imgFilter} = require("../services/image_filter")
const {CaseSources} = require("../utils/Enums");
const {convertStringToUrlQuery} = require("../utils/parseHelper");

//Web scrapper functions
const pageClick = require("../services/scrapper/click")

class NuevoDiario extends Site {
    constructor(name, date, type) {
        super();
    }

    scrap(){
        super()



    }

}