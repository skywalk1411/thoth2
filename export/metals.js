let { settings } = require('./settings');
let { consoled } = require('./tools');
let { goldApi } = require('./apis');
const fetch = require('node-fetch');
let key = {
    "current": 0,
    "counter" : 0,
};
let metals = {};
/* @@@ load null data on start prevent api bad call */
/*let metalsNull = {
    "time": null,
    "openTime": null,
    "open": null,
    "high": null,
    "low": null,
    "close": null,
    "ch": null,
    "chp": null,
    "ask": null,
    "bid": null,
};*/
metals.gold = {};
metals.silver = {};
metals.platinum = {};
metals.palladium = {};
function getMetals(metal) {
    let url;
    switch (metal) {
        case 'gold':
            url = goldApi.gold;
            break;
        case 'silver':
            url = goldApi.silver;
            break;
        case 'platinum':
            url = goldApi.platinum;
            break;
        case 'palladium':
            url = goldApi.palladium;
            break;
        default:
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': goldApi.keys[key.current]
        },
        redirect: 'follow'
    })
        .then((res, err) => {
            if (err) {
                consoled("error", `metals: ${metal}, ${err}`);
                if (key.counter === goldApi.keys.length) {
                    consoled("error",`metals: ${metal} error: max number keys spent.`);
                }
                else {
                    key.current = key.current+1;
                    key.counter = key.counter+1;
                    consoled("retry",`retrying metal: ${metal} in 5sec...`);
                    setTimeout(getMetals(metal),settings.retry.gold);
                }
            }
            else {
                return res.json()
            }
        })
        .then((json) => {
            if (json.error) {
                consoled("error", `metals: ${metal} error: ${json.error}`);
                if (key.counter === goldApi.keys.length) {
                    consoled("error",`metals: ${metal} error: max number keys spent.`);
                }
                else {
                    key.current = key.current+1;
                    key.counter = key.counter+1;
                    consoled("retry",`retrying metal: ${metal} in 5sec...`);
                    setTimeout(getMetals(metal),settings.retry.gold);
                }
            }
            else {
                metals[metal].time = json.timestamp;
                metals[metal].openTime = json.open_time;
                metals[metal].open = json.open_price;
                metals[metal].high = json.high_price;
                metals[metal].low = json.low_price;
                metals[metal].close = json.price.toFixed(4);
                metals[metal].ch = json.ch;
                metals[metal].chp = json.chp;
                metals[metal].ask = json.ask;
                metals[metal].bid = json.bid;
                metals[metal].trend = (json.open_price > json.price) ? 'bear' : (json.open_price < json.price) ? 'bull' : 'side';
                if (settings.consoled.metals) {
                    consoled("metal", `${metal} refresh, success.`);
                }
            }

        })
};
function refreshMetals() {
    getMetals("gold");
    getMetals("silver");
    getMetals("platinum");
    getMetals("palladium");
    setTimeout(refreshMetals, settings.refresh.metals);
};
exports.metals = metals;
exports.refreshMetals = refreshMetals;