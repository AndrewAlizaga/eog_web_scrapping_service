const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("../../services/pattern_detector");
const {imgFilter} = require("../../services/image_filter")
const {CaseSources} = require("../../utils/Enums");
const {convertStringToUrlQuery} = require("../../utils/parseHelper");
const Site = require("./site")
//Web scrapper functions
const pageClick = require("../../services/scrapper/click")

class NuevoDiario extends Site {
    constructor(name, date, type) {
        super(name, date, type);
    }


    async scrap(){

    super.scrap()

    //Get  dimensions
    let pagesLinks = await getPagesNumb(page);
    
	console.log('obtained links')
	console.log(pagesLinks)
	
	for(i=0;i<pagesLinks;i++){
		console.log("bucle run: "+i+" from: "+pagesLinks)
		if(i!=0){
                        let newCases = []
			//simulate page click
                        console.log('about to click')
                        await pageClick(page, i)
                        //get data
                        console.log('debugging this.casesList prior sending')
                        console.log(this.casesList)
                        newCases = await evaluateFunction(page, this.casesList)
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
                        newCases = await evaluateFunction(page, this.casesList)
                        //filter links
                        console.log('list length 1: '+newCases.length)

                        newCases = newCases.filter(x => {
                                if (x !== '' && x !== null) return true
                                else return false
                        })

                        console.log('list length 2: '+newCases.length)
                        
                        this.casesList = this.casesList.concat(newCases)
                        console.log('list length 3: '+this.casesList.length)
                        console.log(this.casesList)
                        console.log('index: '+i+' finished')
                }
		
	}



        //Store on redis to indicate current analysis for future searches
        //Avoid repeating process and waste resources

        if (this.casesList.length  == 0) {
                return res.status(404).json("NO DATA FOUND")
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
                return res.status(200).json(result)
        }

        async function failure (error)
        {
        
                return res.status(200).json(error)
        }
        

        //START PROCESSING THREAD ON WORKER

        SearchServices.processSearch({'leads': this.casesList, 'name': name, 'user_key': 'dev', 'status': 0}, true, success, failure)
        
        //nuevo diario logic

        

    }

}

module.exports = NuevoDiario