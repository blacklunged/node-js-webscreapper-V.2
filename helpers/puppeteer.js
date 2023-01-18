import puppeteer from "puppeteer";
import chalk from "chalk";
import { COOKIE_HEADER, ROOT_URL } from "../config.js";


export const LAUNCH_PUPPETEER_OPTS = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
    headless:false
  };
export const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout:5000,
    waitUntil: 'networkidle2',
    timeout: 5000000,
};

export class PuppeteerHandler{
    constructor(){
        this.browser = null
    }
    async initBrowser(){
        this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
        console.log(chalk.blueBright('New browser initiated\n'));
    }
    closeBrowser() {
        this.browser.close();
        console.log(chalk.redBright('browser closed\n'));
      }
    async getPageContent(url){
        if (!this.browser){
            await this.initBrowser()
        }
        try{
            const page = await this.browser.newPage()
            await page.setExtraHTTPHeaders({
                'Cookie': COOKIE_HEADER,  
            })
            await page.goto(ROOT_URL)
            await page.goto(url, PAGE_PUPPETEER_OPTS)
            const content = await page.content()
            await page.close()
            return content 
            
        } catch (err){
            throw err
        }
    }
}
