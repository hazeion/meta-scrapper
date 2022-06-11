const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');


exports.handler = async (event, context) => {
    try {

        const params = JSON.parse(event.body);
        const pageToScreenshot = params.pageToScreenshot;

        const browser = await puppeteer.launch({

            /* use this when deploying */
            // executablePath: await chromium.executablePath,
            // args: chromium.args,
            // defaultViewport: chromium.defaultViewport,
            // headless: chromium.headless,

            /* use these when on dev */
            executablePath: '//Applications//Google Chrome.app//Contents//MacOS//Google Chrome',
            args: [],
            headless: true,
        });
        const page = await browser.newPage();
        
        await page.setViewport({
            width: 800,
            height: 600,
            deviceScaleFactor: 1,
            });

        await page.goto(pageToScreenshot,  { waitUntil: 'networkidle2' });
        const description = await page.$eval('meta[property="og:description"]', (element) => element.content);
        const screenshot = await page.screenshot();
        const title = await page.title();
        
        
        await browser.close();


        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'OK',
                message: `Completed screenshot of ${title}`,
                buffer: screenshot,
                page: {
                    title,
                    description,
                }

            })
        }
        browser.disconnect();
    } catch(error) {
        console.log(error)
        document.getElementById('result').textContent = `Error: ${error.toString()}`;
    } 
    
}