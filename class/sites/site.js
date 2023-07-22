//Abstract class that works as base for sites to scrapon
/**
 * 
 * Abstract Class Site
 * 
 * @class Site
 * 
 */
 const puppeteer = require("puppeteer");
 const { detectPositivity, detectNames, detectCaseNature } = require("../../services/pattern_detector");
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
        this.browser = puppeteer.Browser
        this.page = Site.page

    }


    //main scrapping method for the sites, abstract since each site has its ways
    async scrap(){
        this.browser = await puppeteer.launch({headless: false, defaultViewport: {
            width:1920,
            height:1080
          }});
        
        this.page = await this.browser.newPage();
        var context = await this.browser.defaultBrowserContext();
        context.overridePermissions(this.base_url, ["notifications"])
        console.log("base scrapping")
    
        //REMOVE TIMEOUT LIMIT
        await this.page.setDefaultNavigationTimeout(0); 
    
        await this.page.goto(this.base_url, {waitUntil: 'networkidle2'});
    
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
        console.log('invoke getPagesNumb - ')
        var pageNumber = await this.page.evaluate(async () => {
            
            console.log('iterating pages')

            var pages = [...document.getElementsByClassName(this.pageNumberClass)]
            
            console.log('pages')
            console.log(pages.length)
            return pages.length
            
            })
            console.log('p links')
            console.log(pageNumber)
            return pageNumber
    }
    
    async compileCase (url) {
        console.log("invoke - compileCase - abstract class - ", url)
/*
        this.browser = await puppeteer.launch({headless: false, defaultViewport: {
            width:1920,
            height:1080
          }});
        */
        this.page = await this.browser.newPage();
        var context = this.browser.defaultBrowserContext();
        context.overridePermissions(this.base_url, ["notifications"])
        console.log("base scrapping")
    
        //REMOVE TIMEOUT LIMIT
        await this.page.setDefaultNavigationTimeout(0); 
    
        await this.page.goto(url, {waitUntil: 'domcontentloaded'});
        
      //  await page.goto(url, {waitUntil: "domcontentloaded"});
        console.log('settings loaded')
        const collectedData = await this.page.evaluate( async () => {
    
            console.log(`url is ${location.href}`);
     
            let title;
            let paragraphs_unfiltered = [];
            let unfiltered_img_url_list = [];
            let date;
        
            console.log('pre querying')

             await setTimeout(5000000)

            console.log('post querying')

            title = document.querySelector('.entry-title')?document.querySelector('.entry-title').textContent:"";
     
            paragraphs_unfiltered = [...document.querySelectorAll('.entry-excerpt-content-custom')].map(e => e.innerText);
            date = [...document.querySelectorAll('.fbia-published-date')].map(e => e.datetime);
            unfiltered_img_url_list = [...document.querySelectorAll('.wp-post-image')].map(e => e.src);
            
        try{
            date = date[0].toString() + date[1].toString();
            }catch(e){
        date = e
        }
        console.log("passed queries")
            ///paragraphs_unfiltered = paragraphs_unfiltered.
            return {
                title,
                paragraphs_unfiltered,
                date,
                unfiltered_img_url_list
            };
        });
    
        //Classification services
        console.log("post browser?")
        //Clasify found positivity
        collectedData.positivity = await detectPositivity(collectedData.paragraphs_unfiltered);
    

        //Case Nature
        collectedData.nature = await detectCaseNature(collectedData.paragraphs_unfiltered);


        //Find parties involved
        collectedData.party_involved = await detectNames(collectedData.paragraphs_unfiltered);
    
        //Image filtering
        //collectedData.unfiltered_img_url_list = await imgFilter(collectedData.unfiltered_img_url_list, CaseSources.NuevoDiario);
    
        //Log results
        console.log(collectedData);

        return collectedData
    }
}

module.exports = Site