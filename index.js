import async from "async"
import chalk from "chalk";
import {slugify} from "transliteration";
import { SITE } from "./config.js";
import { arrayFromLength } from './helpers/common.js';
import { getPageElems } from "./helpers/getPageElems.js";

import listItemHandler from './handlers/listItemHandler.js';

const pages = 2; // how many pages would be scrapped 1 page = 20 items
const concurrency = 5; //responsible for how many workers would be
const startTime = new Date();

async function listPageHandler(url, page){
    try{
        const pageContent = await getPageElems(url,page)
        const productItems = [];
            pageContent.map(elem => {
                const productUrl = elem.productUrl;
                const title = elem.productTitle;
                const price = elem.finalPrice;

                productItems.push({                    
                    productUrl,
                    title,
                    price,
                    code: slugify(title),
                })
                
            })
        listItemHandler(productItems)

    } catch(error) {
        console.log(chalk.red('An error has occured\n'));
        throw error
    }
}

export const taskQueue = async.queue(async function(task, callback) {
    try{
        await task();
        console.log(chalk.bold.magenta("task complited, task left: " + taskQueue.length() + '\n'));
        callback;
    }catch(err){
        throw err
    }
}, concurrency);


taskQueue.drain(function() {
    const endTime = new Date();
    console.log(chalk.green.bold(`All items complited [${(endTime - startTime)/ 1000}s]\n`));
    process.exit()
});



(function main(){
    arrayFromLength(pages).forEach(page =>{
        taskQueue.push(
            async () => {
                await listPageHandler(SITE, page)
            },
            (err) => {         
                if (err){
                    console.log(err);
                    throw new Error('🚫 Error getting data from url#' + page);
                }
                console.log(chalk.green.bold(`completed getting data from url: ${page}\n`));
            }

        )
    })
})()
