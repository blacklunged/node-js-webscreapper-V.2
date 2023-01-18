import axios from "axios";
import chalk from "chalk";
export async function getPageElems(site, page) {
    var data = JSON.stringify({
    "catId": "202000005",
    "g": "n",
    "storeIds": [],
    "page": `${page}`,
    "searchInfo": "searchId:0"
    });

    var config = {
    method: 'get',
    url: site,
    headers: { 
        'authority': 'aliexpress.ru', 
        'accept': '*/*', 
        'accept-language': 'ru,en;q=0.9', 
        'bx-v': '2.2.3', 
        'content-type': 'application/json', 
        'cookie': '', 
        'origin': 'https://aliexpress.ru', 
        'referer': 'https://aliexpress.ru/category/202000005/home-appliances.html?g=n&page=3&spm=a2g2w.home.category.2.1ff87eb65Wc1', 
        'sec-ch-ua': '"Chromium";v="106", "Yandex";v="22", "Not;A=Brand";v="99"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'same-origin', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 YaBrowser/22.11.0.2419 Yowser/2.5 Safari/537.36'
    },
    data : data
    };

    return axios(config)
     .then(function (response) {
        console.log(chalk.yellow(`Getting products from API, page: ${page}`))
        return response.data.data.productsFeed.products;
    })
    .catch(function (error) {
        throw error
    });
}

