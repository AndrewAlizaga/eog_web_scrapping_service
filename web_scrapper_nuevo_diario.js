const puppeteer = require("puppeteer");
const { detectViolence, detectNames } = require("./services/pattern_detector");
const {imgFilter} = require("./services/image_filter")
const {CaseSources} = require("./utils/Enums");

//Proceed to turn code into 1 shoot usage
const sampleCases = {
    asesinatoPuntaPie: 'https://www.elnuevodiario.com.ni/sucesos/498942-asesinato-managua-juzgados-policia/',
    asesinatoChureca: 'https://www.elnuevodiario.com.ni/sucesos/501821-asesinato-chureca-managua-policia/',
    intentoLesionNina: 'https://www.elnuevodiario.com.ni/sucesos/501775-asesinato-violencia-policia-managua/'
};

let collectedData = {}

const collectData = async  => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();


    await page.goto(sampleCases.asesinatoChureca, {waitUntil: 'networkidle2'});

    //Get  dimensions
    const collectedData = await page.evaluate(() => {

        console.log(`url is ${location.href}`);

        
        let title;
        let paragraphs_unfiltered = [];
        let unfiltered_img_url_list = [];
        let date;

        title = document.querySelector('.title').textContent;
        paragraphs_unfiltered = [...document.querySelectorAll('p')].map(e => e.innerText);
        date = [...document.querySelectorAll('time')].map(e => e.innerText);
        unfiltered_img_url_list = [...document.querySelectorAll('img')].map(e => e.src);
    
        var date_ = date[0].toString() + date[1].toString();
        
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
};

module.exports = collectData