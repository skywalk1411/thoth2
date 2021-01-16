
const websocket = require('websocket');
const WebSocket = require('ws');
const relay = {
    "name": 'anubis',
    "port": 9091,
};
const settings = {
    "name": 'binance',
    "wsUrl": 'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/xrpusdt@trade/ethusdt@trade/dashusdt@trade/ltcusdt@trade/xlmusdt@trade/xmrusdt@trade/adausdt@trade/linkusdt/linkusdt@miniTicker/dotusdt/dotusdt@miniTicker/btcusdt@miniTicker/xrpusdt@miniTicker/ethusdt@miniTicker/dashusdt@miniTicker/ltcusdt@miniTicker/xlmusdt@miniTicker/xmrusdt@miniTicker/adausdt@miniTicker',
};
function coolDate() {
    let laDate = new Date();
    let result = "" + laDate.getMonth() + "-" + laDate.getDate() + "-" + laDate.getHours() + ":" + laDate.getMinutes() + ";" + laDate.getSeconds();
    return result;
}
console.log(`[${coolDate()}] ${relay.name} ${settings.name} proxy ${settings.wsUrl}`);
console.log(`[${coolDate()}] master init localhost:${relay.port}`)
const wss = new WebSocket.Server({ port: relay.port });
wss.on('connection', function connection(ws) {
    console.log(`[${coolDate()}] master new connection`);
    /*ws.on('message', function incoming(data) {
    })*/
});
console.log(`[${coolDate()}] master init success`);

function reconnecBm() {
    console.log(`[${coolDate()}] ${settings.name} reconnecting...`);
    wsBm.connect(settings.wsUrl, null);
};
const wsBm = new websocket.client();
wsBm.on('connectFailed', function (error) {
    console.log(`[${coolDate()}] ${settings.name} error onConnectFailed ` + error.toString());
});
wsBm.on('connect', function (bmConnection) {
    console.log(`[${coolDate()}] ${settings.name} init connected`);
    bmConnection.on('error', function (error) {
        console.log(`[${coolDate()}] ${settings.name} error onConnectError ` + error.toString());
    });
    bmConnection.on('close', function (error) {
        console.log(`[${coolDate()}] ${settings.name} error onClose` + error.toString());
        reconnecBm();
    });
    bmConnection.on('message', function (message) {
        if (message.type === 'utf8') {
            //let payload = JSON.parse(message.utf8Data);
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.utf8Data);
                }
            });
        }
    });
});
console.log(`[${coolDate()}] ${settings.name} init connecting...`);
wsBm.connect(settings.wsUrl, null);