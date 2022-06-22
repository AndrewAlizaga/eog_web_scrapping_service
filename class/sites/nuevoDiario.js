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
                        console.log('on the bucle')
                        console.log("bucle run: "+i+" from: "+pagesLinks)
                        if(i!=0){
                                let newCases = []
                                //simulate page click
                                console.log('about to click')
                                await pageClick(this.page, i)
                                //get data
                                console.log('debugging this.casesList prior sending')
                                console.log(this.casesList)
                                newCases = await evaluateFunction(this.page, this.casesList)
                                //filter links
                                newCases = newCases.filter(x => {
                                        if (x !== '' && x !== null) return true
                                        else return false
                                })
                                console.log('list length 2: '+newCases.length)
        
                                this.casesList = this.casesList.concat(newCases)
                                console.log(this.casesList)
                                console.log('list length: '+this.casesList.length)
                                console.log("end of evaluateFunction")
                        }else{
                                //get data
                                let newCases = []
                                console.log('debugging this.casesList prior sending')
                                console.log(this.casesList)
                                newCases = await evaluateFunction(this.page, this.casesList)
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
                                console.log('list length 3: '+this.casesList.length)
                                console.log(this.casesList)
                                console.log('index: '+i+' finished')
                        }
                        
                }
        
        }
	
	


        console.log("out of the bucle")
        console.log(this.casesList)
        //Store on redis to indicate current analysis for future searches
        //Avoid repeating process and waste resources

        if (this.casesList.length  == 0) {
                return new Error("not found")
        }

        await this.casesList.forEach( async x =>  {

                console.log("evaluating: "+x)
                //Check if leads exists already
                var source = 0
                LeadServices.ProcessLead(x, source)
              
        });       
    

        console.log('leads have been processed, proceed with temp search cache')

        //RETURN SEARCH ID SO CLIENT CAN BE CHECKING REQUEST STATE
        async function success (result)
        {
                console.log('returning a response')
               // console.log(res)      
                return result, null
        }

        async function failure (error)
        {
                console.log(error)
                return null, error
        }
        

        //START PROCESSING THREAD ON WORKER

        SearchServices.processSearch({'leads': this.casesList, 'name': this.name, 'user_key': 'dev', 'status': 0}, "nuevodiario", true, success, failure)
        
        //nuevo diario logic

        

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