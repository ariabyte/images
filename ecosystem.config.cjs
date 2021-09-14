module.exports = {
  apps : [{
    name   : "Media Resized",
    script : "./index.js",
    post_update: ["npm install"],
    autorestart: true,
    restart_delay: 4000,
    max_restarts: 100
  }]
}
