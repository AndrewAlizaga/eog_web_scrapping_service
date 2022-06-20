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
    }


    //main scrapping method for the sites, abstract since each site has its ways
    async scrap(){
        const browser = await puppeteer.launch({headless: false, defaultViewport: {
            width:1920,
            height:1080
          }});
    
        const page = await browser.newPage();
    
        //REMOVE TIMEOUT LIMIT
        await page.setDefaultNavigationTimeout(0); 
    
        await page.goto(base_url+this.name, {waitUntil: 'networkidle2'});
    
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

}

module.exports = Site