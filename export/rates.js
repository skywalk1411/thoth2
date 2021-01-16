let { settings } = require('./settings');
let { consoled } = require('./tools');
let { apilayer } = require('./apis');
const fetch = require('node-fetch');
let rates = {};
let key = {
    "current": 0,
    "counter": 0,
}
function getRates() {
    let url = `http://apilayer.net/api/live?access_key=${apilayer.keys[key.current]}&currencies=EUR,GBP,CAD,JPY&source=USD&format=1`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow'
    })
        .then((res, err) => {
            if (err) {
                consoled("error", `rates ${err}`);
            }
            else {
                return res.json()
            }
        })
        .then((json) => {
            if (json.success !== true) {
                if (key.counter === apilayer.keys.length) {
                    if (settings.consoled.rates) {
                        consoled("error", `rates error: max numbers keys spent.`);
                    }
                }
                else {
                    key.current = key.current + 1;
                    key.counter = key.counter + 1;
                    if (settings.consoled.rates) {
                        consoled("retry", `retrying rates in 5sec...`);
                    }
                    setTimeout(getRates, settings.retry.rates);
                }
            }
            else {
                rates.time = json.timestamp;
                rates.usdeur = json.quotes.USDEUR;
                rates.usdgbp = json.quotes.USDGBP;
                rates.usdcad = json.quotes.USDCAD;
                rates.usdjpy = json.quotes.USDJPY;
                if (settings.consoled.rates) {
                    consoled("rates", `currency rates refresh, success.`);
                }
                setTimeout(getRates, settings.refresh.rates);
            }
        })
};
function refreshRates() {
    //consoled("rates",`refreshing rates...`);
    getRates();
}
exports.rates = rates;
exports.refreshRates = refreshRates;