//Abstract class that works as base for sites to scrapon
/**
 * 
 * Abstract Class Site
 * 
 * @class Site
 * 
 */
 const puppeteer = require("puppeteer");
 const { detectViolence, detectNames } = require("../../services/pattern_detector");
 const {imgFilter} = require("../../services/image_filter")
 const {CaseSources} = require("../../utils/Enums");
 const {convertStringToUrlQuery} = require("../../utils/parseHelper");
 
 //Web scrapper functions
 const pageClick = require("../../services/scrapper/click")
const { exists } = require("fs");

class Site {

    constructor(name, date = null, type = null) {

        if (this.constructor == Site){
            throw new Error("ABSTRACT CLASS CANNOT BE INSTANTIATED")
        }

        this.name = name;
        this.date = date;
        this.type = type;
        this.leads = [];
        this.casesList = []
        this.pagesObj = []
        this.pageNumberClass = ""
        this.base_url = ""

    }


    //main scrapping method for the sites, abstract since each site has its ways
    async scrap(){
        this.browser = await puppeteer.launch({headless: false, defaultViewport: {
            width:1920,
            height:1080
          }});
        
        this.page = await this.browser.newPage();
        var context = this.browser.defaultBrowserContext();
        context.overridePermissions(this.base_url, ["notifications"])
        console.log("base scrapping")
    
        //REMOVE TIMEOUT LIMIT
        await this.page.setDefaultNavigationTimeout(0); 
    
        await this.page.goto(this.base_url+this.name, {waitUntil: 'networkidle2'});
    
    }

    saveLeads(leads){
        this.leads = leads
    }

    removeLead(lead){
        this.leads.filter((element) => {
            if (element != lead) {
                return true
            }
        })
    }

    addLead(lead){
        
        leadFound = false
        added = true

        for(var i=0; i < this.leads.length; i++){
            if (this.leads[i] == lead){
                leadFound = true
                break
            }
        }


        leadFound?this.leads.push(lead):added=false

        return added
    }

    async evaluateFunction(page, casesList){}

    async getPagesNumb(){
        var pageNumber = await this.page.evaluate(async () => {
	
            var pages = [...document.getElementsByClassName(this.pageNumberClass)]
            
            console.log('pages')
            console.log(pages.length)
            return pages.length
            
            })
            console.log('p links')
            console.log(pageNumber)
            return pageNumber
    }
}

module.exports = Site