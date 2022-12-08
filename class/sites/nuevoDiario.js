const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("../../services/pattern_detector");
const {imgFilter} = require("../../services/image_filter")
const {CaseSources} = require("../../utils/Enums");
const {convertStringToUrlQuery} = require("../../utils/parseHelper");
const Site = require("./site")
//Web scrapper functions
const pageClick = require("../../services/scrapper/click");
const LeadServices = require("../../services/model_services/LeadServices");
const SearchServices = require("../../services/model_services/SearchServices");
const { timingSafeEqual } = require("crypto");
const { error } = require("console");

class NuevoDiario extends Site {
    constructor(name, date, type) {
        super(name, date, type);
        this.pageNumberClass = 'gsc-cursor-page'
        this.base_url = "https://www.elnuevodiario.com.ni/busqueda/?q="
    }

    
    async scrap(){
    await super.scrap()

    //Get  dimensions
    let pagesLinks = await super.getPagesNumb();

	console.log('obtained links')
	console.log(pagesLinks)

        if (pagesLinks == 0) {
                //get data
                let newCases = []
                console.log('debugging this.casesList prior sending')
                console.log(this.casesList)
                newCases = await this.evaluateFunction(this.page, this.casesList)
                //filter links
                console.log('list length 1: '+newCases.length)

                newCases = newCases.filter(x => {
                        if (x !== '' && x !== null) return true
                        else return false
                })

                console.log('list length 2: '+newCases.length)
                console.log("cases")
                console.log(newCases)
                this.casesList = this.casesList.concat(newCases)
                console.log(this.casesList)
        }else {
                for(let i=0;i<pagesLinks;i++){
                        console.log("bucle run: "+i+" from: "+pagesLinks)
                        if(i!=0){
                                let newCases = []
                                console.log('about to click')
                                await pageClick(this.page, i)
                                newCases = await evaluateFunction(this.page, this.casesList)

                                console.log('cases pre filter: '+newCases.length)
                                //case
                                newCases = newCases.filter(x => {
                                        (x !== '' && x !== null) ? true : false
                                        
                                })
                                console.log('cases post filter: '+newCases.length)
        
                                this.casesList = this.casesList.concat(newCases)
                                console.log(this.casesList)
                                console.log('total cases: '+this.casesList.length)
                        }else{
                                //get data
                                let newCases = []
                                console.log('debugging this.casesList prior sending')
                                console.log('total cases: '+this.casesList)
                                newCases = await evaluateFunction(this.page, this.casesList)
                                //filter links
                                console.log('cases pre filter: '+newCases.length)
        
                                newCases = newCases.filter(x => {
                                        (x !== '' && x !== null)?true:false
                                })
        
                                console.log('cases post filter : '+newCases.length)

                                this.casesList = this.casesList.concat(newCases)
                                console.log('total cases: '+this.casesList.length)
                                console.log('index: '+i+' finished')
                        }
                        
                }
        
        }
	
	


        console.log("out of the cases obtain bucle")
        console.log('cases: '+this.casesList)
        //Store on redis to indicate current analysis for future searches
        //Avoid repeating process and waste resources

        console.log("redis yet to be implemented")

        if (this.casesList.length  == 0) {
                return new Error("not found")
        }

        console.log('leads have been processed, proceed with temp search cache')

        var scrappingResponse = {searchStatus: 2, 
                search: {
                id: 1,
                name: this.name+'-nuevodiario',
                leads: this.casesList
          }}

          console.log("SCRAPPED")
        console.log(scrappingResponse)

        var fullResponse = {scrappingResponse, error: null}

        console.log('fullresponse')
        console.log(fullResponse)
        //return sync response
        return fullResponse


    }

    async evaluateFunction(page, casesList){
	
        console.log('array prior page dom')
        console.log(casesList)
        let caseArray = ['']

	casesList = await this.page.evaluate(async (caseArray) => {

        console.log('about to search links')
        //Array to store the cases links

        caseArray = Array.from(document.getElementsByTagName('a'), (a) =>  {

                console.log('inspecting element')
                console.log(a.className)

                if(a.className == 'gs-title' && a.href !== '' && a.href !== null){
                        console.log('returning a.href')
                        console.log(a.href)
                        return a.href
                }

                //a.href

        });


        
        
        return caseArray

	}, caseArray)

      //  SearchServices.

        console.log('return case list: ')
        console.log('case list: ' + casesList)
        console.log(casesList[0])
        return casesList
}

}

module.exports = NuevoDiario