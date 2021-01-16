const settings = {
    "name": 'thoth',
    "server": 'binance',
    "apiPort": 8080,
    "url": 'ws://192.168.0.140:9091',
    "realUrl": 'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/xrpusdt@trade/ethusdt@trade/dashusdt@trade/ltcusdt@trade/xlmusdt@trade/xmrusdt@trade/adausdt@trade/btcusdt@miniTicker/xrpusdt@miniTicker/ethusdt@miniTicker/dashusdt@miniTicker/ltcusdt@miniTicker/xlmusdt@miniTicker/xmrusdt@miniTicker/adausdt@miniTicker',
    "pairs": [
        "BTCUSDT", "XRPUSDT", "ETHUSDT", "DASHUSDT", "LTCUSDT", "XLMUSDT", "XMRUSDT", "ADAUSDT", "LINKUSDT", "DOTUSDT"
    ],
    "consoled": {
        "status": true,
        "investing": true,
        "trade": false,
        "MiniTicker": false,
        "query": true,
        "rss": true,
        "metals": true,
        "rates": true,
        "yahoo": true,
        "rates2": true,
        "indexes": true,
        "futures": true,
        "database": true,
        "dbImports": true,
        "dbExports": true,
        "dbChecks": true,
        "coinmarketcap": true,
        "tvTA": true,
    },
    "refresh": {
        "tvTA": 60000,
        "investing": 120000,
        "rss": 180000,
        "metals": 86400000,
        "rates": 43200000,
        "yahoo": 180000,
        "indexes": 180000,
        "rates": 180000,
        "futures": 120000,
        "coinmarketcap": 120000,
    },
    "retry": {
        "investing": 60000,
        "yahoo": 5000,
        "gold": 5000,
        "rates": 5000,
    },
    "ms": {
        "24h": 86400000,
        "1h": 3600000,
        "30m": 1800000,
        "1m": 60000,
    },
};
exports.settings = settings;
const listError = {
    "error404": {
        "error": 404,
        "desc": 'Not Found.',
    },
    "error400": {
        "error": 400,
        "desc": 'Bad Request.',
    },
    "error401": {
        "error": 401,
        "desc": 'Unauthorized.',
    },
    "error403": {
        "error": 403,
        "desc": 'Forbidden',
    },
    "error429": {
        "error": 429,
        "desc": 'Too many requests.',
    },
};
exports.listError = listError;