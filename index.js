let url = require("url");
let path = require('path');
const http = require('http');
let fs = require('fs');
let { settings, listError } = require('./export/settings');
let { consoled, isAlphaNumeric } = require('./export/tools');
let { rssAllSides, rssZeroHedge, asLinks, asTitles, zhLinks, zhTitles } = require('./export/rss');
let { refreshMetals, metals } = require('./export/metals');
/*let { refreshRates, rates } = require('./export/rates'); */
let { refreshEngines, yahoo } = require('./export/yahoo');
let { bnBuffer } = require('./export/binance');
let {/* refreshInvesting, investing,*/ refreshTvTA, tvTA, tvApi } = require('./export/puppeteer');
/*let { getCmc, coinmarketcap } = require('./export/coinmarketcap');*/
consoled("init", `creating variables...`);
if (settings.consoled.rss) {
    consoled('rss', 'refreshing zerohedge...');
}
rssZeroHedge();
if (settings.consoled.rss) {
    consoled('rss', 'refreshing allsides...');
}
rssAllSides();
if (settings.consoled.metals) {
    consoled("metal", "refreshing metals...");
}
refreshMetals();
/*if (settings.consoled.rates) {
    consoled("rates", `refreshing rates...`);
}
refreshRates();*/
if (settings.consoled.yahoo) {
    consoled("yahoo", `refreshing yahoo engines...`);
}
refreshEngines();
/*if (settings.consoled.investing) {
    consoled("investing", `refreshing puppeteer investing...`);
}
refreshInvesting();*/
if (settings.consoled.tvTA) {
    consoled("tradingview",`refreshing puppeteer tradingview ta...`);
}
refreshTvTA();
/*if (settings.consoled.coinmarketcap) {
    consoled("cmc", `refreshing coinmarketcap...`);
}
getCmc("map1");*/
let webService = {
    "engines": ["/", "/docs", "/api", "/public"],
    "api": [
        "buffer", "24hrMiniTicker", "allsides",  "crypto", "finances", "rates2", "forexes", "futures", "indices", "indexes", "metals", "zerohedge", "tvta", "alltvta", "weed" /*"coinmarketcap", "commodities", "investing","war", */
    ],
    "public": [
        "index","test", "indices", "futures", "forexes"/*, "war", "finances"*/
    ],
};
var FAVICON = path.join(__dirname, 'public', 'favicon.ico');
const server = http.createServer(function (req, res) {
    let pathName = url.parse(req.url).pathname;
    let searchName = url.parse(req.url).search;
    let queryName = url.parse(req.url).query;
    let queryNameObj;
    if (queryName != null || queryName != undefined) {
        queryNameObj = JSON.parse('{"' + decodeURI(queryName).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }
    if (settings.consoled.query) {
        consoled("query",`path: ${pathName} search: ${searchName}`)
    }
    if (queryNameObj !== undefined) {
        if (queryNameObj.length !== 0) {
            for (let param in queryNameObj) {
                if (!isAlphaNumeric(queryNameObj[param])) {
                    payloadData = JSON.stringify(listError.error403);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(payloadData);
                    res.end();
                }
            }
        }
    }
    let newPathName;
    if (pathName.search(".html") !== -1) {
        newPathName = pathName.slice(0,pathName.search(".html"));
        if (newPathName.indexOf("/") === 0 && newPathName.lastIndexOf("/") !== 0) {
            newPathName = newPathName.slice(0,newPathName.lastIndexOf("/"));
        }
        else if (newPathName.indexOf("/") === 0 && newPathName.lastIndexOf("/") === 0) {
            newPathName = newPathName.slice(0,newPathName.indexOf("/")+1);
        }
    }
    else {
        newPathName = pathName;
    }
    if (webService.engines.indexOf(newPathName) !== -1) {
        switch (newPathName) {
            case "/":
            case "/docs":
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html>');
                res.write('<title>api documentation</title>');
                res.write('<body>');
                res.write('<h1>api documentation =)</h1>');
                res.write('</body>');
                res.write('</html>');
                res.end();
                break;
            case "/api":
                if (webService.api.indexOf(queryNameObj.r) !== -1) {
                    let payloadData = null;
                    let payloadCheck = false;
                    let payloadConstruct = [];
                    switch (queryNameObj.r) {
                        case "alltvta":
                            payloadConstruct = {};
                            for (let engine of tvApi.engines) {
                                payloadConstruct[engine] = {};
                                payloadConstruct[engine] = { ...tvTA[engine].c};
                            }
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case "tvta":
                            if (queryNameObj.s != null || queryNameObj.s != undefined) {
                                if (tvApi.engines.indexOf(queryNameObj.s.toUpperCase()) !== -1) {
                                    payloadData = JSON.stringify(tvTA[queryNameObj.s]);
                                    payloadCheck = true;
                                }
                            }
                            break;
                        case "buffer":
                        case "24hrMiniTicker":
                            if (queryNameObj.s != null || queryNameObj.s != undefined) {
                                if (settings.pairs.indexOf(queryNameObj.s.toUpperCase()) !== -1) {
                                    pairNb = settings.pairs.indexOf(queryNameObj.s.toUpperCase());
                                    payloadData = JSON.stringify(bnBuffer[pairNb].data);
                                    payloadCheck = true;
                                }
                            }
                            break;
                        case "allsides":
                            for (let i = 0; i < 25; i++) {
                                let itemz = {};
                                itemz.title = asTitles[i];
                                itemz.links = asLinks[i];
                                payloadConstruct.push(itemz);
                            }
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case "coinmarketcap":
                            payloadConstruct = {};
                            payloadConstruct = { ...coinmarketcap };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'commodities':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["commodities"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'crypto':
                            payloadConstruct = {};
                            payloadConstruct.btcusdt = bnBuffer[0].data;
                            payloadConstruct.xrpusdt = bnBuffer[1].data;
                            payloadConstruct.ethusdt = bnBuffer[2].data;
                            payloadConstruct.dashusdt = bnBuffer[3].data;
                            payloadConstruct.ltcusdt = bnBuffer[4].data;
                            payloadConstruct.xlmusdt = bnBuffer[5].data;
                            payloadConstruct.xmrusdt = bnBuffer[6].data;
                            payloadConstruct.adausdt = bnBuffer[7].data;
                            payloadConstruct.linkusdt = bnBuffer[8].data;
                            payloadConstruct.dotusdt = bnBuffer[9].data;
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'finances':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["finances"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'rates2':
                        case 'forexes':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["forexes"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'weed':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["weed"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'futures':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["futures"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'indices':
                        case 'indexes':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["indices"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'investing':
                            payloadConstruct = {};
                            payloadConstruct = { ...investing };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'metals':
                            payloadConstruct = {};
                            payloadConstruct.gold = metals.gold;
                            payloadConstruct.silver = metals.silver;
                            payloadConstruct.platinum = metals.platinum;
                            payloadConstruct.palladium = metals.palladium;
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        /*case 'rates':
                            payloadConstruct = {};
                            payloadConstruct = rates;
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;*/
                        case 'war':
                            payloadConstruct = {};
                            payloadConstruct = { ...yahoo["war"] };
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        case 'zerohedge':
                            payloadConstruct = [];
                            for (let item in zhTitles) {
                                let itemz = {};
                                itemz.title = zhTitles[item];
                                itemz.links = zhLinks[item];
                                payloadConstruct.push(itemz);
                            }
                            payloadData = JSON.stringify(payloadConstruct);
                            payloadCheck = true;
                            break;
                        default:
                    }
                    if (payloadCheck) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(payloadData);
                        res.end();
                    }
                    else {
                        payloadData = JSON.stringify(listError.error401);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(payloadData);
                        res.end();
                    }
                }
                else {
                    let payloadData = JSON.stringify(listError.error400);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(payloadData);
                    res.end();
                }
                break;
            case "/public":
                let afterPublic = pathName.replace("/public/", "");
                let extensionlessPublic;
                if (afterPublic.search(".html") !== 0) {
                    extensionlessPublic = afterPublic.replace(".html", "");
                }
                if (webService.public.indexOf(extensionlessPublic) !== -1) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    let html = fs.readFileSync(`./public/${extensionlessPublic}.html`, "utf-8");
                    res.write(html);
                    res.end();
                }
                else {
                    payloadData = JSON.stringify(listError.error404);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(payloadData);
                    res.end();
                }
                break;
            case "/public/favicon.ico":
            case "/favicon.ico":
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                fs.createReadStream(FAVICON).pipe(res);
                break;
            default:
        }
    }
    else {
        payloadData = JSON.stringify(listError.error404);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(payloadData);
        res.end();
    }
});
consoled("http", `webserver listening on 127.0.0.1:${settings.apiPort}`);
server.listen(settings.apiPort);
