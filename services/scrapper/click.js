function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const pageClick = async (page, index) => {
    console.log('clicking function '+index)

    //click on button related to index
   // await page.click('[name="commit"]')
    console.log('clicked page link')

    const navigationPromise = page.waitForNavigation()
    let links_array = [''];

    await page.evaluate(async (index, navigationPromise) => {
            let elements = document.getElementsByClassName("gsc-cursor-page")
            await elements[index].click()
    }, index)    

    console.log('clicked')
    await sleep(100)
    console.log('end of page click waited')
}

module.exports = pageClick