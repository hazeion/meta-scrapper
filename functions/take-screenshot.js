const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event, context) => {
    try {
        const params = JSON.parse(event.body);
        const pageToScreenshot = params.pageToScreenshot;

        // add chromium. to puppeteer launch when deploying

        console.log(event.body);

        const browser = await puppeteer.launch({

            /* use this when deploying */
            // executablePath: await chromium.executablePath,
            // args: chromium.args,
            // headless: chromium.headless,

            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: [],
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(pageToScreenshot);

        const screenshot = await page.screenshot({ encoding: 'binary'});
        const title = await page.title();

        const descriptionCheck = await page.$('meta[property="og:description"]');
        const description = await page.$eval('meta[property="og:description"]', element => element.content);
        
        console.log(descriptionCheck)

        await browser.close();


        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'OK',
                message: `Completed screenshot of diablo`,
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
    } 
    
}