let { settings } = require('./settings');
let { consoled } = require('./tools');
const fs = require('fs');
function importer(engine) {
    let json, d;
    try {
        json = fs.readFileSync(`./${engine}.json`, "utf8");
    } catch (error) {
        if (error instanceof Error && error.code === "ENOENT") {
            json = null;
        }
        else {
            throw error;
        }
    }
    return json;
};
exports.importer = importer;
function exporter(engine, content) {
    let json = JSON.stringify(content);
    try {
        fs.writeFileSync(`./${engine}.json`, json);
        consoled("export",`export of ${engine} success.`);
    } catch (error) {
        if (error instanceof Error && error.code === "ENOENT") {
            fs.writeFileSync(`./${engine}.json`, json);
            consoled("export",`export of ${engine} success.`);
        }
        else {
            throw error;
        }
    }
};
exports.exporter = exporter;
/*
function exporter2(engine, content) {
    let json, d;
    try {
        json = fs.readFileSync(`./${engine}.json`, "utf8");
    } catch (error) {
        if (error instanceof Error && error.code === "ENOENT") {
            json = null;
        }
        else {
            throw error;
        }
    }
    if (json === null) {
        d = [];
    }
    else {
        d = JSON.parse(json);
    }
    let d2 = d.concat(content);
    json = JSON.stringify(d2);
    try {
        fs.writeFileSync(`.${engine}.json`, json);
    } catch (error) {
        if (error instanceof Error && error.code === "ENOENT") {
            fs.writeFileSync(`./${engine}.json`, json);
        }
        else {
            throw error;
        }
    }
};
*/

