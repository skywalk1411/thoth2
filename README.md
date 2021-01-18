# thoth2

Thoth2 v1.0

Fetch data from :
- Yahoo api
- Binance Websocket
- ZeroHedge and AllSides Rss
- TradingView Technical Analysis
- Investing.com
- goldapi.io

Require:
- index.js (main node.js launcher)
- index_binance.js (binance websocket mirror)
- goldapi.io api keys
 to load.
 
 Features:
 - Web Apis
 - - /api?r=24hrMiniTicker,allsides,zerohedge,forexes,futures,indices,metals,tvta,weed,alltvta
 - - /api?r=tvta require &s=symbol ex:btcusd,ethusd
 - - /api?r=24hrMiniTicker require &s=symbol ex: btcusdt,ethusdt
 - Web Server
 - - /public/index, test, indices, futures, forexes .html
 image: https://imgur.com/rtRst0L

ToDo:
- WebServer [index]
- - Auto creating root page [/public/index]
- - Auto creating doc page [/public/engines?]
- - Build Status page [/admin]
- - Public [/public]
- - - Auto created per category glance pages [/public/engines?]
- - - *Bug in finances too big object to process loop. [/public/finances]
- Api [index]
- - Add api limit feature
- - Add authentication feature
- - Add log request
- Weather [/export/weather]
- - Add current location weather
- Error Handling [*]
- TvTA per 1m, 5m, 15m 1h, 4h, 1d, 1w, 1M [/export/puppeteer]
- Bugs
- - crash if request some api with empty data while launching. [index]
- - rss crash if rss server is down [/export/rss]
- - yahoo crash if hit by yahoo api limit, need proxy [/export/yahoo]
- - index_binance doesn't always reconnect if disconnected [index_binance]
