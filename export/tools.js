let { settings } = require('./settings');
function consoled(a, text) {
    if (settings.consoled.status) {
        let d = new Date();
        d = d.toLocaleTimeString();
        if (a === 'ticker') {
            console.log(`[${d}] ${settings.name} ${a}: ` + text);
        }
        else {
            console.log(`[${d}] ${settings.name} ${a}: ${text}`);
        }
    }
}
exports.consoled = consoled;
function isAlphaNumeric(value) {
    let code, i, y;
    for (i = 0, y = value.length; i < y; i++) {
        code = value.charCodeAt(i);
        if (!(code == 46 || code == 95) &&
            !(code > 47 && code < 58) &&
            !(code > 64 && code < 91) &&
            !(code > 96 && code < 123)) {
            return false;
        }
    }
    return true;
}
exports.isAlphaNumeric = isAlphaNumeric;