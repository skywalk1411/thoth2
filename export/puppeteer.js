//const { env } = require('process');
const puppeteer = require('puppeteer');
let { settings } = require('./settings');
let { consoled } = require('./tools');
let investingApi = {
    "pushable": {
        "country": null,
        "name": null,
        "symbol": null,
        "last": null,
        "high": null,
        "low": null,
        "ch": null,
        "chp": null,
        "time": null,
        "status": "init",
        "error": null,
        "retry": 0,
    },
}
let cmcApi = {
    "pushable": {
        "status": null,
        "name": null,
        "symbol": null,
        "rank": null,
        "price": null,
        "price_24h": null,
        "price_7d": null,
        "marketcap": null,
        "volume_fiat": null,
        "volume_btc": null,
        "circulating_supply": null,
        "trend": null,
    },
}
const tvApi = {
    "engines": ["BTCUSD", "ETHUSD", "XRPUSD", "DASHUSD", "LTCUSD", "LINKUSD", "DOTUSD", "XMRUSD", "ADAUSD", "XLMUSD"],
}
let cmc = {};
let cmcCheck = false;
let investing = {};
let investingCheck = false;
let tvTA = {};
function envTV() {
    for (let engine in tvApi.engines) {
        tvTA[engine] = {};
    }
};
envTV();

function pushInvesting(content) {
    for (let item in content.a) {
        if (investingCheck === false) {
            investing[item] = {};
            investing[item] = { ...investingApi.pushable };
        }
        investing[item] = content.a[item];
        investing[item].status = "full";
    }
    investingCheck = true;
};
function pushTA(symbol, data) {
    tvTA[symbol] = data;
};

/*
1m div.tab-B2mArR2X:nth-child(1)
5m div.tab-B2mArR2X:nth-child(2)
15m div.tab-B2mArR2X:nth-child(3)
1h div.tab-B2mArR2X:nth-child(4)
4h div.tab-B2mArR2X:nth-child(5)
1d div.tab-B2mArR2X:nth-child(6)
1w div.tab-B2mArR2X:nth-child(7)
1M div.tab-B2mArR2X:nth-child(8)
*/
function fetchTvTA() {
    (async function () {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: 800,
                height: 600,
            });
            for (let symbol of tvApi.engines) {
                await page.goto(`https://www.tradingview.com/symbols/${symbol}/technicals/`, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('tr.row-3rEbNObt:nth-child(18) > td:nth-child(3)');
                const results = await page.evaluate(() => {
                    let a = {};
                    let b = {};
                    let temp = 'oscillators';
                    a[temp] = {};
                    b[temp] = {};
                    a[temp].rsi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)`).innerText;
                    b[temp].rsi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)`).innerText;
                    a[temp].stoch = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)`).innerText;
                    b[temp].stoch = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3)`).innerText;
                    a[temp].cci = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)`).innerText;
                    b[temp].cci = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)`).innerText;
                    a[temp].adi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)`).innerText;
                    b[temp].adi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(3)`).innerText;
                    a[temp].ao = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)`).innerText;
                    b[temp].ao = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)`).innerText;
                    a[temp].mom = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)`).innerText;
                    b[temp].mom = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(3)`).innerText;
                    a[temp].macdlevel = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)`).innerText;
                    b[temp].macdlevel = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(3)`).innerText;
                    a[temp].stochrsi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(2)`).innerText;
                    b[temp].stochrsi = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(3)`).innerText;
                    a[temp].wpr = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)`).innerText;
                    b[temp].wpr = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(3)`).innerText;
                    a[temp].bbp = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(2)`).innerText;
                    b[temp].bbp = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(3)`).innerText;
                    a[temp].uo = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(2)`).innerText;
                    b[temp].uo = document.querySelector(`div.container-2w8ThMcC:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(3)`).innerText;
                    let temp2 = "movingaverages";
                    a[temp2] = {};
                    b[temp2] = {};
                    a[temp2].ema5 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)`).innerText;
                    b[temp2].ema5 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)`).innerText;
                    a[temp2].sma5 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)`).innerText;
                    b[temp2].sma5 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3)`).innerText;
                    a[temp2].ema10 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)`).innerText;
                    b[temp2].ema10 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)`).innerText;
                    a[temp2].sma10 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)`).innerText;
                    b[temp2].sma10 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(3)`).innerText;
                    a[temp2].ema20 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)`).innerText;
                    b[temp2].ema20 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)`).innerText;
                    a[temp2].sma20 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)`).innerText;
                    b[temp2].sma20 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(3)`).innerText;
                    a[temp2].ema30 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)`).innerText;
                    b[temp2].ema30 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(3)`).innerText;
                    a[temp2].sma30 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(2)`).innerText;
                    b[temp2].sma30 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(3)`).innerText;
                    a[temp2].ema50 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)`).innerText;
                    b[temp2].ema50 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(3)`).innerText;
                    a[temp2].sma50 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(2)`).innerText;
                    b[temp2].sma50 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(3)`).innerText;
                    a[temp2].ema100 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(2)`).innerText;
                    b[temp2].ema100 = document.querySelector(`div.container-2w8ThMcC:nth-child(2) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(3)`).innerText;
                    a[temp2].sma100 = document.querySelector(`tr.row-3rEbNObt:nth-child(13) > td:nth-child(2)`).innerText;
                    b[temp2].sma100 = document.querySelector(`tr.row-3rEbNObt:nth-child(13) > td:nth-child(3)`).innerText;
                    a[temp2].ema200 = document.querySelector(`tr.row-3rEbNObt:nth-child(14) > td:nth-child(2)`).innerText;
                    b[temp2].ema200 = document.querySelector(`tr.row-3rEbNObt:nth-child(14) > td:nth-child(3)`).innerText;
                    a[temp2].sma200 = document.querySelector(`tr.row-3rEbNObt:nth-child(15) > td:nth-child(2)`).innerText;
                    b[temp2].sma200 = document.querySelector(`tr.row-3rEbNObt:nth-child(15) > td:nth-child(3)`).innerText;
                    a[temp2].icbl = document.querySelector(`tr.row-3rEbNObt:nth-child(16) > td:nth-child(2)`).innerText;
                    b[temp2].icbl = document.querySelector(`tr.row-3rEbNObt:nth-child(16) > td:nth-child(3)`).innerText;
                    a[temp2].vwma = document.querySelector(`tr.row-3rEbNObt:nth-child(17) > td:nth-child(2)`).innerText;
                    b[temp2].vwma = document.querySelector(`tr.row-3rEbNObt:nth-child(17) > td:nth-child(3)`).innerText;
                    a[temp2].hma = document.querySelector(`tr.row-3rEbNObt:nth-child(18) > td:nth-child(2)`).innerText;
                    b[temp2].hma = document.querySelector(`tr.row-3rEbNObt:nth-child(18) > td:nth-child(3)`).innerText;
                    return { a, b }
                })
                let abuy = 0, asell = 0, aside = 0;
                for (let pair in results["b"]["oscillators"]) {
                    if (results["b"]["oscillators"][pair] === "Sell") {
                        asell++;
                    }
                    else if (results["b"]["oscillators"][pair] === "Buy") {
                        abuy++;
                    }
                    else {
                        aside++;
                    }
                }
                for (let pair in results["b"]["movingaverages"]) {
                    if (results["b"]["movingaverages"][pair] === "Sell") {
                        asell++;
                    }
                    else if (results["b"]["movingaverages"][pair] === "Buy") {
                        abuy++;
                    }
                    else {
                        aside++;
                    }
                }
                results["c"] = {};
                results["c"].sells = asell;
                results["c"].neutrals = aside;
                results["c"].buys = abuy;
                if (asell > abuy + aside) {
                    results["c"].trend = "s-sell!";
                }
                else if (asell > abuy && asell >= aside) {
                    results["c"].trend = "sell"
                }
                else if (abuy > asell + aside) {
                    results["c"].trend = "s-buy!";
                }
                else if (abuy > asell && abuy >= aside) {
                    results["c"].trend = "buy";
                }
                else {
                    results["c"].trend = "neutral";
                }
                pushTA(symbol, results);

            }
            await browser.close();
            consoled("tv", `puppeteer TA refresh success. `);
            setTimeout(fetchTvTA, settings.refresh.tvTA);
        } catch (e) {
            consoled('error:', `puppeteer TA error ${e}, retrying...`);
            setTimeout(fetchTvTA, settings.refresh.tvTA);
        }
    })();
};
function refreshTvTA() {
    fetchTvTA();
};
function refreshInvesting() {
    (async function () {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: 800,
                height: 600,
            });
            await page.goto('https://www.investing.com/indices/major-indices', { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.pid-995072-time');
            const results = await page.evaluate(() => {
                const investng = ["169", "166", "14958", "170", "44336", "24441", "17920", "27254", "172", "27", "167", "175", "168", "174", "177", "176", "14600", "14601", "1016254", "25685", "1073055", "13666", "13665", "14602", "38014", "19155", "10529", "11319", "178", "171", "41141", "40820", "942630", "28930", "954522", "179", "38017", "38015", "37426", "29049", "17940", "39929", "49692", "49677", "995072"];
                let a = {};
                for (let symbol of investng) {
                    let oSymbol = investng.indexOf(symbol);
                    let temp = document.querySelector(`.closedTbl > tbody:nth-child(2) > tr:nth-child(${oSymbol + 1}) > td:nth-child(2) > a:nth-child(1)`).innerText;
                    a[temp] = {};
                    a[temp].country = document.querySelector(`.closedTbl > tbody:nth-child(2) > tr:nth-child(${oSymbol + 1}) > td:nth-child(1) > span:nth-child(1)`).title;
                    a[temp].name = document.querySelector(`.closedTbl > tbody:nth-child(2) > tr:nth-child(${oSymbol + 1}) > td:nth-child(2) > a:nth-child(1)`).title;
                    a[temp].symbol = document.querySelector(`.closedTbl > tbody:nth-child(2) > tr:nth-child(${oSymbol + 1}) > td:nth-child(2) > a:nth-child(1)`).innerText;
                    a[temp].last = document.querySelector(`.closedTbl > tbody:nth-child(2) > tr:nth-child(${oSymbol + 1}) > td:nth-child(3)`).innerText;
                    a[temp].high = document.querySelector(`.pid-${symbol}-high`).innerText;
                    a[temp].low = document.querySelector(`.pid-${symbol}-low`).innerText;
                    a[temp].ch = document.querySelector(`td.pid-${symbol}-pc:nth-child(6)`).innerText;
                    a[temp].chp = document.querySelector(`td.pid-${symbol}-pcp:nth-child(7)`).innerText;
                    a[temp].time = document.querySelector(`.pid-${symbol}-time`).innerText;
                }
                return { a }
            })
            await browser.close();
            pushInvesting(results);
            consoled("investing", `refresh success. `);
            setTimeout(refreshInvesting, settings.refresh.investing);

        } catch (e) {
            //await browser.close();
            consoled('error:', `puppeteer investing ${e}, retrying...`);
            setTimeout(refreshInvesting, settings.retry.investing);
        }
    })();
};
/*  .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1)  */
/*
.cmc-table > tbody:nth-child(3) > tr:nth-child(101) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)
rank: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2) > p:nth-child(1)
name: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)
symbol: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)
price: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1)
24h: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(5) > span:nth-child(1)
7d: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(6) > div:nth-child(1) > span:nth-child(1)
marketcap: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(7) > p:nth-child(1)
volume: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(8) > div:nth-child(1) > a:nth-child(1) > p:nth-child(1)
volumebtc: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(8) > div:nth-child(1) > p:nth-child(2)
supply: .cmc-table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(9) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2)

*/
function refreshCmc() {
    (async function () {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: 800,
                height: 600,
            });
            await page.goto('https://coinmarketcap.com/', { waitUntil: 'domcontentloaded' });
            //await page.waitForSelector('.cmc-table > tbody:nth-child(3) > tr:nth-child(100) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1)');
            const results = await page.evaluate(() => {
                let a = {};
                let i = 1;
                while (i <= 101) {
                    console.log(i);
                    let namez = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)`).innerText;
                    a[namez] = {};
                    //a[namez].rank = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(2) > p:nth-child(1)`).innerText;
                    a[namez].name = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)`).innerText;
                    //a[namez].symbol = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(3) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)`).innerText;
                    a[namez].price = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1)`).innerText;
                    //a[namez].price_24h = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(5) > span:nth-child(1)`).innerText;
                    //a[namez].price_7d = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(6) > div:nth-child(1) > span:nth-child(1)`).innerText;
                    //a[namez].marketcap = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(7) > p:nth-child(1)`).innerText;
                    //a[namez].volume_fiat = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(8) > div:nth-child(1) > a:nth-child(1) > p:nth-child(1)`).innerText;
                    //a[namez].volume_btc = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(8) > div:nth-child(1) > p:nth-child(2)`).innerText;
                    //a[namez].circulating_supply = document.querySelector(`.cmc-table > tbody:nth-child(3) > tr:nth-child(${i}) > td:nth-child(9) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2)`).innerText;
                    i++;
                }
                return { a }
            })
            await browser.close();
            console.log(results["a"]);
        } catch (e) {
            consoled('error:', `puppeteer investing ${e}, retrying...`);
            setTimeout(refreshCmc, settings.retry.investing);
        }
    })();
};
//refreshCmc();
exports.refreshInvesting = refreshInvesting;
exports.investing = investing;
exports.refreshTvTA = refreshTvTA;
exports.tvTA = tvTA;
exports.tvApi = tvApi;
