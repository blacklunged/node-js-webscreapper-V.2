import chalk from "chalk"
import cherio from "cherio"

import { taskQueue} from "../index.js";
import { ROOT_URL } from "../config.js";
import saveData from "./saver.js";
import { PuppeteerHandler } from "../helpers/puppeteer.js";

const task = async (initialData, p) => {
    try{
        await p.initBrowser()
        console.log(chalk.green(`Getting data from:`) + chalk.green.bold(initialData.productUrl));
        const detailContent = await p.getPageContent(`${ROOT_URL}${initialData.productUrl}`)
        const $ = cherio.load(detailContent)
        const characteristics = []
        $('.SnowProductCharacteristics_SnowProductCharacteristics__item__1du3t').each((i, elem) => {
            const name = $(elem).children().first().text()
            const characteristic = $(elem).children().last().text()
            characteristics.push({
                name,
                characteristic
            })
        })
        await saveData({
            ...initialData,
            characteristics
        })

    }catch(err){
        throw err;
    }

}
export default function listItemHandler(data){
    data.forEach(initialData => {
        const p = new PuppeteerHandler()
        taskQueue.push(
            async () => await task(initialData, p),
            (err) => {
                if (err){
                    console.log(err);
                    throw new Error(` Error getting data from url [ ${initialData.productUrl}]`)
                }
                p.closeBrowser()
                console.log(chalk.green.bold(`Completed getting data from page#${initialData.productUrl}\n`));
            }
        )
    });
}


