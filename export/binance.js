let websocket = require('websocket');
let { settings } = require('./settings');
let { consoled } = require('./tools');
let bnBuffer = [];
function initBnBuffer(x) {
    if (x === null) {
        for (let pair in settings.pairs) {
            bnBuffer.push({ "data": {}, "name": pair, "process": true, "status": false });
        }
    }
}
function initBnBufferData(x) {
    if (x <= settings.pairs.length) {
        bnBuffer[x].data = {};
        bnBuffer[x].data = { "timestamp": null, "date": null, "lag": null, "open": null, "high": null, "low": null, "close": null, "allVolume": 0, "allQuote": 0, "trend": null };
    }
    else if (x === "null") {
        for (let pair in settings.pairs) {
            bnBuffer[pair].data = { "timestamp": null, "date": null, "lag": null, "open": null, "high": null, "low": null, "close": null, "ch": null, "chp": null, "allVolume": 0, "allQuote": 0, "trend": null };
        }
    }
    else {
        consoled('error', 'initBnBufferData param invalid.');
    }
}
function bnSortPayload(x) {
    if (settings.pairs.includes(x.s)) {
        bnProcessPayload(x, settings.pairs.indexOf(x.s));
    }
}
function bnProcessPayload(x, pair) {
    bnBuffer[pair].data.timestamp = new Date(x.E);
    bnBuffer[pair].data.date = new Date();
    bnBuffer[pair].data.lag = bnBuffer[pair].data.date - bnBuffer[pair].data.timestamp;
    bnBuffer[pair].data.open = x.o;
    bnBuffer[pair].data.high = x.h;
    bnBuffer[pair].data.low = x.l;
    bnBuffer[pair].data.close = x.c;
    bnBuffer[pair].data.allVolume = x.v;
    bnBuffer[pair].data.allQuote = x.q;
    bnBuffer[pair].data.trend = (bnBuffer[pair].data.open > bnBuffer[pair].data.close) ? 'bear' : (bnBuffer[pair].data.open < bnBuffer[pair].data.close) ? 'bull' : 'side';
    bnBuffer[pair].data.ch = (bnBuffer[pair].data.trend === "bear") ? (Number(bnBuffer[pair].data.open) - Number(bnBuffer[pair].data.close)).toFixed(4) : (bnBuffer[pair].data.trend === "bull") ? (Number(bnBuffer[pair].data.close) - Number(bnBuffer[pair].data.open)).toFixed(4) : 0;
    bnBuffer[pair].data.chp = (bnBuffer[pair].data.trend === "bear") ? (((Number(bnBuffer[pair].data.open) - Number(bnBuffer[pair].data.close)) / Number(bnBuffer[pair].data.close)) * 100).toFixed(2) : (bnBuffer[pair].data.trend === "bull") ? (((Number(bnBuffer[pair].data.close) - Number(bnBuffer[pair].data.open)) / Number(bnBuffer[pair].data.close)) * 100).toFixed(2) : 0;
    bnBuffer[pair].status = true;
}
initBnBuffer(null);
initBnBufferData("null");
let wsBn = new websocket.client();
wsBn.on('connectFailed', function (error) {
    consoled("error", `wss onConnectFailed ` + error.toString());
});
wsBn.on('connect', function (bnConnection) {
    consoled("wss", `${settings.server} connected.`);
    bnConnection.on('error', function (error) {
        consoled("error", `wss onConnect ` + error.toString());
    });
    bnConnection.on('close', function (error) {
        consoled("error", `wss onClose ` + error.toString());
        // @@@ to do
        //wsBnReconnect();
    });
    bnConnection.on('message', function (message) {
        if (message.type === 'utf8') {
            let payload = JSON.parse(message.utf8Data);
            if (!payload.data) { return; }
            else {
                switch (payload.data.e) {
                    case 'trade':
                        if (settings.consoled.trade) {
                            console.log(payload);
                        }
                        break;
                    case '24hrMiniTicker':
                        if (settings.consoled.MiniTicker) {
                            console.log(payload);
                        }
                        bnSortPayload(payload.data);
                        break;
                    default:
                }
            }
        }
    });
});
consoled("wss", `${settings.server} connecting...`);
wsBn.connect(settings.url, null);
exports.bnBuffer = bnBuffer;