const fs = require("fs");
const sharp = require("sharp");
const axios = require("axios");

const cache = new Map();

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i + 1);
}

module.exports = async function resize(url, width, height, res, image) {

    try {
        if (cache.get(url + width + height + format)) {
            const readStream = fs.createReadStream(cache.get(url + width + height + format));
            return readStream.pipe(res);
        }

        let response = await axios.get(url, { responseType: "arraybuffer" });
        let format = getExtension(response.request.path) || "png";
        let rnd = Math.random();
        let image = image || "./images/" + rnd + "e." + format;
        let buffer = Buffer.from(response.data);

        let transform = sharp(buffer);

        if (format) transform = transform.toFormat(format);

        if (width || height) transform = transform.resize(width, height);

        let data = await transform.toBuffer();

        res.type(`image/${format}`);
        res.set('Cache-control', 'public, max-age=280800');
        
        res.send(data);

        cache.set(url + width + height + format, image)
        transform.toFile(image).catch((err) => {
            resize("https://usercontent.caards.me/pxl.png", format, width, height, res, image);
        });
    } catch {
        resize("https://usercontent.caards.me/pxl.png", width, height, res, image);
    }
}