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

const collectData = async(name)  => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();

	
    await page.goto(base_url+name, {waitUntil: 'networkidle2'});

    //Get  dimensions
    const collectedData = await page.evaluate(() => {

        console.log(`url is ${location.href}`);

        
        let title;
        let paragraphs_unfiltered = [];
        let unfiltered_img_url_list = [];
        let date;

        title = document.querySelector('.title').textContent;
	console.log('flag 1')
        paragraphs_unfiltered = [...document.querySelectorAll('p')].map(e => e.innerText);
	consol.log('flag 2')
        date = [...document.querySelectorAll('time')].map(e => e.innerText);
        unfiltered_img_url_list = [...document.querySelectorAll('img')].map(e => e.src);
    
        var date_ = date[0].toString() + date[1].toString();
        
	console.log("passed queries")
        //paragraphs_unfiltered = paragraphs_unfiltered.
        return {
            title,
            paragraphs_unfiltered,
            date_,
            unfiltered_img_url_list
        };
    });

    //Classificatino services
    //Keep on JS or migrate to GOLANG

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

    await browser.close();

   return collectedData
};

module.exports = collectData

