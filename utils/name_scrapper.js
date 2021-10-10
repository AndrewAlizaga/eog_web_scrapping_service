const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    await page.goto("https://www.elnuevodiario.com.ni/sucesos/498942-asesinato-managua-juzgados-policia/", {waitUntil: 'networkidle2'});

    //Get  dimensions
    const collectedData = await page.evaluate(() => {

        console.log(`url is ${location.href}`);

        
        let title;
        let paragraphs_unfiltered = [];
        let date;

        title = document.querySelector('.title').textContent;
        paragraphs_unfiltered = [...document.querySelectorAll('p')].map(e => e.innerText);
        date = [...document.querySelectorAll('time')].map(e => e.innerText);

        var date_ = date[0].toString() + date[1].toString();
        
        //paragraphs_unfiltered = paragraphs_unfiltered.
        return {
            title,
            paragraphs_unfiltered,
            date_
        };
    });

    //Log results
    console.log(collectedData);

    await page.screenshot({path: 'example.png'});
    //await page.pdf({path: 'hn.pdf', format: 'A4'});

    await browser.close();
})();