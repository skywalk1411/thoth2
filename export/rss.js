let Parser = require('rss-parser');
let { settings } = require('./settings');
let { consoled } = require('./tools');
let zhTitles = [];
let zhLinks = [];
let asTitles = [];
let asLinks = [];
function rssZeroHedge() {
    let parser = new Parser();
    zhTitles.length = 0;
    zhLinks.length = 0;
    (async () => {
        let feed = await parser.parseURL('http://feeds.feedburner.com/zerohedge/feed');
        if (feed.items) {
            feed.items.forEach(item => {
                zhTitles.push(item.title);
                zhLinks.push(item.link);
            });
            if (settings.consoled.rss) {
                consoled('rss', `zerohedge scan complete. ${zhTitles.length} items.`);
            }
            setTimeout(rssZeroHedge, settings.refresh.rss);
        }
        else {
            consoled("error",`rss zerohedge error no items...`);
            setTimeout(rssZeroHedge, settings.refresh.rss);
        }
    })();
};
exports.rssZeroHedge = rssZeroHedge;
function rssAllSides() {
    let parser2 = new Parser();
    asTitles.length = 0;
    asLinks.length = 0;
    (async () => {
        let feed2 = await parser2.parseURL('https://www.allsides.com/news/rss');
        if (feed2.items) {
            feed2.items.forEach(item => {
                asTitles.push(item.title);
                asLinks.push(item.link);
            });
            if (settings.consoled.rss) {
                consoled('rss', `allsides scan complete. ${asTitles.length} items.`);
            }
            setTimeout(rssAllSides, settings.refresh.rss);
        }
        else {
            consoled("error",`rss allsides error no items...`);
            setTimeout(rssAllSides, settings.refresh.rss);
        }
    })();
};
function zhReturn(a) {
    switch (a) {
        case 'l':
            return zhLinks;
        case 't':
            return zhTitles;
        default:
    }
};
function asReturn(a) {
    switch (a) {
        case 'l':
            return asLinks;
        case 't':
            return asTitles;
        default:
    }
};
exports.rssAllSides = rssAllSides;
exports.zhLinks = zhReturn('l');
exports.zhTitles = zhReturn('t');
exports.asLinks = asReturn('l');
exports.asTitles = asReturn('t');