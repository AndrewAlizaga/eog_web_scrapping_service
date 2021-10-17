const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("../services/pattern_detector");
const {imgFilter} = require("../services/image_filter")
const {CaseSources} = require("../utils/Enums");
const {convertStringToUrlQuery} = require("../utils/parseHelper");



//Proceed to turn code into 1 shoot usage
const sampleCases = {
    asesinatoPuntaPie: 'https://www.elnuevodiario.com.ni/sucesos/498942-asesinato-managua-juzgados-policia/',
    asesinatoChureca: 'https://www.elnuevodiario.com.ni/sucesos/501821-asesinato-chureca-managua-policia/',
    intentoLesionNina: 'https://www.elnuevodiario.com.ni/sucesos/501775-asesinato-violencia-policia-managua/'
};

const base_url = "https://www.elnuevodiario.com.ni/busqueda/?q="

let collectedData = {}

const evaluateFunction = async (page, casesList) => {
	
	casesList = await page.evaluate(async (casesList) => {
	console.log('debugging function')
	console.log(casesList)
	console.log(`url is ${location.href}`)
        casesList.push(document.getElementsByClassName('gsc-webResult gsc-result'))
	console.log('new blocks added to the cases list')
	return casesList
	})
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
    const browser = await puppeteer.launch({headless: false, defaultViewport: {
        width:1920,
        height:1080
      }});

    const page = await browser.newPage();
	
    let casesList = []
    let pagesObj = []
	
   
    await page.goto(base_url+name, {waitUntil: 'networkidle2'});

    //Get  dimensions
    let pagesLinks = await getPagesNumb(page);
    
	console.log('obtained links')
	console.log(pagesLinks)
	
	for(i=0;i<pagesLinks;i++){
		
		if(i!=0){
			//simulate page click
		}
		//get data
		console.log('debugging casesList prior sending')
		console.log(casesList)
		casesList = await evaluateFunction(page, casesList)
	}
	
	
	
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

