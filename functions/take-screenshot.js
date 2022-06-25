const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');


exports.handler = async (event, context) => {
    try {

        const params = JSON.parse(event.body);
        const pageToScreenshot = params.pageToScreenshot;

        const browser = await puppeteer.launch({

        /* use this when deploying */
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,

        /* use these when on dev */
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        // args: [],
        // headless: true,
        });
        
        const page = await browser.newPage();
        
        await page.setViewport({
            width: 800,
            height: 600,
            deviceScaleFactor: .5,
            });

        await page.goto(pageToScreenshot,  { waitUntil: 'load' });

        const title = await page.title();

        let description;

        const url = await page.url();

        const screenshot = await page.screenshot();

        if(await page.$('meta[property="og:description"]')) {
           description = await page.$eval('meta[property="og:description"]', (element) => element.content);
        } 

        await browser.close();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'OK',
                message: `Completed screenshot of ${title}`,
                page: {
                    title,
                    description,
                    url
                }

            })
        }
        browser.disconnect();
    } catch(error) {
        console.log(error)
        document.getElementById('result').textContent = `Error: ${error.toString()}`;
    } 
    
}
