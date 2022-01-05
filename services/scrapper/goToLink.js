const goToLink = (page, link) => {
    await page.goto(link, {waitUntil: 'networkidle2'});
}