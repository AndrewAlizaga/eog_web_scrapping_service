const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("../services/pattern_detector");
const {imgFilter} = require("../services/image_filter")
const {CaseSources} = require("../utils/Enums");
const {convertStringToUrlQuery} = require("../utils/parseHelper");

//Web scrapper functions
const pageClick = require("../services/scrapper/click")

//Redis
const {getAsync, setAsync} = require("../services/db/redis/index")
const Lead = require("../services/db/models/leads")


//Proceed to turn code into 1 shoot usage
const sampleCases = {
    asesinatoPuntaPie: 'https://www.elnuevodiario.com.ni/sucesos/498942-asesinato-managua-juzgados-policia/',
    asesinatoChureca: 'https://www.elnuevodiario.com.ni/sucesos/501821-asesinato-chureca-managua-policia/',
    intentoLesionNina: 'https://www.elnuevodiario.com.ni/sucesos/501775-asesinato-violencia-policia-managua/'
};

const base_url = "https://www.elnuevodiario.com.ni/busqueda/?q="

let collectedData = {}

const evaluateFunction = async (page, casesList) => {
	
        console.log('array prior page dom')
        console.log(casesList)

        let caseArray = ['']

	casesList = await page.evaluate(async (caseArray) => {

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

        console.log('return case list: ')
        console.log(casesList[0])
        return casesList
}

const getPagesNumb = async (page) => {
	
	var pageNumber = await page.evaluate(async () => {
	
	var pages = [...document.getElementsByClassName('gsc-cursor-page')]
	
	console.log('pages')
	console.log(pages.length)
	return pages.length
	
	})
	console.log('p links')
	console.log(pageNumber)
	return pageNumber

}



const collectData = async(name)  => {


        //check for key name so search does not repeat



    const browser = await puppeteer.launch({headless: false, defaultViewport: {
        width:1920,
        height:1080
      }});

    const page = await browser.newPage();

      //REMOVE TIMEOUT LIMIT
      await page.setDefaultNavigationTimeout(0); 


    let casesList = []
    let pagesObj = []
	
   
    await page.goto(base_url+name, {waitUntil: 'networkidle2'});

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
                        console.log('debugging casesList prior sending')
                        console.log(casesList)
                        newCases = await evaluateFunction(page, casesList)
                        //filter links
                        console.log('list length 1: '+newCases.length)

                        newCases = newCases.filter(x => {
                                if (x !== '' && x !== null) return true
                                else return false
                        })
                        console.log('list length 2: '+newCases.length)

                        casesList = casesList.concat(newCases)
                        console.log(casesList)
                        console.log('list length: '+casesList.length)
                        console.log("end of evaluateFunction")
		}else{
                        //get data
                        let newCases = []
                        console.log('debugging casesList prior sending')
                        console.log(casesList)
                        newCases = await evaluateFunction(page, casesList)
                        //filter links
                        console.log('list length 1: '+newCases.length)

                        newCases = newCases.filter(x => {
                                if (x !== '' && x !== null) return true
                                else return false
                        })

                        console.log('list length 2: '+newCases.length)
                        
                        casesList = casesList.concat(newCases)
                        console.log('list length 3: '+casesList.length)
                        console.log(casesList)
                        console.log('index: '+i+' finished')
                }
		
	}

        //Store on redis to indicate current analysis for future searches
        //Avoid repeating process and waste resources
        await casesList.forEach( async x =>  {

                var new_lead = new Lead(x, 'processing', 'nuevo_diario')
                
                console.log('object')
                console.log(new_lead)
                //check if lead is already existing first
                //ceck prior setting goes here.. call get

                //Store each case status on redis
                setAsync(x, new_lead)
        });

        //RETURN SEARCH ID SO CLIENT CAN BE CHECKING REQUEST STATE


        //START PROCESSING THREAD ON WORKER
        return casesList
	
	
	
    const collectedData = await page.evaluate( async () => {

        console.log(`url is ${location.href}`);
	

	let pagesNumb = [...document.getElementsByClassName('gsc-cursor-page')].map(e => e.innerText)
	let pagesObj = [...document.getElementsByClassName('gsc-cursor-page')]
	
	var pageAmount = pagesNumb.length
	casesList.push(document.getElementsByClassName('gsc-webResult gsc-result'))
	
        
        let title;
        let paragraphs_unfiltered = [];
        let unfiltered_img_url_list = [];
        let date;
	/*
	console.log('pre querying')
        title = document.querySelector('.title').textContent;
	console.log('fla let pagesNumb = [...document.getElementsByClassName('gsc-cursor-page')].map(e => e.innerText)
        let pagesObj = [...document.getElementsByClassName('gsc-cursor-page')]

        var pageAmount = pagesNumb.length
        casesList.push(document.getElementsByClassName('gsc-webResult gsc-result'))

g 1')
        paragraphs_unfiltered = [...document.querySelectorAll('p')].map(e => e.innerText);
	console.log('flag 2')
        date = [...document.querySelectorAll('time')].map(e => e.innerText);
        unfiltered_img_url_list = [...document.querySelectorAll('img')].map(e => e.src);
    	
	try{
        date = date[0].toString() + date[1].toString();
        }catch(e){
	date = e
	}
	console.log("passed queries")
        *///paragraphs_unfiltered = paragraphs_unfiltered.
        return {
		casesList,
		pagesObj,
            title,
            paragraphs_unfiltered,
            date,
            unfiltered_img_url_list
        };
    });

    //Classificatino services
    //Keep on JS or migrate to GOLANG
   console.log('extracted')
   console.log(collectedData)
	
	console.log("post browser?")
    //Clasify find violent metions
    collectedData.type = await detectViolence(collectedData.paragraphs_unfiltered);

    //Find parties involved
    collectedData.party_involved = await detectNames(collectedData.paragraphs_unfiltered);

    //Image filtering
    collectedData.unfiltered_img_url_list = await imgFilter(collectedData.unfiltered_img_url_list, CaseSources.NuevoDiario);

    //Log results
    console.log(collectedData);

    await page.screenshot({path: 'example.png'});
    //await page.pdf({path: 'hn.pdf', format: 'A4'});

  //  await browser.close();
	console.log("browser closed")
//   return collectedData
};

module.exports = collectData

