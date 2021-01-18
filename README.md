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
 - - /api?r=24hrMiniTicker require &s=<symbol>
 - Web Server
 - - /public/index, test, indices, futures, forexes .html
 image: https://imgur.com/rtRst0L

