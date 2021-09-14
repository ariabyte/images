const express = require("express");
const resize = require("./resize");
const fs = require("fs");
const path = require('path');

const server = express();

const allowedHosts = [
    "api.caards.me",
    "usercontent.caards.me"
];

server.get('/', (req, res) => {
    const widthString = req.query.width;
    const heightString = req.query.height;
    const url = req.query.url;

    if (!url) return res.json({ success: false, error: "Invalid URL" });

    const { hostname } = new URL(url);

    if (!allowedHosts.includes(hostname)) return res.json({ success: false, error: "Invalid hostname" });

    let width, height;
    if (widthString) width = parseInt(widthString);
    if (heightString) height = parseInt(heightString);

    if ((widthString && isNaN(width)) || (heightString && isNaN(height))) return res.json({ success: false, error: "Invalid image sizes" });

    resize(url, width, height, res);
});

server.listen(process.env.PORT || 8500, () => {
    console.log('Server started!');

    fs.readdir("./images", (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join("./images", file), err => {
                if (err) throw err;
            });
        }
    });
});

process.on('uncaughtException', (error) => {
    console.error("[UNCAUGHT ERROR] - " + error);
});

process.on('unhandledRejection', (reason, p) => {
    console.error("[UNHANDLED PROMISE REJECTION] - " + reason);
});