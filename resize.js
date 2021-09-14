const fs = require("fs");
const sharp = require("sharp");
const axios = require("axios");

const cache = new Map();

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i + 1);
}

module.exports = async (url, width, height, res) => {
    try {
        let response = await axios.get(url, { responseType: "arraybuffer" });
        let buffer = Buffer.from(response.data);

        let format = getExtension(response.request.path) || "png";

        let transform = sharp(buffer);

        if (format) transform = transform.toFormat(format);

        if (width || height) transform = transform.resize(width, height);

        let data = await transform.toBuffer();

        res.type(`image/${format}`);
        res.set('Cache-control', 'public, max-age=280800');
        
        res.send(data);
    } catch {
        res.redirect("https://usercontent.caards.me/pxl.png");
    }
}